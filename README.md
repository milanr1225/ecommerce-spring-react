# E-commerce App (Spring Boot + React)

A full stack mini web shop: browse and search a product catalog, register and log in, manage a shopping cart, place orders and track their status. Built as a portfolio project to practice designing a real REST API and a typed React client around it.

**Stack:** Java 25 · Spring Boot 4 · Spring Security (JWT) · Spring Data JPA · MySQL 8 · Flyway · React 19 · TypeScript · Vite · TanStack Query · Docker

## Features

- **Authentication:** registration and login with BCrypt-hashed passwords and stateless JWT sessions; role model with `USER` and `ADMIN`
- **Product catalog:** categories, text search, category filter and pagination
- **Shopping cart:** add, update quantity, remove and clear, stored per user in the database
- **Checkout and orders:** shipping details, order history, order details and cancellation
- **Protected pages:** the React app redirects unauthenticated users to the login page
- **Validation and error handling:** Bean Validation on requests and a global exception handler that returns a consistent JSON error format, including per-field errors shown in the forms

## Technical highlights

- **Stock is updated atomically.** Checkout decrements stock with a conditional `UPDATE ... WHERE stock_quantity >= :qty`, so two customers can never buy the same last item. If any item is out of stock, the whole transaction rolls back and the API returns `409 Conflict`.
- **Orders keep a price snapshot.** `order_items` stores the product name and unit price at the time of purchase, so later catalog changes do not alter past orders.
- **Cancelling restores stock.** Only orders in `PENDING_PAYMENT` can be cancelled, and the reserved stock is returned in the same transaction.
- **Users only see their own data.** Orders are always looked up by both order id and user id, so another user's order returns `404`.
- **Versioned database schema.** All tables and seed data are created by Flyway migrations (`V1` to `V6`), and Hibernate only validates the schema (`ddl-auto: validate`).
- **Typed API layer on the frontend.** A small `apiFetch` wrapper attaches the JWT, parses error responses into an `ApiError` and is used by TanStack Query hooks.

## Architecture

```
React (Vite, :5173)  ──/api──▶  Spring Boot (:8080)  ──JPA──▶  MySQL (Docker, :3306)
```

The Vite dev server proxies `/api` to the backend, so the frontend needs no CORS configuration in development.

```
backend/src/main/java/io/github/milanr1225/ecommerce
├── auth/      JWT filter and service, register / login
├── catalog/   products and categories
├── cart/      shopping cart
├── order/     checkout, order history, cancellation
├── user/      user entity and roles
├── common/    error format, pagination, global exception handler
└── config/    Spring Security configuration

frontend/src
├── api/       typed API client (auth, catalog, cart, orders)
├── auth/      auth context, provider and protected routes
├── pages/     product list and detail, cart, checkout, orders, login, register
└── components/
```

## API overview

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | public | Create an account |
| POST | `/api/auth/login` | public | Log in, returns a JWT |
| GET | `/api/auth/me` | required | Current user |
| GET | `/api/products` | public | List products (`q`, `category`, `page`, `size`, `sort`) |
| GET | `/api/products/{slug}` | public | Product details |
| GET | `/api/categories` | public | List categories |
| GET | `/api/cart` | required | Get the cart |
| POST | `/api/cart/items` | required | Add a product |
| PUT | `/api/cart/items/{productId}` | required | Change quantity |
| DELETE | `/api/cart/items/{productId}` | required | Remove a product |
| DELETE | `/api/cart` | required | Clear the cart |
| POST | `/api/orders` | required | Checkout the current cart |
| GET | `/api/orders` | required | Order history |
| GET | `/api/orders/{id}` | required | Order details |
| POST | `/api/orders/{id}/cancel` | required | Cancel an order awaiting payment |
| GET | `/api/health` | public | Health check |

## Getting started

### Prerequisites

- JDK 25
- Node.js 20.19+ (or 22.12+)
- Docker

### 1. Start the database

```bash
docker compose up -d
```

This starts MySQL 8.4 with a `shop` database. Flyway creates the schema and sample data when the backend starts.

### 2. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows use `mvnw.cmd spring-boot:run`. The API runs on `http://localhost:8080`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `JWT_SECRET` | development-only value | Secret used to sign JWTs. **Set your own value outside local development.** |

The database credentials in `docker-compose.yml` and `application.yml` are for local development only.