const { execSync } = require('child_process');

beforeAll(() => {
    process.env.NODE_ENV = 'test';

    execSync('npx prisma migrate deploy', {
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    })
})