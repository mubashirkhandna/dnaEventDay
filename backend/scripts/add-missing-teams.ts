import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MISSING_TEAMS = [
  { name: 'Syntax Surgeons',  teamCode: 'DNA-9504', theme: 'Healthcare OS & Infra',       order: 16 },
  { name: 'LifeLineX',        teamCode: 'DNA-1190', theme: 'Healthcare OS & Infra',       order: 17 },
  { name: 'SurgiMax',         teamCode: 'DNA-9443', theme: 'Fitness & Food as Medicine',  order: 18 },
  { name: 'Renew_Motion',     teamCode: 'DNA-6438', theme: 'Next-Gen Telehealth & AI',    order: 19 },
  { name: 'PulseIQ',          teamCode: 'DNA-5702', theme: 'Aging & Elder Care Tech',     order: 20 },
  { name: 'Binary Blood',     teamCode: 'DNA-6466', theme: 'Healthcare OS & Infra',       order: 21 },
  { name: 'Team Hemo Hackers',teamCode: 'DNA-4691', theme: 'Healthcare OS & Infra',       order: 22 },
  { name: 'Rhetoric Minds',   teamCode: 'DNA-5481', theme: 'Next-Gen Telehealth & AI',    order: 23 },
  { name: 'GLITCH_GANG',      teamCode: 'DNA-5627', theme: 'Next-Gen Telehealth & AI',    order: 24 },
];

async function main() {
  for (const t of MISSING_TEAMS) {
    const existing = await prisma.team.findFirst({ where: { name: t.name } });
    if (existing) {
      await prisma.team.update({ where: { id: existing.id }, data: { teamCode: t.teamCode } });
      console.log(`  Updated (already existed): ${t.name}`);
    } else {
      await prisma.team.create({
        data: { name: t.name, teamCode: t.teamCode, theme: t.theme, description: '', order: t.order },
      });
      console.log(`  ✅ Added: ${t.name} (${t.teamCode})`);
    }
  }
  console.log('\nDone — pitch deck links will be added later via admin panel or import script.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
