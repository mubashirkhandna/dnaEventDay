import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const QA: Record<string, { why: string; how: string }> = {
  'DNA-7776': {
    why: "I chose women's health because many health problems affecting women are still ignored, especially in rural areas. UTI is very common, yet many women do not know how it happens, how to prevent it, or when to seek help. I wanted to work on a solution that is simple, practical, and accessible for everyday women, not just for hospitals.",
    how: "The initial idea actually came from conversations at home with my mother. She talked about how many women around us ignore symptoms, lack proper hygiene awareness, and often delay treatment because these topics are not openly discussed. That made me realize the problem is not only medical—it's also about awareness, behavior, and accessibility. So I started thinking about a simple digital companion that could guide women in an easy and understandable way.",
  },
  'DNA-1058': {
    why: "Because we felt we could make a great impact with our ideas and interests in this theme.",
    how: "We researched on the topic thoroughly and went through exhausting literature review to find a meaningful solution to a problem which we thought needed attention. What we found was that with the use of AI and early detection of diseases through machine learning, lives could be saved and healthcare could be made available to underprivileged people who lack the resources.",
  },
  'DNA-9480': {
    why: "We chose the \"Mental Health & Wellness\" theme because student mental health is one of the most urgent and underserved healthcare issues in Bangladesh. Many students silently suffer from stress, burnout, low mood, attention difficulty, and anxiety, but support usually starts too late. Our project directly addresses this gap through early detection, risk scoring, smart suggestions, and counselor connection. Since our team includes both MBBS students and a CSE student, this theme strongly matches both our real-world understanding and our ability to build a meaningful digital solution.",
    how: "We came up with this solution by starting from a very real and visible problem: students are struggling, but most systems fail to notice them early. As a team with both medical and technical backgrounds, we identified three major student-relevant risk patterns—low mood/depression, attention and academic inconsistency, and anxiety/repetitive worry. This led to three specialized AI agents: LUNA for mood patterns, FOCUS for ADHD-related attention, and CALM for anxiety loops. Our core principle: \"The app screens. The doctor diagnoses.\"",
  },
  'DNA-8007': {
    why: "As the whole world is being digitalized the healthcare system remains unnoticed. Our goal is to minimize the burden of the healthcare through technology.",
    how: "By keeping it in mind that advanced technology is the ultimate future, we built an integrated telehealth platform that brings AI-driven diagnostics and immune health management to scale.",
  },
  'DNA-9804': {
    why: "I chose this theme because I have stood in the silence of an ICU and felt the crushing weight of the unknown. When my closest friend's mother was diagnosed with pancreatic cancer, we had seven days. In that one week, I witnessed how the medical system, despite all its technology, can feel profoundly cold and opaque to the people who love the patient most. I chose this theme because early intervention shouldn't just be a medical goal—it's a secondary chance at life.",
    how: "I came up with this idea while standing in an ICU, watching a one-week countdown that felt like a theft. Every minute without actionable data felt like a missed chance. That experience drove me to build a real-time smart ICU dashboard that synchronizes patient vitals, alerts, and care workflows for critical care teams.",
  },
  'DNA-4795': {
    why: "We picked \"Next-Gen Telehealth & AI\" because Medi Connect Health Hub tackles the messiness of Bangladesh's healthcare system. Everything's scattered. People bounce from doctor to pharmacy to lab, and nobody's really talking to each other. Traditional telehealth is fine for quick chats, but it doesn't cover the full journey. Folks need something that connects diagnosis, prescriptions, pharmacies, labs, and emergency services all in one place.",
    how: "We built our solution around six big problems in Bangladesh's healthcare system: everything's scattered, finding specialists is hard, emergencies move too slowly, verified health information is rare, patients get lost between diagnosis and getting their meds, and rural folks are basically left out digitally. So we came up with the Unified Health Passport—loaded with AI features: symptom checks using Gemini API, ambulance tracking in real time, blood donor matching, and secure chat rooms that bring together doctors, patients, pharmacies, and labs.",
  },
  'DNA-8629': {
    why: "In this land like Bangladesh, our majority of the people suffer due to various kinds of physical issues due to lack of proper treatment or accessibility. To make healthcare accessible for all, we chose this theme.",
    how: "At present, all available remote healthcare apps do not have access to measure patient vitals, and they are only accessible for people who have high-speed internet and smartphones. So we came up with a solution that has access to physical measurements and is also accessible for all.",
  },
  'DNA-8505': {
    why: "To close the gender health gap and present clinically approved diagnostics to counter the diagnostic delay.",
    how: "Existing symptom checkers are often inaccurate and provide no clinical insight. Our solution follows a Bayesian-inspired method and asks clinically approved diagnostic questions to provide better accuracy. It replicates the clinical reasoning of expert clinicians, assigns weight-based metric scoring rather than simple yes/no questions, and performs tiered risk assessment.",
  },
  'DNA-6684': {
    why: "Our team chose the \"Healthcare OS & Infra\" theme because we believe one of the biggest problems in Bangladesh is the lack of a connected and organized healthcare system. In many hospitals and clinics, patient information is still handled manually—handwritten prescriptions, paper files, and disconnected records. We wanted to build a Healthcare Operating System that connects hospitals, doctors, nurses, patients, prescriptions, ICU management, and medical records into one unified platform.",
    how: "We came up with this solution by first observing how healthcare systems actually work in Bangladesh. Instead of starting from technology, we started from real-world hospital problems—handwritten prescriptions, fragmented patient records, manual ICU coordination, and patients who are not comfortable with complex online systems. We designed a connected healthcare ecosystem with a centralized digital patient history system, online prescription generation, AI-assisted doctor workflow, ICU monitoring and nurse task automation, and a digital medicine database.",
  },
  'DNA-8241': {
    why: "We chose the theme 'Fitness & Food as Medicine' because lifestyle-related diseases are becoming one of the biggest healthcare burdens in Bangladesh. During our medical training, we saw that many patients suffering from diabetes, hypertension, obesity, fatty liver disease, and heart disease are heavily affected by unhealthy diet, physical inactivity, stress, and poor lifestyle habits. We realized that prevention through proper nutrition and daily movement can significantly reduce disease burden.",
    how: "We came up with this solution after observing a common pattern during our medical training. Most patients with lifestyle diseases were not developing these conditions overnight—they were strongly linked to diet habits, inactivity, and lack of preventive guidance. Existing fitness and diet apps were not suitable for Bangladesh. So we asked: 'What if we could turn food and movement into a medically guided prescription system tailored for Bangladeshi people?' That idea became NUTRILIFE.",
  },
  'DNA-9506': {
    why: "Bangladeshi citizens deserve a better experience in government hospitals. The right to healthcare is there, but comes with a lot more hurdles. One of the ways to indirectly solve their problem is giving the authority the tools it needs to give its patients a better service. We plan to customize a healthcare OS that does not push technology on the face of simple citizens while giving them the benefits of tech.",
    how: "As medical students, we attend ward classes. The problem has been there for years in front of everyone's eyes. Someone just needed to look at it from the right angle. We discussed with our respected teachers, OPD on-duty doctors, and patients. The solution has been entirely based on feedback, which gives it a stronger base because practicality is the basis of our software.",
  },
  'DNA-3525': {
    why: "Undergoing rehabilitation becomes essential for patients after suffering from a stroke or Parkinson's disease—to return to their normal life. However, in Bangladesh—especially in rural settings—people fail to understand how significant rehabilitation therapy is, and it is often too expensive to afford. We worked out this idea with the goal of assisting these patients restore their functions and return to their usual lives, making rehab accessible for all irrespective of socioeconomic backgrounds.",
    how: "The inspiration primarily stemmed from Pokémon Go—the game that forced me to get out of my house back in middle school. Our goal is to gamify the exercises so that rehabilitation becomes something for patients to enjoy as well, turning what feels like a burden into an engaging daily activity.",
  },
  'DNA-4961': {
    why: "We chose Next-Gen Telehealth & AI because our project uses AI as a support layer between patients and doctors. It helps collect patient history, summarize symptoms, organize prescriptions, and flag possible risks before the doctor reviews the patient. Our goal is not to replace doctors, but to make consultations safer, faster, and more informed through AI-assisted healthcare communication.",
    how: "I came up with this solution from real problems I personally faced around patient medical history. Many times, patients cannot show their previous prescriptions, test reports, medicine history, or symptoms properly when visiting a doctor. Sometimes old records are lost, sometimes patients forget important details, and sometimes family members cannot explain the patient's condition during emergencies. This made me realize that a patient's complete health history should be available in a simple, secure, and organized way whenever treatment is needed.",
  },
  '0J1K6C6X': {
    why: "We saw the problems that needed to be solved, and tried to make the system more efficient using the knowledge of our domain.",
    how: "We came up with this solution after doing proper market research and state-of-the-art analysis, building a comprehensive healthcare operating system that connects clinics, pharmacies, labs, and patients on a unified platform.",
  },
  'DNA-8708': {
    why: "We chose 'Next-Gen Telehealth & AI' because, fundamentally, doctors are human. In the relentless, high-pressure environment of a busy hospital, even the most brilliant physician suffers from cognitive fatigue. A single overlooked detail—a forgotten allergy, an unmentioned heart condition, a missed drug interaction—can easily turn into a fatal medical error. A patient's survival should never depend solely on human memory.",
    how: "We looked at the current healthcare infrastructure in Bangladesh and saw a massive 'Paper Crisis'. Patient history is fragmented across easily lost physical files, meaning doctors essentially fly blind during emergencies. We conceptualized MediBridge by combining three core ideas: a 'Consent-First' OTP handshake ensuring patients own their data, BMDC verification ensuring only licensed doctors get access, and an AI Medical Scribe that listens to natural language and auto-updates the database, completely removing the data-entry burden from exhausted doctors.",
  },
  'DNA-8183': {
    why: "To help revolutionize the use of Computed Tomography in diagnosis.",
    how: "We built an AI model which can render 3D images of 2D CT scan reports, which can help contribute to better diagnosis and treatment planning.",
  },
  'DNA-6466': {
    why: "We chose this theme after seeing frequent errors in our hospitals, such as poor patient handovers during shift changes that led to gaps in care. We also noticed nurses occasionally missing medication doses and realized an automated alert system would be life-saving. We wanted to reduce the massive amount of paperwork that currently keeps doctors away from actually treating their patients.",
    how: "While researching solutions online, we saw how other countries use centralized systems to track patient history, past visits, and prescriptions. We believe Bangladesh is now ready for a similar infrastructure. Given the success of local apps and the widespread use of the internet, the time is right for a unified digital health system in our country.",
  },
  'DNA-6438': {
    why: "We want to work in tele-physiotherapy and rehabilitation—that's why we chose this theme.",
    how: "We actually saw the harsh reality of the problem. One of our friend's fathers is partially paralysed, but due to the high cost of regular physiotherapy, he can't afford regular therapy—leading to a decreasing chance of rehabilitation. From there we got the idea to make physiotherapy affordable and accessible through technology.",
  },
  'DNA-5481': {
    why: "We chose this theme because in the high-stakes reality of Bangladesh, internet is a luxury but time is a life-saver. By prioritizing an Offline Mesh architecture, we ensure that a patient's medical identity stays physically with them on a QR sticker—not trapped behind a 'No Signal' screen. We move data at the speed of light to eliminate 'Clinical Blindness' and save the Golden Minute when the grid fails.",
    how: "Our solution was born from a Street-Level Reality Check of healthcare gaps in Bangladesh. We realized that while Bangladesh is digitizing, internet is still a luxury in rural and disaster zones. We built for the worst-case scenario—where the grid fails but the patient still needs a doctor. We integrated doctors, pharmacists, and government admins into one Mesh because healthcare is only effective if every player shares the same live data.",
  },
  'DNA-4691': {
    why: "It's innovative, non-invasive, and good for low-resource settings—making it ideal for Bangladesh's healthcare landscape.",
    how: "Based on a research paper, we developed a system that revolutionizes hematology workflows with smart diagnostics and digital blood disorder management tools, making advanced diagnostics accessible without expensive equipment.",
  },
  'DNA-5702': {
    why: "We chose the Smart ICU theme because critical care in Bangladesh faces urgent challenges: fragmented monitoring systems, delayed alerts, and anxious relatives outside the ICU. By expanding monitoring from 4 basic parameters to 12 advanced ones, and integrating AI with remote consultation, we can directly improve patient safety, reduce caregiver workload, and reassure families.",
    how: "Our team combined medical, engineering, and software expertise to design a system that addresses real ICU gaps. We studied conventional ICU monitors, identified their limitations, and developed a prototype that integrates sensors, secure servers, dashboards, and camera feeds. AI algorithms generate predictive alerts while mobile apps connect doctors and relatives. This solution was inspired by real hospital needs in Bangladesh and shaped by our cross-disciplinary collaboration.",
  },
};

async function main() {
  console.log(`Seeding Q&A for ${Object.keys(QA).length} teams...`);
  for (const [teamCode, qa] of Object.entries(QA)) {
    const team = await prisma.team.findFirst({ where: { teamCode } });
    if (!team) { console.log(`  SKIP (not found): ${teamCode}`); continue; }
    await prisma.team.update({
      where: { id: team.id },
      data: { whyTheme: qa.why, howSolution: qa.how },
    });
    console.log(`  Updated: ${team.name} (${teamCode})`);
  }
  console.log('Done.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
