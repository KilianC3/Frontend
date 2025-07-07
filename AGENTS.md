# AGENT Instructions

These guidelines apply to all future commits in this repository.

## General

- Use **TypeScript** for all source files under `src/`.
- Components should be implemented using React functional components.
- Styling is expected to use Tailwind CSS utility classes.
- Keep imports using the `@/` alias when referencing project modules.

## Quality

- Keep the code formatted with Prettier (`npx prettier --write .`).
- Provide meaningful variable and function names.
- Include comments for complex logic and public APIs.

## Verification

- Run `npm run lint` and `npm test` if the scripts exist in `package.json`.
- If these commands are missing, skip them but note the absence in the PR message.

## Pull Requests

- Summaries should describe the features implemented or bugs fixed.
- Mention the result of running lint and test commands in the **Testing** section of the PR description.

