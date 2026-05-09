import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const maxOrder = await prisma.team.aggregate({ _max: { order: true } });
  let nextOrder = (maxOrder._max.order ?? 21) + 1;

  const missing = [
    {
      teamCode: 'DNA-1190',
      name: 'LifeLineX',
      theme: 'Healthcare OS & Infra',
      description: 'A trauma coordination platform designed to solve the systems-level bottleneck in Bangladesh\'s emergency care — connecting facilities, optimising referral decisions, and saving critical golden-hour time for trauma patients.',
      pdfUrl: 'https://drive.google.com/open?id=1AAetu-ioUyWan5EB3tN44TwIKMnS4qiM',
      pptxUrl: 'https://canva.link/6zquyjkaiwf4gz6',
      whyTheme: 'I chose this theme because trauma is one of the biggest yet most time-sensitive healthcare problems in Bangladesh. Every day, road traffic accidents, workplace injuries, falls, and emergency surgical conditions cost many lives — not only because injuries are severe, but because patients often fail to reach the right hospital at the right time. During clinical exposure and observing our healthcare system, I noticed a recurring gap: patients are first taken to nearby centers that lack trauma capability, referrals are delayed, communication between hospitals is fragmented, and critical golden-hour decisions are often lost. That made me think — the problem is not only treatment quality, but also coordination and mobilization.',
      howSolution: 'We came up with this solution by analyzing the patient journey during trauma emergencies: Injury occurs → Patient reaches nearest facility → Facility struggles to identify where to transfer → Communication delay happens → Critical time is lost. Instead of building another treatment device, we wanted to solve the systems-level bottleneck. The idea combines healthcare workflow optimization with technology-assisted decision support. Even a few minutes saved during trauma transfer can significantly improve survival and disability outcomes.',
    },
    {
      teamCode: 'DNA-9443',
      name: 'SurgiMax',
      theme: 'Fitness & Food as Medicine',
      description: 'A lightweight mobile app that turns post-surgical nutrition into a personalised, locally grounded daily meal plan — mapping Bangladeshi foods to ERAS (Enhanced Recovery After Surgery) milestones so patients can heal without imported supplements.',
      pdfUrl: 'https://drive.google.com/open?id=1GMucP7asJoN2ISjgBfJBTtqLU7ne97uC',
      pptxUrl: null,
      whyTheme: 'We chose this theme because food is the most basic form of medicine, especially for surgical patients. Right now, even when hospitals follow ERAS protocols, patients struggle to follow the diet plan because it does not match their local food habits. We believe healing starts in the kitchen. By making food as medicine practical and local, we can improve surgical recovery without expensive drugs or equipment.',
      howSolution: 'We built a lightweight mobile app that: asks the patient about their surgery type, lets them choose local foods they actually eat, matches those foods to ERAS milestones using a simple rules engine, and outputs a clear daily meal plan covering both pre-op and post-op phases.',
    },
  ];

  for (const team of missing) {
    const existing = await prisma.team.findFirst({ where: { teamCode: team.teamCode } });
    if (existing) {
      await prisma.team.update({ where: { id: existing.id }, data: { pdfUrl: team.pdfUrl, pptxUrl: team.pptxUrl, whyTheme: team.whyTheme, howSolution: team.howSolution, description: team.description } });
      console.log(`Updated existing: ${team.name}`);
    } else {
      await prisma.team.create({ data: { ...team, status: 'WAITING', order: nextOrder++ } });
      console.log(`Created: ${team.name} (${team.teamCode}) at order ${nextOrder - 1}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
