const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'RPG Maker API',
            version: '1.7.0',
            description: 'API para gerenciamente de personagens de RPG'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Desenvolvimento local'
            },
        ],
        // Componentes reutilizáveis
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token'
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Manasi' },
                        email: { type: 'string', example: 'manasi@email.com' }
                    },
                },
                Character: {
                    type: 'object',
                    properties: {
                        id:         { type: 'integer', example: 1 },
                        name:       { type: 'string',  example: 'Aragorn' },
                        race:       { type: 'string',  example: 'Humano' },
                        level:      { type: 'integer', example: 5 },
                        experience: { type: 'integer', example: 1200 },
                        class_name: { type: 'string',  example: 'Guerreiro' },
                        classId:    { type: 'integer', example: 1 },
                        createdAt:  { type: 'string',  format: 'date-time' },
                    },
                },
                CharacterAttributes: {
                    type: 'object',
                    properties: {
                        strength:      { type: 'integer', example: 15 },
                        dexterity:     { type: 'integer', example: 12 },
                        constitution:  { type: 'integer', example: 14 },
                        intelligence:  { type: 'integer', example: 10 },
                        education:     { type: 'integer', example: 10 },
                        presence:      { type: 'integer', example: 8 },
                        power:         { type: 'integer', example: 10 },
                        size:          { type: 'string',  example: 'Médio', nullable: true },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Mensagem de erro' },
                    },
                },

                Pagination: {
                    type: 'object',
                    properties: {
                        total:      { type: 'integer', example: 10 },
                        page:       { type: 'integer', example: 1 },
                        limit:      { type: 'integer', example: 5 },
                        totalPages: { type: 'integer', example: 2 },
                    },
                },
            },
        },
        
        security: [{ cookieAuth: [] }],
    },
    
    apis: ['./src/routes/*.js'], // Caminho para os arquivos de rotas    
}

module.exports = swaggerJsdoc(options);
