# Contributing to LeadHunter AI

We welcome contributions! Here's how to get started.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/leadhunter-ai.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in your values
5. Set up database: `npm run db:push && npm run db:seed`
6. Start dev server: `npm run dev`

## Pull Request Process

1. Create a branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests: `npm run test`
4. Run type check: `npm run type-check`
5. Commit with a clear message
6. Push and open a PR

## Code Standards

- TypeScript strict mode
- Follow existing patterns
- No `any` types without justification
- Write tests for new features
- Keep components small and focused

## Reporting Issues

Open a GitHub issue with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
