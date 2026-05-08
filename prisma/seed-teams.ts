import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TeamData {
  teamCode: string;
  name: string;
  theme: string;
  description: string;
  pdfUrl: string | null;
  pptxUrl: string | null;
  videoUrl: string | null;
}

const teams: TeamData[] = [
  {
    teamCode: 'DNA-7776',
    name: 'AXION',
    theme: "FemTech & Women's Health",
    description: 'A technology-driven solution addressing FemTech and Women\'s Health challenges with innovative tools for continuous health monitoring and support.',
    pdfUrl: 'https://drive.google.com/open?id=1DwwsNVMv2wqIgcHygA2wfahNYionWQ4n',
    pptxUrl: null,
    videoUrl: 'https://www.youtube.com/embed/j2wEbfI9oyQ',
  },
  {
    teamCode: 'DNA-1058',
    name: 'Team 42',
    theme: 'Next-Gen Telehealth & AI',
    description: 'An AI-powered telehealth platform reimagining how patients access healthcare in the digital age.',
    pdfUrl: 'https://drive.google.com/open?id=1x-L-1XpbwcdsW0WlDA16F8ZlHfM0a6ps',
    pptxUrl: null,
    videoUrl: null,
  },
  {
    teamCode: 'DNA-9480',
    name: 'Serenity Squad',
    theme: 'Mental Health & Wellness',
    description: 'Empowering mental health through technology — evidence-based tools for screening, monitoring, and improving wellness outcomes.',
    pdfUrl: 'https://drive.google.com/open?id=1DwwsNVMv2wqIgcHygA2wfahNYionWQ4n',
    pptxUrl: null,
    videoUrl: null,
  },
  {
    teamCode: 'DNA-8007',
    name: 'Team ImmuNexa',
    theme: 'Next-Gen Telehealth & AI',
    description: 'An integrated telehealth platform delivering AI-driven diagnostics and immune health management at scale.',
    pdfUrl: 'https://drive.google.com/open?id=1hwkNNn61U7GjIY5z7YVSzCOwGqxKtADV',
    pptxUrl: 'https://canva.link/6psvjikr35z8ckz',
    videoUrl: 'https://d-shastho.vercel.app',
  },
  {
    teamCode: 'DNA-9804',
    name: 'SYNC SQUAD',
    theme: 'The Smart ICU',
    description: 'A real-time smart ICU dashboard synchronizing patient vitals, alerts, and care workflows for critical care teams.',
    pdfUrl: 'https://drive.google.com/open?id=1krx7LRKhkwa_eDZWf40_1C4umUuIsv0C',
    pptxUrl: null,
    videoUrl: 'https://medical-azure-qnm-draft.caffeine.xyz/',
  },
  {
    teamCode: 'DNA-4795',
    name: 'Medi Conect',
    theme: 'Next-Gen Telehealth & AI',
    description: 'Connecting patients and providers through an intuitive telehealth bridge that removes barriers to quality care.',
    pdfUrl: 'https://drive.google.com/open?id=1uHnnSXjLsCFY6OObEMwAyeCexgTekj5D',
    pptxUrl: null,
    videoUrl: null,
  },
  {
    teamCode: 'DNA-8629',
    name: 'CUET Mongolchari',
    theme: 'Smart Pharmacy & E-Meds',
    description: 'A smart pharmacy ecosystem enabling e-prescriptions, medicine delivery, and inventory management for rural communities.',
    pdfUrl: 'https://drive.google.com/open?id=18UnlsKX81utENX-W4udwng6XkKYtc1Ns',
    pptxUrl: null,
    videoUrl: 'https://healthcareapp-ruddy.vercel.app/',
  },
  {
    teamCode: 'DNA-8505',
    name: 'Vanguard',
    theme: "FemTech & Women's Health",
    description: 'Pioneering women\'s health technology through personalized care, early diagnosis, and data-driven health insights.',
    pdfUrl: 'https://drive.google.com/open?id=1HhkhQnoMjssgBeeG9L2QvhW5LNT24zq5',
    pptxUrl: 'https://canva.link/k2ljgngya0j3i11',
    videoUrl: 'https://ushahealth.vercel.app',
  },
  {
    teamCode: 'DNA-6684',
    name: 'MediCare HMS',
    theme: 'Healthcare OS & Infra',
    description: 'A modular healthcare management system streamlining hospital operations, patient records, and resource allocation.',
    pdfUrl: 'https://drive.google.com/open?id=1p6cWr9SHAaJu7tpkYmltk3mmnt_gbww_',
    pptxUrl: 'https://canva.link/vap9tpru08dj8xq',
    videoUrl: 'https://medicarehms-gamma.vercel.app/',
  },
  {
    teamCode: 'DNA-8241',
    name: 'Nexus',
    theme: 'Fitness & Food as Medicine',
    description: 'Merging nutrition science and fitness tracking to deliver personalized food-as-medicine recommendations.',
    pdfUrl: 'https://drive.google.com/open?id=1gQChw_ftVMMQqAY-yxnPKRRdnEQbVBfW',
    pptxUrl: null,
    videoUrl: null,
  },
  {
    teamCode: 'DNA-9506',
    name: 'GapHack',
    theme: 'Healthcare OS & Infra',
    description: 'Bridging critical gaps in healthcare infrastructure with smart queue management and patient flow optimization.',
    pdfUrl: 'https://drive.google.com/open?id=1a_6XKVpyZmJZ9cbo-Zix-qqQBGNdHpbS',
    pptxUrl: 'https://canva.link/xdjzmkab83koffc',
    videoUrl: 'https://smart-q-flow.vercel.app/',
  },
  {
    teamCode: 'DNA-3525',
    name: 'Arekta team',
    theme: 'Next-Gen Telehealth & AI',
    description: 'A next-generation telehealth platform built for underserved populations with AI-assisted diagnosis and multilingual support.',
    pdfUrl: 'https://drive.google.com/open?id=1kK_9tVW8I18tqN3GfoLgunWk9L5lW_2L',
    pptxUrl: 'https://canva.link/x93dugbb714hbry',
    videoUrl: 'https://dna-hack-for-health-26-ctg.vercel.app/',
  },
  {
    teamCode: 'DNA-4961',
    name: 'AutoMed',
    theme: 'Next-Gen Telehealth & AI',
    description: 'Automating patient history management and clinical workflows with AI to reduce physician workload and errors.',
    pdfUrl: 'https://drive.google.com/open?id=1KOKUE9Ph8lznw8Z3ZSFiO1SF-q1ysjMS',
    pptxUrl: null,
    videoUrl: 'https://patient-history-management-system.vercel.app',
  },
  {
    teamCode: '0J1K6C6X',
    name: 'Livora',
    theme: 'Healthcare OS & Infra',
    description: 'A comprehensive healthcare operating system connecting clinics, pharmacies, labs, and patients on a unified platform.',
    pdfUrl: 'https://drive.google.com/open?id=1yQ14__Fjoo7VkbJYXsnnAUwTejhEp3Ri',
    pptxUrl: 'https://canva.link/livora',
    videoUrl: 'https://livoracu48.vercel.app/',
  },
  {
    teamCode: 'DNA-8708',
    name: 'Epidemic Lens',
    theme: 'Next-Gen Telehealth & AI',
    description: 'An AI-powered epidemic surveillance and early-warning platform for real-time disease outbreak prediction.',
    pdfUrl: 'https://drive.google.com/open?id=1AxBCQx9LLaMhKReFwuOQpU538zYozJ6_',
    pptxUrl: null,
    videoUrl: null,
  },
  {
    teamCode: 'DNA-8183',
    name: 'Syntax Surgeons',
    theme: 'Next-Gen Telehealth & AI',
    description: 'Coding a healthier future — AI-driven clinical decision support and diagnosis augmentation tools for frontline doctors.',
    pdfUrl: 'https://drive.google.com/open?id=1XWpQCnikE-5SnvdGAM9iF8Xw6jF7K4py',
    pptxUrl: null,
    videoUrl: null,
  },
  {
    teamCode: 'DNA-6466',
    name: 'Binary Blood',
    theme: 'Healthcare OS & Infra',
    description: 'A digital blood bank and transfusion management system ensuring real-time availability and safe blood delivery.',
    pdfUrl: 'https://drive.google.com/open?id=18mUaY92EJBfMukhMQuPwFl0xI7oPKwMg',
    pptxUrl: null,
    videoUrl: 'https://www.youtube.com/embed/lpVu5PyDLe0',
  },
  {
    teamCode: 'DNA-6438',
    name: 'Renew_Motion',
    theme: 'Aging & Elder Care Tech',
    description: 'Empowering elder mobility through AI-guided physiotherapy, motion analysis, and rehabilitation tracking.',
    pdfUrl: 'https://drive.google.com/open?id=1Nssv1SbD5ygqtbmAgf1EMtqkoUi6gU8d',
    pptxUrl: 'https://canva.link/tehh3afw7glv88m',
    videoUrl: 'https://hand-livid.vercel.app/',
  },
  {
    teamCode: 'DNA-5481',
    name: 'Rhetoric Minds',
    theme: 'Next-Gen Telehealth & AI',
    description: 'Democratizing healthcare access through conversational AI and intelligent health communication tools.',
    pdfUrl: 'https://drive.google.com/open?id=1-AygsS1L4oalxrGSz2AsOwWUxTzTog6g',
    pptxUrl: null,
    videoUrl: 'https://prottoy-mesh.vercel.app/',
  },
  {
    teamCode: 'DNA-4691',
    name: 'Team Hemo Hackers',
    theme: 'Healthcare OS & Infra',
    description: 'Revolutionizing hematology workflows with smart diagnostics and digital blood disorder management tools.',
    pdfUrl: 'https://drive.google.com/open?id=1xom_nOTvTKPT1t7-WzjfdtzTv9J_W2tA',
    pptxUrl: 'https://canva.link/e6y46nl9lc22yd1',
    videoUrl: null,
  },
  {
    teamCode: 'DNA-5702',
    name: 'PulseIQ',
    theme: 'The Smart ICU',
    description: 'An intelligent ICU monitoring solution with predictive analytics to reduce critical care incidents.',
    pdfUrl: 'https://drive.google.com/open?id=1FWEFUYgCFMCHR5Mi4jybyH7QfhYfdR7P',
    pptxUrl: null,
    videoUrl: null,
  },
];

async function main() {
  console.log(`Upserting ${teams.length} teams...`);

  for (const team of teams) {
    const existing = await prisma.team.findFirst({ where: { teamCode: team.teamCode } });

    if (existing) {
      await prisma.team.update({
        where: { id: existing.id },
        data: {
          name: team.name,
          theme: team.theme,
          description: team.description,
          pdfUrl: team.pdfUrl,
          pptxUrl: team.pptxUrl,
          videoUrl: team.videoUrl,
        },
      });
      console.log(`  Updated: ${team.name} (${team.teamCode})`);
    } else {
      await prisma.team.create({
        data: {
          teamCode: team.teamCode,
          name: team.name,
          theme: team.theme,
          description: team.description,
          pdfUrl: team.pdfUrl,
          pptxUrl: team.pptxUrl,
          videoUrl: team.videoUrl,
          order: 99,
        },
      });
      console.log(`  Created: ${team.name} (${team.teamCode})`);
    }
  }

  console.log('Done.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
