import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const [settings, teams, votes, submissions, scoreRequests, scores] = await Promise.all([
    prisma.appSettings.findUnique({ where: { id: 1 } }),
    prisma.team.findMany({ include: { members: true }, orderBy: { order: 'asc' } }),
    prisma.audienceVote.findMany(),
    prisma.quizSubmission.findMany({ orderBy: [{ score: 'desc' }, { timeTaken: 'asc' }] }),
    prisma.scoreRequest.findMany({ include: { judge: { select: { id: true, email: true, name: true } } } }),
    prisma.judgeScore.findMany({ include: { judge: { select: { id: true, email: true, name: true } }, team: { select: { id: true, name: true } } } }),
  ]);

  const audienceVotes: Record<string, string[]> = {};
  const audienceVoteTotals: Record<string, { total: number; unique: number }> = {};
  for (const v of votes) {
    if (!audienceVotes[v.teamId]) audienceVotes[v.teamId] = [];
    audienceVotes[v.teamId].push(v.whatsapp);
  }
  for (const [teamId, voters] of Object.entries(audienceVotes)) {
    const teamVotes = votes.filter((v: { teamId: string; ip: string | null }) => v.teamId === teamId);
    const uniqueIps = new Set(teamVotes.map((v: { ip: string | null }) => v.ip).filter(Boolean));
    audienceVoteTotals[teamId] = { total: voters.length, unique: uniqueIps.size };
  }

  const judgeScores: Record<string, Record<string, unknown>> = {};
  for (const s of scores) {
    const email = s.judge.email;
    if (!judgeScores[email]) judgeScores[email] = {};
    judgeScores[email][s.teamId] = { id: s.id, costEffectiveness: s.costEffectiveness, medicalImpact: s.medicalImpact, feasibility: s.feasibility, technicalExecution: s.technicalExecution, note: s.note };
  }

  const scoreRequestsMap: Record<string, string> = {};
  for (const r of scoreRequests) scoreRequestsMap[`${r.judge.email}_${r.teamId}`] = r.status.toLowerCase();

  const quizSubmissions: Record<string, unknown> = {};
  for (const s of submissions) quizSubmissions[s.email] = { score: s.score, timeTaken: s.timeTaken, submitTime: s.submitTime.getTime() };

  res.json({
    settings: { ...settings, pitchEndTime: settings?.pitchEndTime ? settings.pitchEndTime.getTime() : null, quizEndTime: settings?.quizEndTime ? settings.quizEndTime.getTime() : null },
    teams: teams.map((t: { status: string }) => ({ ...t, status: t.status.toLowerCase() })),
    audienceVotes, audienceVoteTotals, judgeScores, scoreRequests: scoreRequestsMap, quizSubmissions,
    portalsEnabled: { judge: settings?.judgePortal ?? true, audience: settings?.audiencePortal ?? true, quiz: settings?.quizPortal ?? true },
    activeTeamId: settings?.activeTeamId ?? null,
    pitchDuration: settings?.pitchDuration ?? 5,
    pitchEndTime: settings?.pitchEndTime ? settings.pitchEndTime.getTime() : null,
    quizDuration: settings?.quizDuration ?? 5,
    quizEndTime: settings?.quizEndTime ? settings.quizEndTime.getTime() : null,
  });
}
