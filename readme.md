# clipbinder 📋

a clipboard manager for your desktop. capture clips instantly, organize them with pins, search through them, and never lose a copied snippet again.

> AP Capstone project | [proposal](https://docs.google.com/document/d/1uWfvS-us7D5ImEpphO1LEJYi9mHgo3kIRS-vAaUQ2oU/edit?usp=sharing)

## what it does

- **monitor your clipboard** → automatically saves text and image clips as you copy them
- **keyboard shortcuts** → `Cmd+Shift+V` to open/close, `Cmd+J`/`K` to navigate, `Cmd+Enter` to copy, `Cmd+F` to search
- **search clips** → find any clip by content with instant search results
- **sort & filter** → organize by date or length, filter by type (text/images)
- **pin important clips** → keep your most-used clips at the top
- **delete clips** → remove clips you don't need anymore
- **infinite scroll** → load more clips as you scroll down

## tech stack

### frontend (React + Tauri)
- **React 19** with hooks & context API for state management
- **Tauri** for cross-platform desktop app
- **Tailwind CSS** for styling
- **React Router** for navigation
- runs locally on your machine, clips stay private

### backend (Express + PostgreSQL)
- **Express.js** for API endpoints
- **Prisma ORM** for database queries
- **PostgreSQL** for persistent storage
- **JWT authentication** for secure user sessions
- **AWS S3** for image uploads
- REST API with error handling & validation

## setup

### prerequisites
- Node.js 18+
- PostgreSQL running locally
- AWS S3 bucket (for image uploads)

### backend

```bash
cd backend
pnpm install

# setup .env
cp .env.example .env
# add: DATABASE_URL, JWT_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET

# run migrations
pnpm exec prisma migrate dev

# start dev server
pnpm dev
```

backend runs on `http://localhost:3000`

### frontend

```bash
cd app
pnpm install

# setup .env
echo "VITE_BACKEND_URL=http://localhost:3000" > .env.local

# dev mode
pnpm dev

# or build tauri app
pnpm tauri dev
```

## project structure

```
clipbinder/
├── backend/
│   ├── src/
│   │   ├── controllers/    # route handlers
│   │   ├── services/       # business logic
│   │   ├── middleware/     # auth, errors
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # validators
│   └── prisma/             # database schema
├── app/
│   ├── src/
│   │   ├── routes/         # pages (Login, SignUp, Dash)
│   │   ├── services/       # API calls
│   │   ├── hooks/          # custom hooks
│   │   ├── contexts/       # state management
│   │   └── assets/         # images
│   └── src-tauri/          # tauri config
└── readme.md
```

## api endpoints

### auth
- `POST /auth/signup` → register new user
- `POST /auth/login` → login & get JWT

### clips
- `POST /clips/add` → save new clip
- `POST /clips/togglePin` → pin/unpin a clip
- `POST /clips/delete` → delete a clip
- `GET /clips/uploadImage` → get S3 presigned URL

### dashboard
- `GET /dashboard/get` → fetch paginated clips (with sort/filter)
- `GET /dashboard/search` → search clips by content

## features breakdown

### authentication
- sign up with email/password
- JWT stored in localStorage
- protected routes & API endpoints
- auto-logout on token expiry

### clip management
- clipboard listener monitors all copies
- stores text clips and images (uploaded to S3)
- clips tagged by type (plaintext, image, url)
- created timestamp for sorting

### search & filter
- case-insensitive substring matching
- sort by date or length (ascending/descending)
- filter by clip type or show all

### ui/ux
- dark theme for eye comfort
- error messages with context
- keyboard-first navigation

## keyboard shortcuts

| shortcut | action |
|----------|--------|
| `Cmd+Shift+V` | toggle window |
| `Cmd+J` | next clip |
| `Cmd+K` | prev clip |
| `Cmd+Enter` | copy & close |
| `Cmd+F` | focus search |

## environment variables

### backend
```
DATABASE_URL=postgresql://user:pass@localhost:5432/clipbinder
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
```