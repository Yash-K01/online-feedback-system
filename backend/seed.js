// Run once:  npm run seed   (wipes and re-creates demo data)
require('dotenv').config();
const connectDB = require('./config/db');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Feedback = require('./models/Feedback');

(async () => {
  await connectDB();
  await Promise.all([Student.deleteMany(), Faculty.deleteMany(), Feedback.deleteMany()]);

  await Faculty.create([
    { facultyId: 'F001', facultyName: 'Dr. Meera Kulkarni', password: 'faculty123' },
    { facultyId: 'F002', facultyName: 'Prof. Rohan Deshmukh', password: 'faculty123' },
  ]);
  await Student.create([
    { studentId: 'S001', name: 'Aarav Patil', password: 'student123' },
    { studentId: 'S002', name: 'Isha Joshi', password: 'student123' },
  ]);
  await Feedback.create([
    { studentId: 'S001', facultyId: 'F001', rating: 5, comments: 'Clear explanations and very helpful in doubt sessions.' },
    { studentId: 'S002', facultyId: 'F001', rating: 4, comments: 'Great lectures. Would love more practice problems.' },
    { studentId: 'S002', facultyId: 'F002', rating: 3, comments: 'Content is good but the pace is a bit fast.' },
  ]);

  console.log('Seeded.  Faculty: F001 / faculty123   Student: S001 / student123');
  process.exit(0);
})();
