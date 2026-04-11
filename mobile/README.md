# Central de Manutenção 4.0 — Mobile

React Native app (Expo Router) for the Central de Manutenção 4.0 maintenance management system.

---

## Running the app

```bash
cd mobile
npm install
npx expo start
```

Press `w` to open in browser, `i` for iOS simulator, or `a` for Android emulator.

---

## Demo credentials

| E-mail | Senha | Papel |
|---|---|---|
| admin@empresa.com | 123456 | Administrador |
| joao.silva@empresa.com | 123456 | Técnico |
| rafael.mendes@empresa.com | 123456 | Administrador (2) |

The hints are shown directly on the login screen.

---

## Navigation guide

### 1. Login

Open the app — you land on the **Login** screen.

- Enter any of the credentials above and tap **Entrar**
- The button shows a loading spinner for ~800ms (simulated network call)
- Wrong credentials show an error message inline
- On success, you go straight to the **Painel**

---

### 2. Painel (Dashboard) — tab 1

The home tab. Shows:

- **Greeting** with your first name
- **4 stats cards** (Críticas, Abertas, Em Andamento, Concluídas) — counts computed from mock data
- **5 most recent orders** as tappable cards → tap any to open the order detail
- **Quick actions row** (Admin only) — "Nova Ordem" and "Novo Usuário" buttons

---

### 3. Ordens (Service Orders) — tab 2

Full list of the 12 mock service orders.

- **Filter chips** at the top — tap any status chip (Abertas, Atribuídas, Em Andamento, etc.) to filter the list; "Todas" resets it
- **Tap any card** → opens the **Order Detail** screen
- **+ button** in the header (Admin only) → opens the **Create Order** form

#### Order Detail screen

Reached by tapping any order card.

Shows:
- Priority + Status badges at the top
- Title, location, full metadata card (dates, technician, created by)
- Description block
- Completion notes block (only if the order has notes — e.g. os-005, os-006)
- **Status history timeline** — color-coded dots and lines showing every status transition, who made it and when
- **Admin action buttons** at the bottom:
  - "Editar Ordem" → shows a "coming soon" alert
  - "Cancelar Ordem" → shows a confirmation dialog, then updates the status locally to Canceled (visible immediately in the UI)

Orders worth checking to see all status types:

| Order ID | Title | Status |
|---|---|---|
| os-001 | Substituição de rolamento | InProgress |
| os-004 | Vazamento de óleo | Paused |
| os-005 | Calibração de sensores | Completed (with notes) |
| os-006 | Revisão geral — Gerador | Approved (with notes) |
| os-007 | Ruído anormal — Bomba | Rejected |
| os-008 | Limpeza sistema filtragem | Canceled |
| os-009 | Falha CLP Linha 5 | Reopened (longest timeline) |

#### Create Order form (Admin only)

- Fill in Title and Description (required)
- Location and Prazo are optional
- Tap a **priority chip** to select priority (Low / Média / Alta / Crítica)
- Tap **Criar Ordem** — shows a success alert and goes back
- Leaving required fields empty shows inline errors on each field

---

### 4. Usuários (Users) — tab 3

List of 8 mock users.

- **Filter chips**: Todos, Administradores, Técnicos, Ativos, Inativos
- Note that **Lucas Ferreira** appears with a faded style (inactive user)
- **As Admin**: tap any user card → opens User Detail
- **As Technician**: only your own card is tappable; the others are visually dimmed

#### User Detail screen

Shows:
- Profile header (avatar with initials, name, role badge, specialty badge, active/inactive indicator)
- Info card (email, ID, created date)
- List of orders assigned to this user (if any)
- **Admin action buttons**:
  - "Editar Usuário" → "coming soon" alert
  - "Desativar / Ativar Usuário" → confirmation dialog → toggles active state locally

#### Create User form (Admin only)

- Name, Email, Password (with show/hide toggle), Specialty chips
- Role is fixed to "Técnico" (shown as an info badge)
- Validation: all fields required, email must contain @, password min 6 chars
- Tap **Criar Usuário** → success alert → back

---

### 5. Perfil (Profile) — tab 4

Your own profile.

- Large avatar with initials on an orange background card
- Role and specialty badges
- Info card: email, ID, role
- Activity stats: orders created by you + orders assigned to you
- **Sair da Conta** button → confirmation dialog → logs out → redirects to Login

---

## Testing role differences

Login as **admin@empresa.com** (Admin):
- "+ Nova Ordem" button visible in the Orders tab header
- Quick action buttons visible on the Dashboard
- All user cards tappable in the Users tab
- Edit/cancel/toggle-active buttons visible in detail screens

Login as **joao.silva@empresa.com** (Técnico — João Silva, Eletricista):
- No create buttons anywhere
- Users tab: only João Silva's card is tappable (others are dimmed)
- Order detail: no admin action buttons
- Profile shows 0 orders created, but orders assigned to João (os-005, os-009, os-012)

---

## Project structure

```
mobile/
├── app/
│   ├── _layout.tsx              Root layout — AuthProvider + auth guard
│   ├── (auth)/
│   │   └── login.tsx            Login screen
│   └── (app)/
│       ├── (tabs)/
│       │   ├── index.tsx        Dashboard
│       │   ├── orders.tsx       Orders list
│       │   ├── users.tsx        Users list
│       │   └── profile.tsx      Profile
│       ├── orders/
│       │   ├── [id].tsx         Order detail
│       │   └── create.tsx       Create order
│       └── users/
│           ├── [id].tsx         User detail
│           └── create.tsx       Create user
├── components/
│   ├── AppButton.tsx            Styled button (primary/secondary/ghost/danger)
│   ├── AppInput.tsx             Labeled input with icons and error state
│   ├── StatusBadge.tsx          Colored pill badge for order status
│   ├── PriorityBadge.tsx        Colored pill badge for priority
│   ├── ServiceOrderCard.tsx     Order summary card
│   ├── StatsCard.tsx            Dashboard stats tile
│   └── UserCard.tsx             User summary card
├── context/
│   └── AuthContext.tsx          In-memory auth state (login/logout)
├── data/
│   └── mock.ts                  All mock data + helper functions
└── constants/
    └── theme.ts                 Color palette + border-radius tokens
```

---

## Notes

- All data is **mock only** — no API calls are made. Forms show success alerts without persisting data.
- Auth state is **in-memory** — restarting the app returns you to the login screen.
- The old starter files in `app/(tabs)/` are unused dead code and can be deleted.
