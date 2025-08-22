const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

async function createTestUsers() {
    console.log('Creating test users...');
    
    const testUsers = [
        {
            name: 'Test Patient',
            email: 'patient@example.com',
            password: 'password123',
            role: 'patient'
        },
        {
            name: 'Dr. Test Doctor',
            email: 'doctor@example.com', 
            password: 'password123',
            role: 'doctor'
        }
    ];

    try {
        for (const user of testUsers) {
            // Check if user already exists
            const existingUser = await db.collection('users')
                .where('email', '==', user.email)
                .get();
            
            if (!existingUser.empty) {
                console.log(`User ${user.email} already exists, skipping...`);
                continue;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            // Create user
            await db.collection('users').add({
                name: user.name,
                email: user.email,
                password: hashedPassword,
                role: user.role
            });

            console.log(`✅ Created user: ${user.email} (${user.role})`);
        }
        
        console.log('\n🎉 Test users created successfully!');
        console.log('You can now login with:');
        console.log('Patient: patient@example.com / password123');
        console.log('Doctor: doctor@example.com / password123');
        
    } catch (error) {
        console.error('Error creating test users:', error);
    }
    
    process.exit(0);
}

createTestUsers();
