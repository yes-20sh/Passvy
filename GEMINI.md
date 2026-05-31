# Gemini AI Context & Guidelines (Passvy Project)

This document is the master instruction set for Gemini (or any AI assistant) working on this codebase. When interacting with this project, you **MUST** strictly adhere to the guidelines consolidated here and reference the specific files in the `rules/` directory.

## Rule Files Reference

Before proposing architectural changes or large refactors, ensure you align with these files:

1. **[Coding Principles](file:///e:/Passvy/rules/Coding-principle.md)** - General TypeScript, naming, and linting rules.
2. **[Frontend Rules](file:///e:/Passvy/rules/frontend-rules.md)** - React/Next.js, Shadcn UI, and Atomic Design.
3. **[Backend Rules](file:///e:/Passvy/rules/backend-rules.md)** - NestJS GraphQL Feature-First structure, resolvers, DTOs, and entities.

---

## Core Directives for AI Code Generation

### 1. Strict Typing & Code Quality

- **NO `any` or `unknown`:** You are strictly forbidden from using `any` or `unknown`. Always define and use explicit `interface`, `type`, or `enum`.
- **Enums Over Strings:** Always use `enum` for sets of related constants or options.
- **Zero Linter Errors:** Your generated code must be perfect and raise NO errors in ESLint or SonarQube.
- **Clean Code:** Always proactively remove unused imports, variables, and dead code. Do not leave placeholder comments unless absolutely necessary.

### 2. Naming & File Structure Conventions

When generating or modifying files, you must use the following casing:

- **Folders:** Use `kebab-case` → `user-profile/`
- **React Components:** Use `PascalCase` → `UserCard.tsx`
- **Hooks & Utils:** Use `camelCase` → `useAuth.ts`, `formatDate.ts`
- **Next.js Routes:** Use `lowercase` → `app/dashboard/` | Route Groups → `(auth)/` | Dynamic → `[id]/`
- **Constants:** Use `UPPER_SNAKE_CASE`
- **Imports:** Always use path aliases (`@/`) instead of relative imports.

### 3. Frontend Architecture (React/Next.js)

- **Shadcn UI First:** **ALWAYS** use `shadcn-ui` components. **DO NOT** create custom components that mimic or duplicate `shadcn-ui` functionality (e.g., buttons, inputs, dialogs).
- **Component Folder Rule:** Whenever creating a component, you must **always create a folder and file with the exact same name** using `kebab-case` (e.g., `typography/typography.tsx`).
- **Atomic Design:** Place components in the correct tier: `atoms/`, `molecules/`, `organisms/`, or `templates/`.
- **SCSS:** Global styles go in `globals.scss`. Component styles use CSS Modules (`.module.scss`).

### 4. Backend Architecture (NestJS GraphQL)

- **Feature-First Pattern:** Group files by feature domain (e.g., `src/features/users/`), not by type. Features must include their module, resolver, service, tests (`.spec.ts`), DTOs, and entities. Do NOT use controllers.
- **Entities & DTOs Pattern:**
  - One main DTO file per feature (e.g., `dto/user.dto.ts`).
  - Entities must follow the feature prefix convention: `entities/user.base.entity.ts` and `entities/user.response.entity.ts`.
- **Strict Dependency Injection:** Never instantiate services manually. Rely entirely on NestJS DI.
- **Logging & Exceptions:** Always use the built-in NestJS `Logger` (with class name context) and log errors before throwing appropriate NestJS HTTP exceptions.

**Final Instruction to AI:** Acknowledge these rules implicitly by generating code that perfectly conforms to them. Do not apologize or explain that you are following the rules; simply output the correct, compliant code.
