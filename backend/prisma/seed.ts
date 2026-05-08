import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.appSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const teamsData = [
    {
      id: 'team-1',
      name: 'NeuroNurture',
      theme: '04 Mental Health & Wellness',
      description: 'Game-based, evidence-informed autism support enabling continuous monitoring, early screening, and developmental improvement.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 1,
      members: [
        { name: 'Rafiq Hasan', photoUrl: 'https://i.pravatar.cc/150?u=rafiq' },
        { name: 'Sadia Rahman', photoUrl: 'https://i.pravatar.cc/150?u=sadia' },
      ],
    },
    {
      id: 'team-2',
      name: 'Team Star',
      theme: '08 Medical EdTech & Tools',
      description: 'Immersive Virtual Reality (VR) training for midwives to reduce maternal and infant mortality.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 2,
      members: [
        { name: 'Tariqul Islam', photoUrl: 'https://i.pravatar.cc/150?u=tariq' },
        { name: 'Nusrat Jahan', photoUrl: 'https://i.pravatar.cc/150?u=nusrat' },
      ],
    },
    {
      id: 'team-3',
      name: 'Team MediLink',
      theme: '10 Healthcare OS & Infra',
      description: 'Bridging the gap in healthcare through real-time resource mapping and emergency micro-deliveries.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      order: 3,
      members: [
        { name: 'Kamrul Ahsan', photoUrl: 'https://i.pravatar.cc/150?u=kamrul' },
        { name: 'Fatema Tuz', photoUrl: 'https://i.pravatar.cc/150?u=fatema' },
      ],
    },
  ];

  for (const { members, ...team } of teamsData) {
    const existing = await prisma.team.findUnique({ where: { id: team.id } });
    if (!existing) {
      await prisma.team.create({
        data: { ...team, members: { create: members } },
      });
    }
  }

  const questions = [
    {
      id: 'q1',
      question: 'Which of the following is a key feature of glassmorphism?',
      options: ['Solid backgrounds', 'Background blur', 'Sharp borders', 'Neon text'],
      answer: 'Background blur',
      order: 1,
    },
    {
      id: 'q2',
      question: 'What is the primary goal of the DNA Hack For Health?',
      options: [
        'Build a new hospital',
        'Solve critical clinical challenges',
        'Create an e-commerce store',
        'Train nurses only',
      ],
      answer: 'Solve critical clinical challenges',
      order: 2,
    },
    {
      id: 'q3',
      question: 'Which AI model is used by Team NeuroNurture?',
      options: ['Generative Text', 'Computer Vision for Autism Detection', 'LLaMa 3', 'None'],
      answer: 'Computer Vision for Autism Detection',
      order: 3,
    },
  ];

  for (const q of questions) {
    await prisma.quizQuestion.upsert({
      where: { id: q.id },
      update: {},
      create: q,
    });
  }

  // Default judge (password: judge123)
  const judgeHash = await bcrypt.hash('judge123', 10);
  await prisma.judge.upsert({
    where: { email: 'judge@h4h.com' },
    update: {},
    create: { email: 'judge@h4h.com', name: 'Default Judge', passwordHash: judgeHash },
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
