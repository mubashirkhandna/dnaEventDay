import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Detect whether a Google Drive file is a PDF by fetching the first 4 bytes
async function detectFileType(fileId: string): Promise<'pdf' | 'pptx'> {
  const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
  try {
    const res = await fetch(url, {
      headers: {
        'Range': 'bytes=0-3',
        'User-Agent': 'Mozilla/5.0 (compatible; H4H-Import/1.0)',
      },
      signal: AbortSignal.timeout(15_000),
    });
    const buf = await res.arrayBuffer();
    const magic = String.fromCharCode(...new Uint8Array(buf).slice(0, 4));
    if (magic.startsWith('%PDF')) return 'pdf';
    // Also check Content-Type if Range not supported
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('pdf')) return 'pdf';
    return 'pptx';
  } catch {
    return 'pptx';
  }
}

const CSV_TEAMS = [
  { name: 'AXION',           teamCode: 'DNA-7776', theme: 'FemTech & Women\'s Health',   id1: '1DwwsNVMv2wqIgcHygA2wfahNYionWQ4n', id2: '1bsnl3hrEZsCFhHreF93maU8JKG0yx_Ry' },
  { name: 'Team 42',         teamCode: 'DNA-1058', theme: 'Next-Gen Telehealth & AI',    id1: '1x-L-1XpbwcdsW0WlDA16F8ZlHfM0a6ps', id2: '1sZmt3hK5ZsKnqjqHFdgjsSEumsYpMKnG' },
  { name: 'Serenity Squad',  teamCode: 'DNA-9480', theme: 'Mental Health & Wellness',    id1: '1AlG4UdoGPabcEaBieOb4yUE8v20uVDw7', id2: '1NBwWK7kJhWzuJrQKM-iwIM1ueEdsrU17' },
  { name: 'Team ImmuNexa',   teamCode: 'DNA-8007', theme: 'Next-Gen Telehealth & AI',    id1: '1hwkNNn61U7GjIY5z7YVSzCOwGqxKtADV', id2: '1CC10p9RTzg8U7zGx5XAjrJUUhp4Gx6iy' },
  { name: 'SYNC SQUAD',      teamCode: 'DNA-9804', theme: 'The Smart ICU',               id1: '1krx7LRKhkwa_eDZWf40_1C4umUuIsv0C',  id2: '12iIS_vuJeg0kIb4qECAhlztudgpKgyrs' },
  { name: 'Medi Conect',     teamCode: 'DNA-4795', theme: 'Next-Gen Telehealth & AI',    id1: '1uHnnSXjLsCFY6OObEMwAyeCexgTekj5D',  id2: null },
  { name: 'CUET Mongolchari',teamCode: 'DNA-8629', theme: 'Smart Pharmacy & E-Meds',     id1: '18UnlsKX81utENX-W4udwng6XkKYtc1Ns', id2: '11pI3LoUELt2mk6LKDNPscj26KaR-uNUV' },
  { name: 'Vanguard',        teamCode: 'DNA-8505', theme: 'FemTech & Women\'s Health',   id1: '1HhkhQnoMjssgBeeG9L2QvhW5LNT24zq5', id2: '1hteWXZaOE7ioF6XlWcYZ4SBBAPWP1eRp' },
  { name: 'MediCare HMS',    teamCode: 'DNA-6684', theme: 'Healthcare OS & Infra',       id1: '1p6cWr9SHAaJu7tpkYmltk3mmnt_gbww_', id2: '1M4bcmfQlFOvgRCfdcRxIZrt99GDBTxoJ' },
  { name: 'Nexus',           teamCode: 'DNA-8241', theme: 'Fitness & Food as Medicine',  id1: '1gQChw_ftVMMQqAY-yxnPKRRdnEQbVBfW', id2: '1pJlsSubBa_048uu1rB7dexpjxJU1kffh' },
  { name: 'GapHack',         teamCode: 'DNA-9506', theme: 'Healthcare OS & Infra',       id1: '1a_6XKVpyZmJZ9cbo-Zix-qqQBGNdHpbS',  id2: null },
  { name: 'Arekta team',     teamCode: 'DNA-3525', theme: 'Next-Gen Telehealth & AI',    id1: '1kK_9tVW8I18tqN3GfoLgunWk9L5lW_2L', id2: '1ONE5evhzSfHEaIp4YuW2ru630F93nCBd' },
  { name: 'AutoMed',         teamCode: 'DNA-4961', theme: 'Next-Gen Telehealth & AI',    id1: '1KOKUE9Ph8lznw8Z3ZSFiO1SF-q1ysjMS',  id2: '1qx6WfxbtpLrvawGDYZgkD_hOOQWe98dB' },
  { name: 'Livora',          teamCode: '0J1K6C6X', theme: 'Healthcare OS & Infra',       id1: '1yQ14__Fjoo7VkbJYXsnnAUwTejhEp3Ri', id2: '1SGajF3upSgU0NP5ibSXS3MywgDb-yZAM' },
  { name: 'Epidemic Lens',   teamCode: 'DNA-8708', theme: 'Next-Gen Telehealth & AI',    id1: '1AxBCQx9LLaMhKReFwuOQpU538zYozJ6_', id2: '1SsgaXg-2FpKAhhlUfBth7eA7DY7GV4P1' },
];

async function main() {
  // First, remove old placeholder teams from seed
  const oldIds = ['team-1', 'team-2', 'team-3'];
  for (const id of oldIds) {
    const exists = await prisma.team.findUnique({ where: { id } });
    if (exists) {
      // Only delete if no scores attached
      const scoreCount = await prisma.judgeScore.count({ where: { teamId: id } });
      if (scoreCount === 0) {
        await prisma.teamMember.deleteMany({ where: { teamId: id } });
        await prisma.team.delete({ where: { id } });
        console.log(`  Removed placeholder team: ${id}`);
      }
    }
  }

  for (let i = 0; i < CSV_TEAMS.length; i++) {
    const t = CSV_TEAMS[i];
    process.stdout.write(`[${i + 1}/${CSV_TEAMS.length}] ${t.name} — detecting file types... `);

    let pdfId: string | null = null;
    let pptxId: string | null = null;

    if (t.id2) {
      // Detect which is PDF and which is PPTX
      const [type1, type2] = await Promise.all([
        detectFileType(t.id1),
        detectFileType(t.id2),
      ]);
      process.stdout.write(`id1=${type1}, id2=${type2} `);
      if (type1 === 'pdf') { pdfId = t.id1; pptxId = t.id2; }
      else if (type2 === 'pdf') { pdfId = t.id2; pptxId = t.id1; }
      else { pdfId = t.id1; pptxId = t.id2; } // fallback: treat first as PDF
    } else {
      // Only one link available
      const type1 = await detectFileType(t.id1);
      process.stdout.write(`id1=${type1} `);
      if (type1 === 'pdf') pdfId = t.id1;
      else pptxId = t.id1;
    }

    const pdfUrl  = pdfId  ? `https://drive.google.com/open?id=${pdfId}`  : null;
    const pptxUrl = pptxId ? `https://drive.google.com/open?id=${pptxId}` : null;

    const existing = await prisma.team.findFirst({ where: { name: t.name } });
    if (existing) {
      await prisma.team.update({
        where: { id: existing.id },
        data: { teamCode: t.teamCode, theme: t.theme, pdfUrl, pptxUrl },
      });
    } else {
      await prisma.team.create({
        data: { name: t.name, teamCode: t.teamCode, theme: t.theme, description: '', pdfUrl, pptxUrl, order: i + 1 },
      });
    }

    console.log(`✅`);
  }

  console.log('\n✅ All teams imported from CSV.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
