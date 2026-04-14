# Central de Manutenção 4.0

Sistema de gerenciamento de manutenção industrial com API .NET e aplicativo mobile (Expo).

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados

Só isso. Não é necessário ter .NET, Node.js ou PostgreSQL instalados localmente.

---

## Rodando com Docker

### 1. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha os valores:

| Variável | Descrição |
|---|---|
| `POSTGRES_USER` | Usuário do banco de dados |
| `POSTGRES_PASSWORD` | Senha do banco de dados |
| `POSTGRES_DB` | Nome do banco de dados |
| `POSTGRES_PORT` | Porta exposta do PostgreSQL (padrão: `5432`) |
| `POSTGRES_CONTAINER` | Nome do container do banco (padrão: `manutencao_db`) |
| `ADMIN_EMAIL` | E-mail do usuário admin criado no primeiro boot |
| `ADMIN_PASSWORD` | Senha do usuário admin |
| `JWT_SIGNING_KEY` | Chave secreta para assinar tokens JWT (mínimo 32 caracteres) |
| `JWT_EXPIRES_MINUTES` | Tempo de expiração do token em minutos (padrão: `60`) |

### 2. Suba os serviços

```bash
docker compose up --build
```

Na primeira execução o Docker vai baixar as imagens e compilar os projetos — pode demorar alguns minutos. Nas execuções seguintes use `docker compose up` sem `--build`.

### 3. Acesse os serviços

| Serviço | URL |
|---|---|
| Mobile (web) | http://localhost:3000 |
| API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger/ui |
| PostgreSQL | `localhost:5432` |

Para parar tudo: `docker compose down`
Para parar e apagar os dados do banco: `docker compose down -v`

---

## Desenvolvimento local (sem Docker)

### Backend (.NET 10)

```bash
cd backend
# Configure a connection string e outras variáveis no appsettings.json ou via user-secrets
dotnet run --project src/central-de-manutencao.Api
```

Requer [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) e uma instância do PostgreSQL rodando.

### Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

Requer [Node.js](https://nodejs.org/) instalado. Use o app [Expo Go](https://expo.dev/client) no celular ou `--web` para rodar no navegador.

---

## Observações

- O app mobile atualmente usa **dados mockados** e ainda não se integra com a API real. A variável `EXPO_PUBLIC_API_URL` já está configurada no `docker-compose.yml` para quando a integração for implementada.
- O usuário admin definido nas variáveis de ambiente é criado automaticamente na primeira inicialização da API.
