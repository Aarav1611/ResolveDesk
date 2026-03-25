const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Complaint = require('./models/Complaint');

dotenv.config();

/**
 * Seed Script
 * Populates the database with sample data for testing:
 *   - 1 Admin user
 *   - 2 Student users
 *   - 6 Complaints (mix of priorities, statuses, and escalation states)
 *
 * Usage: node seed.js
 */

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create users (passwords will be hashed by the pre-save hook)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@resolvedesk.com',
      password: 'admin123',
      role: 'admin',
    });

    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@student.com',
      password: 'student123',
      role: 'student',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@student.com',
      password: 'student123',
      role: 'student',
    });

    console.log('👤 Users created');

    // Create sample complaints
    const complaints = await Complaint.insertMany([
      {
        title: 'Power outage in Block A',
        description:
          'There has been no electricity in Block A hostel since morning. The power cut is affecting all floors.',
        category: 'Electrical',
        status: 'Pending',
        priority: 'High',
        userId: student1._id,
      },
      {
        title: 'WiFi not working in Library',
        description:
          'The wifi and internet connection in the main library has been down for 2 days. Students cannot access online resources.',
        category: 'Internet',
        status: 'In Progress',
        priority: 'Medium',
        userId: student1._id,
      },
      {
        title: 'Broken window in Room 204',
        description:
          'The window glass in Room 204, Block B is broken and needs replacement. It is a safety concern.',
        category: 'Infrastructure',
        status: 'Pending',
        priority: 'Low',
        userId: student1._id,
      },
      {
        title: 'Water leak in washroom',
        description:
          'There is a severe water leak in the second floor washroom of Block C. The water leak is causing flooding.',
        category: 'Plumbing',
        status: 'Escalated',
        priority: 'High',
        isEscalated: true,
        userId: student2._id,
      },
      {
        title: 'Classroom projector malfunction',
        description:
          'The projector in Room 301 is not working. It shows no display even after trying multiple cables.',
        category: 'Academic',
        status: 'Resolved',
        priority: 'Low',
        feedback: 'Projector was replaced. Thank you!',
        userId: student2._id,
      },
      {
        title: 'Fire alarm not functioning',
        description:
          'The fire alarm system in Block D ground floor does not respond when tested. This is a fire safety hazard.',
        category: 'Electrical',
        status: 'Pending',
        priority: 'High',
        userId: student2._id,
      },
    ]);

    console.log(`📝 ${complaints.length} complaints created`);
    console.log('\n--- Seed Complete ---');
    console.log('Admin login:   admin@resolvedesk.com / admin123');
    console.log('Student login:  aarav@student.com / student123');
    console.log('Student login:  priya@student.com / student123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
