import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Member {
  name: string;
  photoUrl: string;
}

// teamCode in DB → members from registrations CSV
const TEAM_MEMBERS: Record<string, Member[]> = {
  'DNA-7776': [ // AXION
    { name: 'Tabassum Akter Nitu', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777371906/gqyh1ajrptduflsrdrfi.jpg' },
    { name: 'Priyanka Bhattacharjee', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777371933/qkgajryvxhqzqtomhb2d.jpg' },
    { name: 'Rupali Dutta', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777371951/gylbgrcjhxcmktkwbllz.jpg' },
  ],
  'DNA-1058': [ // Team 42
    { name: 'Farhan Ishrak Sami', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777825352/fhbw1deui0qqds2cgnae.jpg' },
    { name: 'Md. Foisal Ahmed Rafi', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777825365/uoqijsaiz2dxnsgkbftx.jpg' },
    { name: 'Zainab Ansari', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777825395/kbbqejfpyvkbdmukn8z6.jpg' },
    { name: 'Tarek Hossain Fahim', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777825411/hpyxobddqhhktrqhwjbq.jpg' },
    { name: 'Habibur Rahman', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777825440/bqqomiwfiyq8pjc4bvbq.jpg' },
  ],
  'DNA-9480': [ // Serenity Squad
    { name: 'Khairun Nahar Mou', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777543703/be6uwxb5knkbkihvnfan.jpg' },
    { name: 'Afnan Alam', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777543718/hwtczofglb8gq0bbtf9h.jpg' },
    { name: 'Nadia Hossain Tasnim', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777543744/i3a0dkifqhyvmzq0x16t.jpg' },
    { name: 'Anaya Hossain', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777543769/p0xpagajnnr8u5w2afnp.jpg' },
  ],
  'DNA-8007': [ // Team ImmuNexa
    { name: 'Abdur Rhaman Shakil', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777828406/lmqkmaq7ddruo7pkfbot.jpg' },
    { name: 'Mehzabin Mostafa Mohona', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777828421/fqxobnxqnimzpsnzmf9o.jpg' },
    { name: 'Prianka Chakraborty', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777828432/j5v8cbpvsaewsn3rxsol.jpg' },
    { name: 'Iqram Hossain Sadique', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777828451/bcafqrx2r6lfzn5uqwfc.jpg' },
  ],
  'DNA-9804': [ // SYNC SQUAD
    { name: 'Moumita Tasrin', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778049017/gjhentasl1zpfw1p1iqc.png' },
    { name: 'Akram Hossen Roni', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778049028/rtwe8lop2rpth95e49tk.jpg' },
    { name: 'Anhara Muksud Ohee', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778049039/glidw346zlju5vobkjj5.jpg' },
    { name: 'Sadia Binta Maksud Iva', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778049089/xsyikmvvp4xiuatuvns1.jpg' },
  ],
  'DNA-4795': [ // Medi Conect
    { name: 'Md. Robiul Islam', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777396543/owutwtc1ysqclnxyrjkd.jpg' },
    { name: 'Salehin Ahmed', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777396579/ohhqb1u0vdowkvuqe3vj.jpg' },
    { name: 'Minhazur Rahman Faysal', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777396614/lpblnrdkuglnxxnr93jx.jpg' },
    { name: 'Nusrat Jahan Nitu', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777396644/f6czdojvjwsxf5jrp98d.jpg' },
  ],
  'DNA-8629': [ // CUET Mongolchari
    { name: 'Mahamuda Shafi Tanha', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777131166/uauqtrvekmd7di9frrb4.jpg' },
    { name: 'Saad Bin Mahbub', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777131204/bkq6kfedtomhvx3oqemj.jpg' },
    { name: 'Md. Junayet Hossain Shuvo', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777131234/sxujy59sas45xwnkjctx.jpg' },
    { name: 'Sayed Nakibur Rahman', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777131280/nklxgkwlk9yz80pxw81i.jpg' },
  ],
  'DNA-8505': [ // Vanguard
    { name: 'Sree Bhushan Goswami', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777816850/yzohfoknoppxtlk2xswn.jpg' },
    { name: 'Antu Das', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777816870/pjhcavbicknddtnp8vv0.jpg' },
    { name: 'Debangana Datta', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777816899/rpuqhofxpunkyijptaab.jpg' },
    { name: 'Mrinali Mandal', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777816921/akuujkptzdcvtdlfkrgm.jpg' },
  ],
  'DNA-6684': [ // MediCare HMS
    { name: 'Md. Manon Haque', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777998812/xu46envftwjovy40e8y3.jpg' },
    { name: 'Shuvro Debnath', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777998820/rlq30tntnmhuxmca3tf4.jpg' },
    { name: 'Rahthin Ez Zaman Elma', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777999065/edyoa7tcvoprin5uvrg3.jpg' },
    { name: 'Oarisa Rebayet', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778000506/h3gygpvwmcul84mkf6dv.jpg' },
    { name: 'Nukta Samin Haque', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777999771/iyrmoetgy8ztzk9f3bzw.avif' },
  ],
  'DNA-8241': [ // Nexus
    { name: 'Nuzhat Nubayra', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777186584/xadbvhyo7wnns948bsox.jpg' },
    { name: 'Zubair Al Munsur', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777186604/vttaqnkqrntxhvk2i0ri.jpg' },
    { name: 'Md. Shahriar Rahad', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777186619/jlqfuuevscuv5m2tqp9h.jpg' },
    { name: 'Shah Muhammad Nafi', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777186641/h3bpjfqeq6kqxzv7pkqe.jpg' },
  ],
  'DNA-9506': [ // GapHack
    { name: 'Adnan Tahsin Hossain', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777476394/f1pgjtxbniirxhuiipdv.jpg' },
    { name: 'Meherab Sakib Niloy', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777476411/bzejm3gfv0ukvnpqdyib.jpg' },
    { name: 'Mehdi Hasan', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777476426/tqavvmr3oxkmmuxrfuay.jpg' },
    { name: 'Md. Sajjad Hossain', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777476453/hfcrmb3x9pz8d4jg7x3q.jpg' },
  ],
  'DNA-3525': [ // Arekta team
    { name: 'Md. Rashedin Khan Srejon', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777999039/voqjsrrsxwj71qxtkao4.jpg' },
    { name: 'Sumaiya Zannat', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777999107/reeud0uyz1y8mqmamtwb.jpg' },
    { name: 'Ramisa Morshed Chowdhury', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777999119/fyvexumdnqvc1kyxgoby.jpg' },
    { name: 'Epshita Tarannum Chowdhury', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777999143/ihtwrwgu8buwf9vpy7ki.jpg' },
  ],
  'DNA-4961': [ // AutoMed
    { name: 'Md Shahriar Hossain', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777288866/r8gz9fqfsypwzhefnj0x.jpg' },
    { name: 'Mehadi Hasan', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777288888/jnf7k4bkxwcmkasufqbz.jpg' },
    { name: 'Dip Kanti Barua', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777288908/uxo6vlpgq6yq5gxp9wif.jpg' },
    { name: 'Swagata Das Labanya', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777288940/kzrgnqvr5iuqw2hkgziy.jpg' },
  ],
  '0J1K6C6X': [ // Livora (registered as DNA-3212)
    { name: 'Farhan Hossain Nirjon', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777481961/tq6nvoerumkogvwofys5.jpg' },
    { name: 'Arnab Das Himel', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777481980/lrzmqbinzl8a0eui2yev.jpg' },
    { name: 'Sameera Akter Shely', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777481996/cscf7pxh4aqxzdgfkdns.jpg' },
  ],
  'DNA-8708': [ // Epidemic Lens
    { name: 'Arpan Sarkar', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/f_jpg/v1777397892/hnvhzwk5divndab0jvnb.heic' },
    { name: 'Pranto Saha', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777397906/u7fwkggp1vqwmf4m2kly.jpg' },
    { name: 'Antoreep Debnath', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777397923/nkpggxwslahpktxjyxmb.jpg' },
    { name: 'Shuvrodip Saha', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777397938/s3yqnblq6vckdtxqlzow.jpg' },
  ],
  'DNA-8183': [ // Syntax Surgeons (registered as DNA-9504)
    { name: 'Prohor Nandy', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778095403/gqapmwxt79uv4vi3ceac.jpg' },
    { name: 'Rezwana Rahim Roshn', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778095411/pgcz67yb5fmxou1ipkph.jpg' },
    { name: 'Augrojit Chattopadhyay', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778095439/vutxt0r2gdilbvuzpeow.jpg' },
    { name: 'S M Hasibul Hussain', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778095446/ehtvkdbtxybsqjgu6owo.jpg' },
  ],
  'DNA-6466': [ // Binary Blood
    { name: 'Syed Jawad Quayum', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777568208/uxz6pmbnpgycamh4wm9d.jpg' },
    { name: 'Saad Bin Farrukh', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777568226/vg3wxkmoxg0vjbflvbwa.jpg' },
    { name: 'Md. Samiul Islam', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777568244/ktkpvr4ebbkzptygbk1p.jpg' },
    { name: 'Md Mahmudul Hasan', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777568266/plhq68rwjxrdz5ctuezh.jpg' },
    { name: 'Md. Shadman Sakib', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777568288/imdz0wm3wfpvqpn01xbc.jpg' },
  ],
  'DNA-6438': [ // Renew_Motion
    { name: 'Md Arfan Ul Haq Nafi', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777737259/gr4yblbx8hx9xdpzyf5r.jpg' },
    { name: 'Md Sagor Ahmed Sobuz', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777737273/hxxhq6fvkh5jqdvs1cit.jpg' },
    { name: 'Aishwarya Barua', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777737288/lxkpnzfxqkrbqflbxiiy.jpg' },
    { name: 'Hamidul Islam Shimul', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777737307/btrwjasf3x0axhb0oaup.jpg' },
    { name: 'Abir Hossain', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777737328/wvnmfyxnflgvlxwq5yzk.jpg' },
  ],
  'DNA-5481': [ // Rhetoric Minds
    { name: 'Sadman Sakib Shoaib', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777031482/kwmaaayaiinu7wxhlfu7.jpg' },
    { name: 'Rabeya Akter Ripa', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777031510/y8ufxfpq7wggkrpjtm2e.jpg' },
    { name: 'S M Mustakim Ahmed Shamim', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777031529/rpijlvemfnxagpjjkdxl.jpg' },
  ],
  'DNA-4691': [ // Team Hemo Hackers
    { name: 'Sadia Islam', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777386529/oswf5as49gnkn4nzuvgw.jpg' },
    { name: 'Samiha Tahsin Kanta', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777386550/dtxlvjbhahbtzqbwlnit.jpg' },
    { name: 'Md. Riasat Bin Asraf', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777386572/p3lvamw8tnoegcl2tkge.jpg' },
    { name: 'Mayisha Binte Akter', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777386598/sxfpwmgabojz5ijdrcuf.jpg' },
  ],
  'DNA-5702': [ // PulseIQ
    { name: 'Md. Farhan Siddiq Fahim', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777651652/mfuzqwwdygivm6g1pgsr.jpg' },
    { name: 'Md. Sakib Hossain', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777651672/jcjafkjfdtzimqbp8dbh.jpg' },
    { name: 'Kazi Hamza Siddiqui', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777651694/r6c4oknagvjucgdkdmfn.jpg' },
    { name: 'Farhan Ahmed', photoUrl: 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777651715/m5xqljpbqtyp2c3gvitb.jpg' },
  ],
};

async function main() {
  console.log('Updating team members...');

  for (const [teamCode, members] of Object.entries(TEAM_MEMBERS)) {
    const team = await prisma.team.findFirst({ where: { teamCode } });
    if (!team) {
      console.log(`  SKIP (not in DB): ${teamCode}`);
      continue;
    }

    await prisma.teamMember.deleteMany({ where: { teamId: team.id } });
    await prisma.teamMember.createMany({
      data: members.map((m) => ({ teamId: team.id, name: m.name, photoUrl: m.photoUrl })),
    });
    console.log(`  Updated members for ${team.name} (${teamCode}): ${members.length} members`);
  }

  console.log('Done.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
