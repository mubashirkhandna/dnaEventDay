import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { adminAuth } from '../middleware/auth';
import { broadcast } from '../lib/broadcast';

const router = Router();

router.get('/', async (_req, res) => {
  const teams = await prisma.team.findMany({
    include: { members: true },
    orderBy: { order: 'asc' },
  });
  res.json(teams);
});

router.get('/:id', async (req, res) => {
  const team = await prisma.team.findUnique({
    where: { id: req.params.id },
    include: { members: true },
  });
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  res.json(team);
});

router.post('/', adminAuth, async (req, res) => {
  const { name, theme, description, videoUrl, pdfUrl, members, order } = req.body;
  const team = await prisma.team.create({
    data: {
      name,
      theme,
      description,
      videoUrl,
      pdfUrl,
      order: order || 0,
      members: { create: members || [] },
    },
    include: { members: true },
  });
  broadcast({ type: 'teams_update' });
  res.status(201).json(team);
});

router.put('/:id', adminAuth, async (req, res) => {
  const { name, theme, description, videoUrl, pdfUrl, members, order } = req.body;
  await prisma.teamMember.deleteMany({ where: { teamId: req.params.id } });
  const team = await prisma.team.update({
    where: { id: req.params.id },
    data: {
      ...(name && { name }),
      ...(theme && { theme }),
      ...(description && { description }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(pdfUrl !== undefined && { pdfUrl }),
      ...(order !== undefined && { order }),
      ...(members && { members: { create: members } }),
    },
    include: { members: true },
  });
  broadcast({ type: 'teams_update' });
  res.json(team);
});

export default router;
