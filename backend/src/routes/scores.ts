import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { judgeAuth } from '../middleware/auth';
import { broadcast } from '../lib/broadcast';

const router = Router();

router.post('/', judgeAuth, async (req, res) => {
  const { judgeId } = req.judge as Record<string, string>;
  const { teamId, costEffectiveness, medicalImpact, feasibility, technicalExecution, note } = req.body;

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }

  // Allow scoring if team is PRESENTING, or judge has approved request
  let canScore = team.status === 'PRESENTING';
  if (!canScore) {
    const request = await prisma.scoreRequest.findUnique({
      where: { judgeId_teamId: { judgeId, teamId } },
    });
    canScore = request?.status === 'APPROVED';
  }

  if (!canScore) {
    res.status(403).json({ error: 'You do not have access to score this team right now' });
    return;
  }

  const ce = Number(costEffectiveness);
  const mi = Number(medicalImpact);
  const fe = Number(feasibility);
  const te = Number(technicalExecution);

  if (ce < 0 || ce > 35) { res.status(400).json({ error: 'costEffectiveness must be 0-35' }); return; }
  if (mi < 0 || mi > 30) { res.status(400).json({ error: 'medicalImpact must be 0-30' }); return; }
  if (fe < 0 || fe > 20) { res.status(400).json({ error: 'feasibility must be 0-20' }); return; }
  if (te < 0 || te > 15) { res.status(400).json({ error: 'technicalExecution must be 0-15' }); return; }

  const score = await prisma.judgeScore.upsert({
    where: { judgeId_teamId: { judgeId, teamId } },
    update: { costEffectiveness: ce, medicalImpact: mi, feasibility: fe, technicalExecution: te, note: note || '' },
    create: { judgeId, teamId, costEffectiveness: ce, medicalImpact: mi, feasibility: fe, technicalExecution: te, note: note || '' },
    include: { team: { select: { id: true, name: true } } },
  });

  broadcast({ type: 'scores_update' });
  res.json(score);
});

export default router;
