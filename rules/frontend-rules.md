# Frontend Rules & Guidelines

This document outlines the core structural and coding guidelines for the frontend of the project to ensure high code quality, consistency, and a clear architectural pattern. LLMs and developers must strictly adhere to these rules when writing or generating code.

## 1. UI Components & Shadcn UI
- **Always use `shadcn-ui` components** from the UI library.
- **Do NOT create custom components** that duplicate the functionality or purpose of existing `shadcn-ui` components. Avoid rolling out your own inputs, buttons, dialogs, etc., if they already exist in the UI library.

## 2. Component Structure & Naming
- **Atomic Design Pattern:** Components should be structured into `atoms/`, `molecules/`, `organisms/`, and `templates/` following Atomic Design principles.
- **Folder and File Creation:** Whenever creating a component, **always create a folder and a file with the exact same name** using `kebab-case`.
  - *Example:* For a Typography component, create a folder `typography/` and a file `typography.tsx` inside it.
- **Component Naming in Code:** Use `PascalCase` for the React component function name (e.g., `export const Typography = () => {}`) but `kebab-case` for the file.

## 3. Types, Enums & Interfaces
- **Strict Typing:** Always explicitly create and use `interface` and `enum` for data structures, props, and states.
- **No `any`:** Never use the `any` type under any circumstances. Ensure complete type safety.

## 4. Code Quality & Linting
- **ESLint Compliance:** Manage code quality strictly based on ESLint rules. Ensure the code passes all linter checks.
- **Clean Up:** **Always remove unused imports, functions, variables**, and any dead code. Do not leave behind unreferenced variables.

## 5. General Naming Conventions (Inherited Rules)
- **Hooks & Utilities:** Use `camelCase` for files (e.g., `useAuth.ts`, `formatDate.ts`).
- **Routes:** 
  - Use lowercase route names (e.g., `app/dashboard/`).
  - Use route groups with parentheses `()` (e.g., `(auth)/`).
  - Use dynamic routes with brackets `[]` (e.g., `[id]/`).
- **Imports:** Use aliases (e.g., `@/components/...`) instead of complex relative imports.
- **Constants:** Use `UPPER_SNAKE_CASE` for all constant variables.
