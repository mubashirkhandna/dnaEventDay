import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const teams = await prisma.team.findMany({ include: { members: true }, orderBy: { order: 'asc' } });
    return res.json(teams);
  }
  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const { name, theme, description, videoUrl, pdfUrl, members, order } = req.body;
    const team = await prisma.team.create({ data: { name, theme, description, videoUrl, pdfUrl, order: order || 0, members: { create: members || [] } }, include: { members: true } });
    return res.status(201).json(team);
  }
  res.status(405).end();
}
