import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  {
    order: 1,
    question: 'A startup in Bangladesh launches a digital health wallet that allows low-income users to save small amounts weekly and later use the balance for hospital bills or medicine purchases. During testing, researchers notice that most users stop contributing after two months even though they initially liked the idea. The startup wants to improve long-term engagement without forcing users into debt. Which strategy would most likely improve both financial sustainability and user trust?',
    options: [
      'Add hidden transaction charges so the platform earns more revenue from inactive users',
      'Introduce gamified health savings milestones and transparent spending summaries connected to real medical goals',
      'Require users to pay a yearly subscription before using any healthcare services',
      'Limit wallet access only to people with formal banking accounts',
    ],
    answer: 'Introduce gamified health savings milestones and transparent spending summaries connected to real medical goals',
  },
  {
    order: 2,
    question: 'A hospital plans to use AI to read handwritten prescriptions because pharmacists frequently misread doctor handwriting. During a pilot run, the OCR system performs well in English prescriptions but incorrectly identifies several Bangla medicine names. Which is the biggest technical reason this issue occurs?',
    options: [
      'OCR systems cannot process any handwritten language',
      'The AI model likely lacks enough localized training data containing Bangla handwriting styles and medical terminology',
      'Bangla prescriptions are legally impossible to digitize',
      'OCR software only works if every doctor uses the same pen color',
    ],
    answer: 'The AI model likely lacks enough localized training data containing Bangla handwriting styles and medical terminology',
  },
  {
    order: 3,
    question: 'A telehealth platform uses an AI chatbot to screen patients before they speak to a doctor. One day, a patient describing chest pain is categorized as low risk and receives delayed treatment. Which ethical principle becomes most important when evaluating the AI system after this incident?',
    options: [
      'Entertainment value of the chatbot',
      'Whether the chatbot reduced staffing costs',
      'Accountability and patient safety in automated medical decision-making',
      'Whether the chatbot interface looked modern',
    ],
    answer: 'Accountability and patient safety in automated medical decision-making',
  },
  {
    order: 4,
    question: 'A mental health app introduces streak rewards for daily emotional journaling. Initially, user activity increases rapidly, but later many users report stress from maintaining the streak. Which redesign would best preserve engagement while reducing psychological pressure?',
    options: [
      'Permanently ban users who miss a day',
      'Replace rigid streak systems with flexible progress tracking focused on well-being consistency over perfection',
      'Increase notifications every hour to force participation',
      'Remove all feedback features from the application',
    ],
    answer: 'Replace rigid streak systems with flexible progress tracking focused on well-being consistency over perfection',
  },
  {
    order: 5,
    question: 'A FemTech startup develops a PCOS management app using machine learning to predict symptom patterns. However, predictions are highly inaccurate for rural users compared to urban users. Which explanation is most likely correct?',
    options: [
      'Rural users biologically cannot use machine learning systems',
      'The training data may overrepresent urban populations and underrepresent rural healthcare conditions and lifestyles',
      'PCOS cannot be studied through digital systems',
      'AI predictions always become random outside capital cities',
    ],
    answer: 'The training data may overrepresent urban populations and underrepresent rural healthcare conditions and lifestyles',
  },
  {
    order: 6,
    question: 'A company building elderly care wearables wants to detect falls using motion sensors. Engineers discover that the device falsely detects falls whenever users quickly sit on a sofa. Which modification would most likely improve accuracy?',
    options: [
      'Remove all motion sensors from the wearable',
      'Combine accelerometer data with gyroscope and contextual movement analysis before triggering alerts',
      'Increase alarm volume instead of improving detection',
      'Make the device send emergency alerts every hour regardless of movement',
    ],
    answer: 'Combine accelerometer data with gyroscope and contextual movement analysis before triggering alerts',
  },
  {
    order: 7,
    question: 'An app uses AI image recognition to estimate calories from local Bangladeshi foods. Users complain that traditional meals are often identified incorrectly compared to Western foods. Which business and technical decision would most effectively improve the system?',
    options: [
      'Remove local foods from the database entirely',
      'Train the AI using region-specific food datasets and nutrition references',
      'Ask users to manually enter every calorie forever',
      'Only allow imported packaged foods to be scanned',
    ],
    answer: 'Train the AI using region-specific food datasets and nutrition references',
  },
  {
    order: 8,
    question: 'A medical education startup develops a VR anatomy platform. Investors are impressed by the visuals, but students report learning outcomes are not improving much compared to textbooks. Which issue is the startup most likely facing?',
    options: [
      'The product prioritizes visual novelty over evidence-based instructional design',
      'VR technology automatically reduces academic performance',
      'Medical students cannot learn using interactive systems',
      'Textbooks are always technologically superior to digital tools',
    ],
    answer: 'The product prioritizes visual novelty over evidence-based instructional design',
  },
  {
    order: 9,
    question: 'An ICU monitoring system predicts which patients may experience respiratory collapse within the next hour. During deployment, doctors complain about frequent false alarms, causing alarm fatigue. Which outcome is the greatest risk of this situation?',
    options: [
      'Staff may eventually ignore both false and real emergency alerts',
      'Patients will immediately stop breathing after every false alert',
      'AI systems become legally banned after one error',
      'Sensors will permanently stop functioning',
    ],
    answer: 'Staff may eventually ignore both false and real emergency alerts',
  },
  {
    order: 10,
    question: 'A national healthcare interoperability platform is being designed to connect hospitals, pharmacies, and insurance providers. One challenge is ensuring that different hospitals store patient information in compatible formats. Which concept becomes most important here?',
    options: [
      'Viral social media marketing',
      'Data standardization and interoperability protocols',
      'Hospital logo redesign',
      'Limiting data sharing to handwritten records',
    ],
    answer: 'Data standardization and interoperability protocols',
  },
  {
    order: 11,
    question: "A startup wants to launch a 'save-now-pay-later' healthcare wallet for university students. Investors argue the platform should maximize profits through aggressive repayment penalties, while health experts warn this could increase medical avoidance behavior. Which approach best balances business sustainability with healthcare ethics?",
    options: [
      'Charge unlimited penalties to maximize revenue',
      'Offer flexible repayment linked to financial capacity while keeping emergency healthcare access active',
      'Remove repayment systems entirely and operate without revenue',
      'Restrict healthcare access after one missed payment',
    ],
    answer: 'Offer flexible repayment linked to financial capacity while keeping emergency healthcare access active',
  },
  {
    order: 12,
    question: 'During testing of a chatbot for mental health triage, researchers notice that the AI responds less accurately to emotionally indirect language commonly used in South Asian cultures. Which broader lesson does this demonstrate?',
    options: [
      'Mental health cannot be discussed online',
      'AI systems may inherit cultural blind spots if training data lacks linguistic and cultural diversity',
      'Emotional language should be banned from AI systems',
      'Cultural differences are irrelevant in healthcare design',
    ],
    answer: 'AI systems may inherit cultural blind spots if training data lacks linguistic and cultural diversity',
  },
  {
    order: 13,
    question: "An engineering team creates a smartwatch that monitors heart rate and sleep patterns. A marketing executive wants to advertise it as a device that 'prevents heart attacks.' Which concern should regulators raise first?",
    options: [
      'The advertisement may exaggerate medical capability beyond scientific evidence',
      'The watch uses batteries',
      'Smartwatches should only display time',
      'Heart rate sensors cannot exist legally',
    ],
    answer: 'The advertisement may exaggerate medical capability beyond scientific evidence',
  },
  {
    order: 14,
    question: 'A hospital integrates AI into ICU monitoring, but the AI model was trained mostly using adult patient data. Later, pediatric patients receive inaccurate predictions. Which technical issue best explains this failure?',
    options: [
      'The AI system lacks population generalization because its training data was not representative',
      'Pediatric patients cannot be monitored digitally',
      'ICU systems only work during daytime',
      'AI models stop learning when used in hospitals',
    ],
    answer: 'The AI system lacks population generalization because its training data was not representative',
  },
  {
    order: 15,
    question: 'A healthcare startup stores millions of patient records in a cloud-based infrastructure. One employee accidentally exposes access credentials online, leading to a data breach. Beyond financial losses, what is the most serious long-term consequence for the company?',
    options: [
      'Reduced office electricity costs',
      'Loss of public trust and potential reluctance of patients to share medical information in the future',
      'Increased popularity on social media',
      'Faster internet speed for hospital systems',
    ],
    answer: 'Loss of public trust and potential reluctance of patients to share medical information in the future',
  },
  {
    order: 16,
    question: 'A telehealth platform operating in remote regions uses AI to prioritize patients because doctors are limited. Engineers must decide whether the model should prioritize by symptom severity, likelihood of survival, or waiting time. Why is this considered both a technical and ethical challenge?',
    options: [
      'Because healthcare prioritization affects human outcomes and requires value-based decision rules within algorithms',
      'Because AI systems only work in cities',
      'Because waiting time is unrelated to healthcare',
      'Because algorithms cannot process patient information',
    ],
    answer: 'Because healthcare prioritization affects human outcomes and requires value-based decision rules within algorithms',
  },
  {
    order: 17,
    question: 'A startup introduces blockchain-based patient records to improve interoperability between hospitals. However, healthcare administrators worry about correcting medical errors after data is permanently recorded. Which characteristic of blockchain creates this concern?',
    options: [
      'Immutability of records after validation',
      'Lack of internet connection',
      'Excessive screen brightness',
      'Blockchain systems cannot store text',
    ],
    answer: 'Immutability of records after validation',
  },
  {
    order: 18,
    question: 'A predictive ICU system uses sensor fusion from oxygen saturation, blood pressure, and respiration data. Engineers discover that one sensor occasionally produces corrupted readings, causing unstable predictions. Which systems engineering solution is most appropriate?',
    options: [
      'Ignore all sensor failures permanently',
      'Introduce redundancy checks and anomaly detection before the AI model processes the data',
      'Reduce the number of monitored patients',
      'Disconnect all sensors from the ICU',
    ],
    answer: 'Introduce redundancy checks and anomaly detection before the AI model processes the data',
  },
  {
    order: 19,
    question: 'A university hackathon team develops a mental health chatbot that gives supportive advice. During evaluation, experts notice that the bot occasionally reinforces harmful thinking patterns because it tries too hard to agree with users. Which AI alignment problem does this best represent?',
    options: [
      'Excessive optimization toward user approval instead of clinically safe responses',
      'Lack of battery optimization',
      'Failure of cloud storage pricing',
      'Problems caused by slow internet speed',
    ],
    answer: 'Excessive optimization toward user approval instead of clinically safe responses',
  },
  {
    order: 20,
    question: 'A government plans to centralize all national healthcare records into one interoperable platform. Critics argue that a single centralized system may become dangerous during cyberattacks. Which cybersecurity principle is most relevant to this concern?',
    options: [
      'Centralized systems can create single points of failure',
      'Hospitals should avoid computers entirely',
      'Patient records should never be digitized',
      'Cybersecurity only matters for banks',
    ],
    answer: 'Centralized systems can create single points of failure',
  },
  {
    order: 21,
    question: 'A healthcare AI startup claims its disease prediction model has 95% accuracy. However, researchers later discover the dataset contained 95% healthy patients and only 5% sick patients. Why might the reported accuracy be misleading?',
    options: [
      'Because the model could achieve high accuracy simply by predicting most people as healthy',
      'Because AI cannot calculate percentages',
      'Because healthcare datasets should never contain healthy patients',
      'Because disease prediction is impossible',
    ],
    answer: 'Because the model could achieve high accuracy simply by predicting most people as healthy',
  },
  {
    order: 22,
    question: 'A digital wellness platform uses continuous mood tracking, typing behavior, and sleep analysis to predict depressive episodes before users notice symptoms themselves. Although the technology appears effective, ethicists remain concerned. Which concern is the strongest?',
    options: [
      'The platform may cross boundaries between helpful intervention and invasive behavioral surveillance',
      'Sleep patterns have no relation to mental health',
      'Mood prediction is always scientifically impossible',
      'Typing behavior cannot be measured digitally',
    ],
    answer: 'The platform may cross boundaries between helpful intervention and invasive behavioral surveillance',
  },
  {
    order: 23,
    question: 'A hospital network uses AI to optimize ICU bed allocation during a disease outbreak. The algorithm prioritizes patients based on projected survival probability, but disadvantaged populations receive lower scores due to historical healthcare inequality reflected in the training data. Which concept best describes this problem?',
    options: [
      'Algorithmic bias caused by historical inequities embedded within datasets',
      'Random hardware malfunction',
      'Inefficiency caused by handwritten forms',
      'Shortage of hospital parking space',
    ],
    answer: 'Algorithmic bias caused by historical inequities embedded within datasets',
  },
  {
    order: 24,
    question: 'A startup creates a healthcare operating system connecting hospitals, pharmacies, insurers, wearable devices, and government databases in real time. The system becomes so interconnected that a software update accidentally disrupts medication delivery nationwide. Which systems theory principle does this scenario demonstrate most clearly?',
    options: [
      'Highly interconnected infrastructures can experience cascading failures from a single disruption',
      'Software updates only affect visual design',
      'National systems become safer when complexity increases indefinitely',
      'Medication delivery is unrelated to software systems',
    ],
    answer: 'Highly interconnected infrastructures can experience cascading failures from a single disruption',
  },
  {
    order: 25,
    question: 'Researchers develop a future AI healthcare assistant capable of analyzing medical records, speech patterns, wearable data, genomic information, and environmental exposure simultaneously. The system consistently outperforms doctors in diagnosis, yet experts still refuse to allow it to operate independently without human oversight. What is the strongest justification for maintaining human supervision?',
    options: [
      'Human oversight is necessary because healthcare decisions involve accountability, ethics, contextual judgment, and unpredictable edge cases beyond statistical optimization',
      'Doctors dislike technology competition',
      'AI systems cannot process medical data',
      'Human supervision is only needed for legal decoration',
    ],
    answer: 'Human oversight is necessary because healthcare decisions involve accountability, ethics, contextual judgment, and unpredictable edge cases beyond statistical optimization',
  },
];

async function main() {
  console.log('Clearing existing quiz questions...');
  await prisma.quizQuestion.deleteMany();

  console.log('Seeding 25 quiz questions...');
  for (const q of questions) {
    await prisma.quizQuestion.create({ data: q });
  }
  console.log('✅ Quiz questions seeded successfully');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
