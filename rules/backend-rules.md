# Backend Rules & Guidelines (NestJS GraphQL)

This document outlines the structural and coding guidelines for the backend of the project. The backend is built using **NestJS, GraphQL, and TypeScript**, strictly adhering to a **Feature-First Architecture** to ensure modularity and maintainability.

## 1. Feature-First Architecture

- **Organize by Domain/Feature:** Group files by their functional feature rather than their technical type. Each feature must have its own directory containing its module, resolver, service, tests, DTOs, and entities.
  - _Example Structure:_
    ```
    src/features/users/
    ├── users.module.ts
    ├── users.resolver.ts
    ├── users.resolver.spec.ts
    ├── users.service.ts
    ├── users.service.spec.ts
    ├── dto/
    │   └── user.dto.ts
    └── entities/
        ├── user.base.entity.ts
        └── user.response.entity.ts
    ```
- **Encapsulation:** Features must be self-contained. Any cross-feature interaction should be done by importing the required module and injecting its exported services.

## 2. File & Naming Conventions

- **Files and Folders:** Always use `kebab-case` for files and folders (e.g., `user-profile.service.ts`, `auth-guards/`).
- **Same Name Rule:** Whenever creating a new file or component, **always create the folder and file with the exact same name** (e.g., `users/users.module.ts`).
- **Classes:** Use `PascalCase` for classes, decorators, and interfaces (e.g., `export class UsersResolver {}`).
- **Standard Suffixes:** Follow the NestJS naming conventions strictly: `.resolver.ts`, `.service.ts`, `.module.ts`, `.dto.ts`, `.entity.ts`, `.guard.ts`, `.decorator.ts`, `.spec.ts`.

## 3. Types, Enums & Interfaces

- **Strict TypeScript:** Always explicitly create and use `interface` and `enum` for data models, request payloads, and service responses.
- **No `any`:** Never use the `any` type. Always ensure strict typing to prevent runtime errors.
- **Validation:** Use Data Transfer Objects (DTOs) with `class-validator` and `class-transformer` to validate and transform all incoming request payloads.

## 4. Code Quality & Linting

- **ESLint Compliance:** Code quality must be strictly managed using ESLint. The code must pass all linter checks before committing.
- **Clean Code:** **Always remove unused imports, functions, variables, and dead code.** Ensure your files are clean and focused.
- **Dependency Injection:** Rely exclusively on NestJS's Dependency Injection (DI) system. Do not manually instantiate services.

## 5. General Backend Conventions

- **Hooks & Utils:** Utility functions and custom decorators should use `camelCase` for file names unless they export a class.
- **Constants:** Use `UPPER_SNAKE_CASE` for configuration constants and environment variable keys.
- **Path Aliases:** Use TypeScript path aliases (e.g., `import ... from '@/'`) to avoid complex relative paths.
- **Error Handling:** Use built-in NestJS HTTP exceptions (e.g., `NotFoundException`, `BadRequestException`) or create custom exception filters.

## 6. Design Principles

- **SOLID Principles:** Strictly adhere to the SOLID principles of object-oriented design:
  - **S**ingle Responsibility Principle: Each class or module should have one, and only one, reason to change.
  - **O**pen/Closed Principle: Entities should be open for extension but closed for modification.
  - **L**iskov Substitution Principle: Objects should be replaceable with instances of their subtypes without altering program correctness.
  - **I**nterface Segregation Principle: Many client-specific interfaces are better than one general-purpose interface.
  - **D**ependency Inversion Principle: Depend upon abstractions, not concretions. (Leverage NestJS DI extensively).

## 7. Service Layer Constraints

- **Optimized SQL Queries:** Always write optimized database queries (e.g., using proper joins, selecting only required fields, and leveraging TypeORM's query builder or optimized where clauses) to minimize database load and reduce latency.
- **Service Length Limit:** The service file must not exceed 600 lines of code to maintain readability and single responsibility.
