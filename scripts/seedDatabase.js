const { User } = require('../server/db');
const bcrypt = require('bcrypt');
const faker = require('faker');
const { Majors, ResidenceHalls } = require('../shared/constants');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

rl.question('How many fake users to create? ', async (ans) => {
    const numUsers = +ans;
    if (!Number.isInteger(numUsers) || numUsers < 0) {
        rl.close();
        console.log('Invalid response:', ans);
        return;
    }
    for (let i = 0; i < numUsers; ++i) {
        const password = await bcrypt.hash("password123", 10);
        const newUser = await User.create({
            id: User.randomId(),
            email: faker.internet.email(),
            password,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            // 3 to 5
            preferredGroupSize: Math.floor(Math.random() * 3) + 3,
            academicClass: "COM SCI 35L",
            groupState: 1,
            residence: Math.floor(Math.random() * Object.keys(ResidenceHalls).length),
            major: Math.floor(Math.random() * Object.keys(Majors).length),
            startedSearchAt: new Date()
        });
        console.log('Created user', i + 1, 'of', numUsers, ':', newUser.id);
    }

    rl.close();
});
