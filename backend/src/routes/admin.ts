import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { adminAuth } from '../middleware/auth';
import { broadcast } from '../lib/broadcast';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = signToken({ role: 'admin', username });
  res.json({ token });
});

router.get('/settings', adminAuth, async (_req, res) => {
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  res.json(settings);
});

router.patch('/settings', adminAuth, async (req, res) => {
  const { judgePortal, audiencePortal, quizPortal, pitchDuration, quizDuration } = req.body;
  const updated = await prisma.appSettings.update({
    where: { id: 1 },
    data: {
      ...(judgePortal !== undefined && { judgePortal }),
      ...(audiencePortal !== undefined && { audiencePortal }),
      ...(quizPortal !== undefined && { quizPortal }),
      ...(pitchDuration !== undefined && { pitchDuration }),
      ...(quizDuration !== undefined && { quizDuration }),
    },
  });
  broadcast({ type: 'settings_update', data: updated });
  res.json(updated);
});

router.post('/pitch/start', adminAuth, async (req, res) => {
  const { teamId } = req.body;
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  const pitchEndTime = new Date(Date.now() + (settings!.pitchDuration * 60 * 1000));

  await prisma.team.updateMany({ data: { status: 'WAITING' } });
  await prisma.team.update({ where: { id: teamId }, data: { status: 'PRESENTING' } });
  const updated = await prisma.appSettings.update({
    where: { id: 1 },
    data: { activeTeamId: teamId, pitchEndTime },
  });

  const teams = await prisma.team.findMany({ include: { members: true }, orderBy: { order: 'asc' } });
  broadcast({ type: 'state_update', data: { settings: updated, teams } });
  res.json({ settings: updated, teams });
});

router.post('/pitch/stop', adminAuth, async (_req, res) => {
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (settings?.activeTeamId) {
    await prisma.team.update({ where: { id: settings.activeTeamId }, data: { status: 'COMPLETED' } });
  }
  const updated = await prisma.appSettings.update({
    where: { id: 1 },
    data: { activeTeamId: null, pitchEndTime: null },
  });
  const teams = await prisma.team.findMany({ include: { members: true }, orderBy: { order: 'asc' } });
  broadcast({ type: 'state_update', data: { settings: updated, teams } });
  res.json({ settings: updated, teams });
});

router.post('/pitch/restart', adminAuth, async (_req, res) => {
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (!settings?.activeTeamId) {
    res.status(400).json({ error: 'No active pitch' });
    return;
  }
  const pitchEndTime = new Date(Date.now() + (settings.pitchDuration * 60 * 1000));
  const updated = await prisma.appSettings.update({ where: { id: 1 }, data: { pitchEndTime } });
  broadcast({ type: 'settings_update', data: updated });
  res.json(updated);
});

router.post('/pitch/reset-team', adminAuth, async (req, res) => {
  const { teamId } = req.body;
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  if (settings?.activeTeamId === teamId) {
    await prisma.appSettings.update({ where: { id: 1 }, data: { activeTeamId: null, pitchEndTime: null } });
  }
  await prisma.team.update({ where: { id: teamId }, data: { status: 'WAITING' } });
  const [updatedSettings, teams] = await Promise.all([
    prisma.appSettings.findUnique({ where: { id: 1 } }),
    prisma.team.findMany({ include: { members: true }, orderBy: { order: 'asc' } }),
  ]);
  broadcast({ type: 'state_update', data: { settings: updatedSettings, teams } });
  res.json({ settings: updatedSettings, teams });
});

router.post('/quiz/start', adminAuth, async (_req, res) => {
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  const quizEndTime = new Date(Date.now() + (settings!.quizDuration * 60 * 1000));
  const updated = await prisma.appSettings.update({ where: { id: 1 }, data: { quizEndTime } });
  broadcast({ type: 'settings_update', data: updated });
  res.json(updated);
});

router.post('/quiz/reset', adminAuth, async (_req, res) => {
  const updated = await prisma.appSettings.update({ where: { id: 1 }, data: { quizEndTime: null } });
  broadcast({ type: 'settings_update', data: updated });
  res.json(updated);
});

router.post('/judges', adminAuth, async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const judge = await prisma.judge.create({
      data: { email, name: name || '', passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    res.status(201).json(judge);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'Judge with this email already exists' });
      return;
    }
    throw e;
  }
});

router.get('/judges', adminAuth, async (_req, res) => {
  const judges = await prisma.judge.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json(judges);
});

router.get('/scores', adminAuth, async (_req, res) => {
  const scores = await prisma.judgeScore.findMany({
    include: {
      judge: { select: { id: true, email: true, name: true } },
      team: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  res.json(scores);
});

router.patch('/scores/:id', adminAuth, async (req, res) => {
  const { costEffectiveness, medicalImpact, feasibility, technicalExecution, note } = req.body;
  const updated = await prisma.judgeScore.update({
    where: { id: req.params.id },
    data: {
      ...(costEffectiveness !== undefined && { costEffectiveness: Number(costEffectiveness) }),
      ...(medicalImpact !== undefined && { medicalImpact: Number(medicalImpact) }),
      ...(feasibility !== undefined && { feasibility: Number(feasibility) }),
      ...(technicalExecution !== undefined && { technicalExecution: Number(technicalExecution) }),
      ...(note !== undefined && { note }),
    },
    include: {
      judge: { select: { id: true, email: true, name: true } },
      team: { select: { id: true, name: true } },
    },
  });
  broadcast({ type: 'scores_update' });
  res.json(updated);
});

router.get('/score-requests', adminAuth, async (_req, res) => {
  const requests = await prisma.scoreRequest.findMany({
    include: {
      judge: { select: { id: true, email: true, name: true } },
      team: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(requests);
});

router.patch('/score-requests/:id', adminAuth, async (req, res) => {
  const { status } = req.body;
  const updated = await prisma.scoreRequest.update({
    where: { id: req.params.id },
    data: { status },
    include: {
      judge: { select: { id: true, email: true, name: true } },
      team: { select: { id: true, name: true } },
    },
  });
  broadcast({ type: 'score_request_update', data: updated });
  res.json(updated);
});

router.post('/teams/reorder', adminAuth, async (req, res) => {
  const { orderedIds } = req.body as { orderedIds: string[] };
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    res.status(400).json({ error: 'orderedIds array required' });
    return;
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.team.update({ where: { id }, data: { order: index + 1 } })
    )
  );

  broadcast({ type: 'teams_update' });
  res.json({ success: true });
});

router.post('/reset', adminAuth, async (_req, res) => {
  await prisma.$transaction([
    prisma.judgeScore.deleteMany(),
    prisma.scoreRequest.deleteMany(),
    prisma.audienceVote.deleteMany(),
    prisma.quizSubmission.deleteMany(),
    prisma.team.updateMany({ data: { status: 'WAITING' } }),
    prisma.appSettings.update({
      where: { id: 1 },
      data: {
        activeTeamId: null,
        pitchEndTime: null,
        quizEndTime: null,
        judgePortal: true,
        audiencePortal: true,
        quizPortal: true,
      },
    }),
  ]);
  const [settings, teams] = await Promise.all([
    prisma.appSettings.findUnique({ where: { id: 1 } }),
    prisma.team.findMany({ include: { members: true }, orderBy: { order: 'asc' } }),
  ]);
  broadcast({ type: 'reset', data: { settings, teams } });
  res.json({ success: true });
});

export default router;
