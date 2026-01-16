import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const projectAdmins = [
  { email: 'aditig135@gmail.com', name: 'Aditi Gupta' },
  { email: 'barkha2003jain@gmail.com', name: 'Barkha jain' },
  { email: 'akadiriokiki@gmail.com', name: 'Emmanuel Okikiola' },
  { email: 'karakotigaurav12@gmail.com', name: 'Gaurav Karakoti' },
  { email: 'ks492013@gmail.com', name: 'Kishan Sharma' },
  { email: 'mannevaishnavi16@gmail.com', name: 'Manne Vaishnavi' },
  { email: 'alimuneerali245@gmail.com', name: 'Muneer Ali' },
  { email: 'anirudhlakhanpal123@gmail.com', name: 'Anirudh Lakhanpal' },
  { email: 'pankajbind30@gmail.com', name: 'Pankaj Kumar Bind' },
  { email: 'prashantjee2025@gmail.com', name: 'PRASHANT S BISHT' },
  { email: 'prakhardoneria3@gmail.com', name: 'Prakhar Doneria' },
  { email: 'p2005p5499p@gmail.com', name: 'Prabal Patra' },
  { email: 'shannking969@gmail.com', name: 'Soumyadeep Sarkar' },
  { email: 'mrounak198@gmail.com', name: 'Rounak Mishra' },
  { email: 'vishalmaurya850@gmail.com', name: 'Vishal Maurya' },
  { email: 'ayushmanmukherjee12@gmail.com', name: 'Ayushman Mukherjee' },
  { email: 'email.rajkumarbhakta@gmail.com', name: 'Rajkumar Bhakta' },
  { email: 'anujshrivastava10e@gmail.com', name: 'Anuj Shrivastava' },
  { email: 'shivam.24bce11052@vitbhopal.ac.in', name: 'Shivam Singh' },
  { email: 'piyushsujal102@gmail.com', name: 'Piyush Prajapati' },
  { email: 'saismrutiranjan1810@gmail.com', name: 'SAI SMRUTI RANJAN DAS' },
  { email: 'iamtejasgupta26@gmail.com', name: 'Tejas Gupta l' },
  { email: 'shubralijain@gmail.com', name: 'Shubrali jain' },
  { email: 'sandeepvashishtha21@gmail.com', name: 'Sandeep Vashishtha' },
  { email: 'smitijana73@gmail.com', name: 'Smiti Jana' },
  { email: 'shrikrishnasutar0703@gmail.com', name: 'Shrikrishna Ashok Sutar' },
  { email: 'agrimjain2206@gmail.com', name: 'Agrim Jain' },
  { email: 'vaishnavikhandelwal1781@gmail.com', name: 'Vaishnavi khandelwal' },
  { email: 'ffjawed@gmail.com', name: 'Aditya Kumar Tiwari' },
  { email: 'pranathi9191@gmail.com', name: 'Resham Saipranathi' },
  { email: 'suparnamondal1909@gmail.com', name: 'Dipanita Mondal' },
  { email: 'rambaliyaforall@gmail.com', name: 'Rucha Ambaliya' },
  { email: 'sampadatiwari54@gmail.com', name: 'Sampada Tiwari' },
  { email: 'agrawalnavneet960@gmail.com', name: 'Navneet Agarwal' },
  { email: 'mantejarora@gmail.com', name: 'Mantej Singh Arora' },
  { email: 'aqsachoudhary4066@gmail.com', name: 'Aqsa Choudhary' },
  { email: 'kumarransh44@gmail.com', name: 'Manish Kumar Sah' },
  { email: 'anshusahani6104@gmail.com', name: 'Ayush Sahani' },
  { email: 'sahilk64555@gmail.com', name: 'SAHIL' },
  { email: 'srishti.sonam.11@gmail.com', name: 'Srishti Sonam' },
  { email: 'aalammashruf724@gmail.com', name: 'Mohd Mashruf' },
  { email: 'supriyadpandey502@gmail.com', name: 'Supriya Pandey' },
  { email: 'amanraj12.ar@gmail.com', name: 'Aman Raj' },
  { email: 'preetysinha2005@gmail.com', name: 'Preety Sinha' },
  { email: 'vchoudhary999v@gmail.com', name: 'Vishal' },
  { email: 'sourabh.47512@gmail.com', name: 'Sourabh Kumar' },
  { email: 'sumitrathor142272@gmail.com', name: 'Sumit Rathor' },
  { email: 'himanshusing8842@gmail.com', name: 'Himanshu Singh Kyariya' },
  { email: 'nikunjagarwal449@gmail.com', name: 'Nikunj Agarwal' },
  { email: 'gva401@gmail.com', name: 'Vinit Garach' },
  { email: 'prajapativivek998@gmail.com', name: 'Vivek Kumar' },
  { email: 'sayanbasak42@gmail.com', name: 'Sayan Basak' },
  { email: 'pb7439578071@gmail.com', name: 'Parnab Bagchi' },
  { email: 'ritankar.saha786@gmail.com', name: 'Ritankar Saha' },
  { email: 'guptasecular10@gmail.com', name: 'Harsh Gupta' },
  { email: 'saxenaprachi08@gmail.com', name: 'Prachi Saxena' },
  { email: 'machavarshithareddy@gmail.com', name: 'Macha Varshitha' },
  { email: 'sharadreddy11@gmail.com', name: 'Sharad Chandra Reddy' },
  { email: 'shivampilot2004@gmail.com', name: 'Shivam Gupta' },
  { email: 'priyansh_awasthi_mca24s1@jimsindia.org', name: 'Priyansh Awasthi' },
  { email: 'affanshaikhsurabofficial@gmail.com', name: 'Affan Shaikhsurab' },
  { email: 'akhilarul324@gmail.com', name: 'A Akhil' },
  { email: 'aditianand09tkp@gmail.com', name: 'Aditi Anand' },
  { email: 'ashutoshpythoncs@gmail.com', name: 'Ashutosh Kumar' },
  { email: 'himanshuheda123@gmail.com', name: 'Himanshu Heda' },
  { email: 'samarsajad2022@vitbhopal.ac.in', name: 'Samar Sajad' },
  { email: 'ajaypatidar.it@gmail.com', name: 'Ajay Patidar' },
];

async function addProjectAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let added = 0;
    let skipped = 0;

    for (const admin of projectAdmins) {
      const existing = await User.findOne({ 
        $or: [
          { email: admin.email.toLowerCase() },
          { github_username: admin.email }
        ]
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${admin.name} - Already exists`);
        skipped++;
        continue;
      }

      const newUser = new User({
        email: admin.email.toLowerCase(),
        fullName: admin.name,
        name: admin.name,
        github_username: admin.email.split('@')[0],
        github_id: `${admin.email}-${Date.now()}`,
        role: 'Admin',
        avatar_url: `https://avatars.githubusercontent.com/u/${Math.random().toString().slice(2, 10)}?v=4`,
        isActive: true,
        stats: {
          totalPRs: 0,
          mergedPRs: 0,
          prPoints: 0,
          bonusPoints: 0,
          points: 0,
          rank: 0,
        },
      });

      await newUser.save();
      console.log(`✅ Added: ${admin.name}`);
      added++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Added: ${added}`);
    console.log(`⏭️  Skipped: ${skipped}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addProjectAdmins();
