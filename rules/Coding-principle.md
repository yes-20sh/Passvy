# TypeScript Coding Principles & Guidelines

This document outlines the core coding principles for writing TypeScript code in the project. The primary goals are to maintain high code quality, strict type safety, zero static analysis errors, and a clean, consistent architecture.

## 1. Strict Type Safety

- **No `any` or `unknown`:** The use of `any` and `unknown` types is strictly forbidden. Always define explicit interfaces, types, or enums for all variables, parameters, and return types.
- **Always Use Enums:** Use `enum` for sets of related constants or fixed values instead of string literals or magic numbers.
- **Interfaces & Types:** Always declare an explicit `interface` or `type` for data structures.

## 2. Code Quality & Static Analysis

- **Zero Errors Policy:** Code must compile and build with zero warnings or errors.
- **ESLint & SonarQube:** All code must perfectly pass ESLint and SonarQube checks. You must fix all code smells, vulnerabilities, and warnings raised by these tools. Ignoring or disabling rules inline is discouraged unless absolutely necessary.
- **Clean Code:** Always remove unused imports, unused functions, dead variables, and commented-out code.

## 3. General Rules & Naming Conventions

Follow these strict rules across the entire project:

- **Folders:** Use `kebab-case` for folders → `user-profile/`
- **Components:** Use `PascalCase` for components → `UserCard.tsx`
- **Hooks/Utils:** Use `camelCase` for hooks/utils → `useAuth.ts`, `formatDate.ts`
- **Routes (Next.js):**
  - Use lowercase route names → `app/dashboard/`
  - Use route groups with `()` → `(auth)/`
  - Use dynamic routes with `[]` → `[id]/`
- **Imports:** Use aliases `import ... from '@/'` instead of relative imports.
- **Constants:** Use `UPPER_SNAKE_CASE` for global configuration values or constants.

## 4. Styling Conventions

- **SCSS Globals:** Put all global styles in `globals.scss`.
- **SCSS Modules:** Use SCSS modules for component-specific styling → `Button.module.scss`.

## 5. Architectural Alignment

- Structure your code systematically using the specific frontend (Atomic Design) and backend (Feature-First) guidelines.
- Create directories and files concurrently (e.g., if you create a component, always create a folder and a file with the same name).
