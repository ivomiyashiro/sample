# Sample Monorepo

A full-stack application with NestJS API and React frontend, organized with screaming architecture principles.

## 🏗️ Project Structure

```
sample/
├── apps/
│   ├── api/          # NestJS Backend (Port 3001)
│   │   └── src/
│   │       ├── core/         # Core infrastructure
│   │       ├── modules/      # Business modules
│   │       └── shared/       # Shared utilities
│   └── web/          # React Frontend (Port 3000)
└── packages/         # Shared packages (if any)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended package manager)

### Installation

```bash
pnpm install
```

### Development

```bash
# Start both applications
pnpm dev

# Start individual applications
pnpm dev:api    # API only
pnpm dev:web    # Web only
```

### Building

```bash
# Build both applications
pnpm build

# Build individual applications
pnpm build:api
pnpm build:web
```

### Testing

```bash
# Run tests for both applications
pnpm test

# Run tests for individual applications
pnpm test:api
pnpm test:web
```

## 🎨 Code Quality

### Linting & Formatting

- **ESLint**: Project-specific configurations for API (Node.js) and Web (React)
- **Prettier**: Centralized formatting rules for consistent code style

```bash
# Lint all projects
pnpm lint

# Format all files
pnpm format
```

### Git Hooks (Husky)

This project uses Husky to enforce code quality through Git hooks:

#### 🔍 Pre-commit Hook

- Runs `lint-staged` to lint and format only staged files
- Ensures code quality before commits

#### 📝 Commit Message Hook

- Validates commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
- Enforces consistent commit history

#### 🧪 Pre-push Hook

- Runs all tests before pushing to remote
- Prevents broken code from reaching the repository

## 📋 Conventional Commits

This project enforces conventional commit messages. Use the following format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Commit Types:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes
- **perf**: Performance improvements
- **ci**: CI/CD changes
- **build**: Build system changes
- **revert**: Revert previous commit

### Examples:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login form validation issue"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for user service"
```

## 🏛️ Architecture

### Screaming Architecture

Both applications follow screaming architecture principles:

- **Business Domain Focus**: Folders organized by business features (users, products, orders)
- **Clear Intent**: Project structure screams what the application does
- **Separation of Concerns**: Core, modules, and shared clearly separated

### API Structure

```
apps/api/src/
├── core/
│   ├── config/       # Configuration
│   ├── database/     # Database setup
│   ├── guards/       # Guards
│   ├── interceptors/ # Interceptors
│   ├── pipes/        # Pipes
│   └── filters/      # Exception filters
├── modules/
│   ├── users/        # User business logic
│   ├── products/     # Product business logic
│   └── orders/       # Order business logic
└── shared/
    ├── decorators/   # Custom decorators
    ├── dto/          # Shared DTOs
    ├── entities/     # Shared entities
    ├── enums/        # Enums
    ├── interfaces/   # Interfaces
    ├── utils/        # Utility functions
    ├── constants/    # Constants
    └── types/        # Type definitions
```

Each module contains:

- `dto/` - Data Transfer Objects
- `entities/` - Database entities
- `interfaces/` - TypeScript interfaces
- `services/` - Business logic
- `controllers/` - HTTP controllers
- `tests/` - Unit and integration tests

## 🛠️ Tech Stack

### Backend (API)

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Jest** - Testing framework

### Frontend (Web)

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **Vitest** - Testing framework

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Staged files linting
- **Commitlint** - Conventional commits

## 📦 Scripts Reference

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `pnpm dev`       | Start both API and web in development |
| `pnpm dev:api`   | Start API only                        |
| `pnpm dev:web`   | Start web only                        |
| `pnpm build`     | Build both applications               |
| `pnpm build:api` | Build API only                        |
| `pnpm build:web` | Build web only                        |
| `pnpm test`      | Run tests for both                    |
| `pnpm test:api`  | Run API tests                         |
| `pnpm test:web`  | Run web tests                         |
| `pnpm lint`      | Lint both projects                    |
| `pnpm lint:api`  | Lint API only                         |
| `pnpm lint:web`  | Lint web only                         |
| `pnpm format`    | Format all files with Prettier        |

## 🤝 Contributing

1. Follow the conventional commit format
2. Ensure tests pass before pushing
3. Maintain the screaming architecture structure
4. Update documentation when adding features
