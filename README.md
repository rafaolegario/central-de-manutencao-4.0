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
| Swagger UI | http://localhost:8080/swagger |
| PostgreSQL | `localhost:5432` |

Para parar tudo: `docker compose down`
Para parar e apagar os dados do banco: `docker compose down -v`

### 4. Resetando para um estado limpo (banco zerado)

Útil para exercitar o fluxo de primeira configuração (cadastro do primeiro administrador) ou começar do zero em testes.

```bash
docker compose down -v
docker compose up --build
```

`-v` remove o volume `postgres_data` (todos os dados do banco), e `--build` garante que a API seja recompilada com o código atual. Na subida, o EF Core recria o schema vazio — nenhum usuário é semeado, então o app mobile mostrará o link **"Primeira configuração? Criar conta de administrador"** na tela de login.

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

- O app mobile consome a API real via `EXPO_PUBLIC_API_URL` (configurada no `docker-compose.yml`).
- Na primeira execução não há nenhum usuário cadastrado — abra o app e use o link **"Primeira configuração? Criar conta de administrador"** na tela de login para criar o primeiro admin.
