# Vintage Inventory App

A vintage clothing e-commerce application with an innovative **sashiko (Japanese embroidery) customization system** that allows customers to add custom repair designs to vintage garments before checkout.

## Overview

This application specializes in vintage clothing with a unique customization feature. Customers can browse curated vintage pieces, design custom sashiko repair patterns using an interactive canvas, and checkout with their personalized repair plans.

### Key Features

- **Product Catalog**: Browse vintage clothing with search and pagination
- **Sashiko Customizer**: Interactive SVG canvas for designing repair patches
- **Admin Dashboard**: Manage product inventory with full CRUD operations
- **Authentication**: JWT-based user registration, login, and role-based access
- **Checkout Flow**: Review and confirm custom sashiko designs

## Tech Stack

### Frontend (Client)

- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Axios** - HTTP client
- **Zustand** - State management

### Backend (Server)

- **Express 5** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Root

- **concurrently** - Run client and server simultaneously

## Project Structure

```
vintage-inventory-app/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── api/              # Axios API client
│   │   ├── components/
│   │   │   └── shop/         # Shop components
│   │   │       ├── SashikoCustomizerCanvas.jsx
│   │   │       ├── ConditionCareDetail.jsx
│   │   │       ├── ShashikoRepairDetail.jsx
│   │   │       └── PatchWorkshopDetail.jsx
│   │   ├── pages/
│   │   │   ├── Checkout.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Shop.jsx
│   │   │   └── ShopProductDetail.jsx
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   └── customization.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/                   # Express Backend
│   ├── src/
│   │   ├── index.js          # Server entry point
│   │   ├── lib/
│   │   │   └── store.js      # JSON file-based data store
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT authentication
│   │   └── routes/
│   │       ├── auth.js       # /api/auth/*
│   │       └── product.js    # /api/products/*
│   ├── data/                 # JSON database files
│   ├── package.json
│   └── .env.example
│
├── package.json              # Root - concurrent scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. **Install all dependencies**

   ```bash
   npm install
   ```

   This installs root dependencies and sets up the monorepo structure.

2. **Configure environment variables**

   Copy the example environment file and configure:

   ```bash
   cp server/.env.example server/.env
   ```

   Edit `server/.env` with your configuration:

   ```env
   PORT=5001
   NODE_ENV=production
   DATABASE_URL="file:./data/prod-store.json"
   JWT_SECRET="replace-with-a-long-random-secret"
   CORS_ORIGIN="http://localhost:5173"
   SERVE_CLIENT=true
   ENABLE_SEED_ROUTE=false
   ```

   For the client, create `client/.env`:

   ```env
   VITE_API_URL=/api
   ```

### Running the Application

#### Development Mode

Start both client and server concurrently:

```bash
npm run dev
```

This runs:
- **Client**: http://localhost:5173
- **Server**: http://localhost:5001

#### Run Separately

```bash
# Start server only
npm run dev --prefix server

# Start client only
npm run dev --prefix client
```

#### Production Build

```bash
# Build client
npm run build --prefix client

# Server serves built client files when SERVE_CLIENT=true
npm start --prefix server
```

### Creating an Admin User

1. **Option A: Register via API**

   ```bash
   curl -X POST http://localhost:5001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"your-password"}'
   ```

   Then manually edit `server/data/prod-store.json` to change the user's `role` to `"admin"`.

2. **Option B: Enable Seed Route**

   Set `ENABLE_SEED_ROUTE=true` in `server/.env`, then:

   ```bash
   curl -X POST http://localhost:5001/api/products/seed
   ```

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | No | List products (paginated) |
| GET | `/api/products/:id` | No | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Query Parameters for GET /api/products

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `search` | string | - | Search in title/description |
| `category` | string | - | Filter by category slug |
| `minPrice` | number | - | Minimum price |
| `maxPrice` | number | - | Maximum price |

## Data Model

### Product Schema

```javascript
{
  id: number,
  title: string,
  slug: string,
  price: number,
  images: string[],
  category: string,
  description: string,
  materials: string,
  measurementsText: string,
  conditionText: string,
  overallScore: number,
  sashikoNotes: string,
  patchZones: string,      // JSON array of patch zone objects
  patchFabric: string,
  patchStyle: string,
  patchNotes: string,
  repairDifficulty: number,
  featured: boolean,
  active: boolean,
  createdAt: string,
  updatedAt: string
}
```

### User Schema

```javascript
{
  id: number,
  email: string,
  password: string,         // bcrypt hashed
  name: string,
  role: "user" | "admin",
  createdAt: string
}
```

## Sashiko Customization

The app features an interactive canvas for designing sashiko repairs:

1. **Patch Shapes**: Oval, Strip, Panel
2. **Thread Colors**: Indigo, Cream, Charcoal, Red
3. **Stitch Patterns**: Grid, Diagonal, Ladder, Wave
4. **Hardware Options**: Button styles, zipper conversion

Customization data is stored in localStorage and sent with checkout.

## Design System

The UI follows a "quiet luxury" editorial aesthetic:

- **Colors**:
  - Background: `#f4efe7`, `#fbf8f2`
  - Text: `#1c1917`, `#44403c`
  - Accent: `#059669` (emerald)
  - Border: `#e7e5e4`
- **Typography**: Serif headings, clean sans-serif body
- **Layout**: Generous whitespace, image-forward design

## License

MIT
