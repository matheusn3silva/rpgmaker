const bcrypt = require('bcrypt');
const prisma = require('../../lib/prisma');

async function createTestUser(overrides = {}) {
    const defaults = {
        name: 'Test User',
        email: `test_${Date.now()}@test.com`,
        password: await bcrypt.hash('senha123', 10),
        verified: true,
    }

    return prisma.user.create({
        data : { ...defaults, ...overrides }
    })
}

async function clearDatabase() {
    await prisma.characterProficiency.deleteMany();
    await prisma.characterStatus.deleteMany();
    await prisma.characterAttributes.deleteMany();
    await prisma.character.deleteMany();
    await prisma.user.deleteMany();
}

module.exports = { createTestUser, clearDatabase }