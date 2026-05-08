import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;
  if (req.method === 'GET') {
    const team = await prisma.team.findUnique({ where: { id }, include: { members: true } });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    return res.json(team);
  }
  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
    const { name, theme, description, videoUrl, pdfUrl, members, order } = req.body;
    await prisma.teamMember.deleteMany({ where: { teamId: id } });
    const team = await prisma.team.update({ where: { id }, data: { ...(name && { name }), ...(theme && { theme }), ...(description && { description }), ...(videoUrl !== undefined && { videoUrl }), ...(pdfUrl !== undefined && { pdfUrl }), ...(order !== undefined && { order }), ...(members && { members: { create: members } }) }, include: { members: true } });
    return res.json(team);
  }
  res.status(405).end();
}
