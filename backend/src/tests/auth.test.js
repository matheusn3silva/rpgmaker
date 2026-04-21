jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue(true)
}))

const request = require('supertest');
const app = require('../app');
const prisma = require('../lib/prisma');
const { createTestUser, clearDatabase } = require('./helpers/testUser');


beforeEach(async () => {
    await clearDatabase();
})

afterAll(async () => {
    await prisma.$disconnect();
})

describe('POST /auth/register', () => {

    test('Deve criar um novo usuário com dados válidos', async () => {
        // Arrange - Preparar o ambiente para o teste
        const payload = {
            name: 'Novo Usuário',
            email: `novo@test.com`,
            password: 'senha123'
        }

         // Act - Executar a ação que queremos testar
        const response = await request(app)
            .post('/auth/register')
            .send(payload);

        // Assert - Verificar se o resultado é o esperado
        expect(response.status).toBe(201);
        expect(response.body.message).toContain('Verifique seu email')

        const user = await prisma.user.findUnique({ where: { email: payload.email } })
        expect(user).not.toBeNull();
        expect(user.verified).toBe(false);
    })

    test('Deve retornar 400 quando faltam campos obrigatórios', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ email: 'imcompleto@test.com' });

        expect(response.status).toBe(400);
    })

})

describe('POST /auth/login', () => {
    test('Deve retornar erro para email não verificado', async () => {
        // Arrange - Preparar o ambiente para o teste
        await createTestUser({
            email: 'naoVerificado@test.com',
            verified: false
        })

        // Act - Executar a ação que queremos testar
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'naoVerificado@test.com', password: 'senha123' });

        // Assert - Verificar se o resultado é o esperado
        expect(response.status).toBe(403);
        expect(response.body.code).toBe('EMAIL_NOT_VERIFIED');
    })

    test('Deve fazer login com credenciais válidas', async () => {
        await createTestUser({
            email: 'valido@test.com',
            verified: true
        })

        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'valido@test.com', password: 'senha123' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login realizado com sucesso');

        expect(response.header['set-cookie']).toBeDefined();
    })

    test('Deve retornar 401 com senha incorreta', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'usuario@test.com', password: 'senhaErrada' });

        expect(response.status).toBe(401);
    })
})

describe('GET /auth/me', () => {
    test('Deve retornar 401 sem cookie de autenticação', async () => {
        const response = await request(app).get('/auth/me');
        expect(response.status).toBe(401);
    })

    test('Deve retornar dados do usuário autenticado', async () => {
        // Arrange - Preparar o ambiente para o teste
        await createTestUser({
            email: 'logado@test.com',
            verified: true
        })

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: 'logado@test.com', password: 'senha123' });

        expect(loginResponse.status).toBe(200);

        const cookie = loginResponse.header['set-cookie'];

        // Act - Executar a ação que queremos testar
        const response = await request(app)
            .get('/auth/me')
            .set('Cookie', cookie);

        // Assert - Verificar se o resultado é o esperado
        expect(response.status).toBe(200);
        expect(response.body.email).toBe('logado@test.com');
    })
})