import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'PATCH') return res.status(405).end();
  const { costEffectiveness, medicalImpact, feasibility, technicalExecution, note } = req.body;
  const updated = await prisma.judgeScore.update({
    where: { id: req.query.id as string },
    data: {
      ...(costEffectiveness !== undefined && { costEffectiveness: Number(costEffectiveness) }),
      ...(medicalImpact !== undefined && { medicalImpact: Number(medicalImpact) }),
      ...(feasibility !== undefined && { feasibility: Number(feasibility) }),
      ...(technicalExecution !== undefined && { technicalExecution: Number(technicalExecution) }),
      ...(note !== undefined && { note }),
    },
    include: { judge: { select: { id: true, email: true, name: true } }, team: { select: { id: true, name: true } } },
  });
  res.json(updated);
}
