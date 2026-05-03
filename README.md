# ⚔️ RPG Maker

Aplicação fullstack para criação e gerenciamento de personagens de RPG. Permite criar fichas completas com atributos, status, habilidades por classe e história em Markdown.

## ✨ Funcionalidades

- Autenticação com email/senha e Google OAuth
- Verificação de email e recuperação de senha
- CRUD completo de personagens
- Ficha com dados gerais, atributos, status e história
- História formatada em Markdown
- Modal de detalhes da classe com habilidades
- Tema dark/light persistido
- Interface mobile-first

---

## 🛠️ Stack

| Camada | Tecnologias |
|---|---|
| Frontend | Vue 3, TypeScript, Vite, Pinia, Vue Router, Tailwind CSS v4 |
| Backend | Node.js, Express, Prisma, PostgreSQL |
| Auth | JWT (cookie HttpOnly), Passport, Google OAuth |
| Email | Resend |
| Testes | Jest + Supertest (backend), Vitest + Vue Test Utils (frontend) |
| Infra | Docker, Docker Compose, Nginx |

---

## 🚀 Rodando o projeto

### Pré-requisitos

- [Node.js 20+](https://nodejs.org)
- [Docker](https://docker.com) (para rodar com Docker)
- [PostgreSQL](https://postgresql.org) (para rodar localmente sem Docker)

---

### Opção 1 — Docker (recomendado)

A forma mais simples. Sobe backend, frontend e banco com um comando.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/rpgmaker.git
cd rpgmaker

# Copie e configure as variáveis de ambiente
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais

# Suba os containers
docker compose up --build
```

Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/docs

---

### Opção 2 — Local (sem Docker)

**Backend:**

```bash
cd backend
cp .env.example .env
# Configure o .env com sua DATABASE_URL e demais variáveis

npm install
npx prisma migrate dev
node server.js
```

**Frontend:**

```bash
cd frontend
cp .env.example .env
# Configure VITE_API_URL=http://localhost:3000

npm install
npm run dev
```

---

## ⚙️ Variáveis de ambiente

### Backend (`backend/.env`)

| Variável | Descrição | Obrigatório |
|---|---|---|
| `DATABASE_URL` | URL de conexão PostgreSQL | ✅ |
| `JWT_SECRET` | Segredo para assinar os tokens JWT | ✅ |
| `FRONTEND_URL` | URL do frontend (para CORS e emails) | ✅ |
| `RESEND_API_KEY` | Chave da API do Resend para emails | ✅ |
| `EMAIL_FROM` | Endereço de origem dos emails | ✅ |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth | ⚠️ opcional |
| `GOOGLE_CLIENT_SECRET` | Secret do Google OAuth | ⚠️ opcional |
| `GOOGLE_CALLBACK_URL` | URL de callback do Google OAuth | ⚠️ opcional |
| `PORT` | Porta do servidor (padrão: 3000) | ❌ |

### Frontend (`frontend/.env`)

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API (ex: http://localhost:3000) |

---

## 🗂️ Estrutura do projeto

```
rpgmaker/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Models do banco de dados
│   │   └── migrations/        # Histórico de migrations
│   └── src/
│       ├── auth/              # Estratégia Google OAuth
│       ├── middlewares/       # Auth middleware (JWT)
│       ├── routes/            # Rotas da API
│       ├── services/          # Serviço de email (Resend)
│       └── tests/             # Testes de integração (Jest)
│
├── frontend/
│   └── src/
│       ├── api/               # Instância Axios e serviços de API
│       ├── components/        # Componentes reutilizáveis
│       ├── composables/       # Lógica reutilizável (useToast)
│       ├── layouts/           # AppLayout e AuthLayout
│       ├── router/            # Rotas e navigation guards
│       ├── stores/            # Estado global (Pinia)
│       ├── tests/             # Testes unitários (Vitest)
│       ├── types/             # Interfaces TypeScript
│       └── views/             # Páginas da aplicação
│
└── docker-compose.yml         # Orquestração dos containers
```

---

## 🔌 API — Endpoints principais

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastro de usuário |
| `POST` | `/auth/login` | Login com email e senha |
| `POST` | `/auth/logout` | Logout |
| `GET` | `/auth/me` | Dados do usuário logado |
| `GET` | `/auth/google` | Inicia login com Google |
| `POST` | `/auth/forgot-password` | Solicita redefinição de senha |
| `POST` | `/auth/reset-password` | Redefine a senha |
| `GET` | `/auth/verify-email` | Verifica o email |

### Personagens
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/characters` | Lista personagens do usuário (paginado) |
| `POST` | `/characters` | Cria um personagem |
| `GET` | `/characters/:id` | Busca um personagem |
| `PUT` | `/characters/:id` | Atualiza um personagem |
| `DELETE` | `/characters/:id` | Remove um personagem |

### Classes
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/classes` | Lista todas as classes |
| `GET` | `/classes/:id` | Busca classe com habilidades |

---

## 🧪 Testes

```bash
# Backend (Jest + Supertest)
cd backend
npm test                  # roda todos os testes
npm run test:coverage     # com relatório de cobertura

# Frontend (Vitest)
cd frontend
npm run test:run          # roda todos os testes
npm run test:coverage     # com relatório de cobertura
```

---

## 📄 Licença

MIT