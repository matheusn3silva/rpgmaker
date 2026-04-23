const request = require('supertest');
const app = require('../app');
const prisma = require('../lib/prisma');
const { createTestUser, clearDatabase } = require('./helpers/testUser');

// Função auxiliar para realizar login e obter o token de autenticação
async function loginAndGetToken(email = 'char@test.com') {
    await createTestUser({ email, verified: true });

    const res = await request(app)
        .post('/auth/login')
        .send({ email, password: 'senha123' });

    return res.headers['set-cookie']
}

// Cria uma classe de teste para criação de personagens que precisam de uma classe válida.
async function createTestClass() {
    return prisma.rPGClass.create({
        data: { name: 'Guerreiro', description: 'Classe de combate físico' }
    })
}

beforeEach(async () => {
    await clearDatabase();
})

afterAll(async () => {
    await prisma.$disconnect();
})


describe('POST /characters', () => {
    test('Deve criar um personagem com dados válidos', async () => {
        const cookie = await loginAndGetToken();
        const rpgClass = await createTestClass();

        const response = await request(app)
            .post('/characters')
            .set('Cookie', cookie)
            .send({
                name: 'Aragorn',
                race: 'Humano',
                classId: rpgClass.id,
                level: 4,
                experience: 100,
            })

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(typeof response.body.id).toBe('number');
    })

    test('Deve retornar 400 quando faltam campos obrigatórios', async () => {
        const cookie = await loginAndGetToken();

        const response = await request(app)
            .post('/characters')
            .set('Cookie', cookie)
            .send({ name: 'Sem raça e classe'});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Nome, raça e classe são obrigatórios');
    })

    test('Deve retornar 401 sem autenticação', async () => {
        const response = await request(app)
            .post('/characters')
            .send({
                name: 'Aragorn',
                race: 'Humano',
                classId: 1,
            })

        expect(response.status).toBe(401);
    })
})

describe('GET /characters', () => {
    test('Deve listar apenas personagens do usuário logado', async () => {
        const cookie = await loginAndGetToken();
        const rpgClass = await createTestClass();

        // Criar um personagem para outro usuário
        const otherUser = await createTestUser({
            email: 'user2@test.com', verified: true
        })
        await prisma.character.create({
            data: {
                name: 'Personagem do Outro',
                race: 'Elfo',
                classId: rpgClass.id,
                userId: otherUser.id
            }
        })

        // Criar um personagem para o usuário logado
        await request(app)
            .post('/characters')
            .set('Cookie', cookie)
            .send({
                name: 'Meu personagem', race: 'Humano', classId: rpgClass.id
            });
            
        const response = await request(app)
            .get('/characters')
            .set('Cookie', cookie);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].name).toBe('Meu personagem');
    })

    test('Deve retornar paginação correta', async () => {
        const cookie = await loginAndGetToken();
        const rpgClass = await createTestClass();

        const user = await prisma.user.findFirst({
            where: { email: 'char@test.com' }
        })

        await prisma.character.createMany({
            data: [
                { name: 'P1', race: 'Humano', classId: rpgClass.id, userId: user.id },
                { name: 'P2', race: 'Elfo',   classId: rpgClass.id, userId: user.id },
                { name: 'P3', race: 'Anão',   classId: rpgClass.id, userId: user.id },
            ]
        })

        const response = await request(app)
            .get('/characters?page=2&limit=2')
            .set('Cookie', cookie);
        
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.pagination.total).toBe(3);
        expect(response.body.pagination.totalPages).toBe(2);
    })
})

describe('GET /characters/:id', () => {
    test('Deve retornar personagem do usuário logado', async () => {
        const cookie = await loginAndGetToken();
        const rpgClass = await createTestClass();

        const createRes = await request(app)
            .post('/characters')
            .set('Cookie', cookie)
            .send({
                name: 'Legolas', race: 'Elfo', classId: rpgClass.id
            });

        const response = await request(app)
            .get(`/characters/${createRes.body.id}`)
            .set('Cookie', cookie);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Legolas');
        expect(response.body.attributes).toBeDefined()
        expect(response.body.status).toBeDefined()
    })

    test('Não deve retornar personagem de outro usuário', async () => {
        const rpgClass = await createTestClass();

        const cookie1 = await loginAndGetToken('user1@test.com');
        const createRes = await request(app)
            .post('/characters')
            .set('Cookie', cookie1)
            .send({
                name: 'Personagem privado', race: 'Humano', classId: rpgClass.id
            });
        
        const cookie2 = await loginAndGetToken('user2@test.com');
        const response = await request(app)
            .get(`/characters/${createRes.body.id}`)
            .set('Cookie', cookie2);

        expect(response.status).toBe(404);
    })
})

describe('DELETE /characters/:id', () => {
    test('Deve deletar personagem do usuário logado', async () => {
        const cookie = await loginAndGetToken();
        const rpgClass = await createTestClass();

        const createRes = await request(app)
            .post('/characters')
            .set('Cookie', cookie)
            .send({ name: 'A Deletar', race: 'Humano', classId: rpgClass.id });

        const deleteRes = await request(app)
            .delete(`/characters/${createRes.body.id}`)
            .set('Cookie', cookie);

        expect(deleteRes.status).toBe(200);

        const character = await prisma.character.findUnique({
            where: { id: createRes.body.id }
        });
        expect(character).toBeNull();
    })

    test('Não deve deletar personagem de outro usuário', async () => {
        const rpgClass = await createTestClass();

        const cookie1 = await loginAndGetToken('user1@test.com');
        const createRes = await request(app)
            .post('/characters')
            .set('Cookie', cookie1)
            .send({ name: 'Protegido', race: 'Humano', classId: rpgClass.id });

        const cookie2 = await loginAndGetToken('user2@test.com');
        const deleteRes = await request(app)
            .delete(`/characters/${createRes.body.id}`)
            .set('Cookie', cookie2);

        expect(deleteRes.status).toBe(404);

        const character = await prisma.character.findUnique({
            where: { id: createRes.body.id }
        });
        expect(character).not.toBeNull();
    })
})