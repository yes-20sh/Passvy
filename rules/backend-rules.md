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

## 6. Logging

- **NestJS Logger:** Always use the built-in NestJS `Logger` class (`@nestjs/common`) instead of `console.log()`.
- **Context:** Instantiate the logger with the class name as context (e.g., `private readonly logger = new Logger(MyService.name);`).
- **Log Levels:** Use appropriate log levels (`log`, `error`, `warn`, `debug`, `verbose`). Log errors comprehensively with relevant context.
- **Exceptions & Errors:** When catching errors, log the error using the logger before throwing an appropriate NestJS HTTP exception (e.g., `NotFoundException`, `InternalServerErrorException`).
