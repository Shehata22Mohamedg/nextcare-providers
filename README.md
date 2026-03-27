# Nextcare Providers

Frontend application for browsing and filtering provider data.

## Requirements

- Node.js 18+
- npm

## Getting started

```sh
npm install
npm run dev
```

## Available scripts

- `npm run dev` - Start the Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest once
- `npm run test:watch` - Run Vitest in watch mode

## Tech stack

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS

## Deployment (GitHub Pages)

This project deploys through GitHub Actions using:

- [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)

When code is pushed to main, GitHub Actions builds dist and publishes it to GitHub Pages.

### One-time setup

1. In GitHub: Settings > Pages.
2. Under Build and deployment, use GitHub Actions.
3. Confirm the site URL is:
	https://shehata22mohamedg.github.io/nextcare-providers/

### Daily workflow (commit and deploy)

1. Pull latest changes:
	git pull origin main
2. Make code changes.
3. Run checks locally:
	npm install
	npm run build
4. Commit and push:
	git add .
	git commit -m "Describe your change"
	git push origin main
5. Wait for the workflow to finish:
	GitHub > Actions > Deploy to GitHub Pages > latest run should be green.

### Quick verification after deploy

Open these URLs and confirm status 200:

- https://shehata22mohamedg.github.io/nextcare-providers/
- https://shehata22mohamedg.github.io/nextcare-providers/manifest.json
- https://shehata22mohamedg.github.io/nextcare-providers/data/providers.xlsx

If your browser still shows old JS files, hard refresh with Ctrl+Shift+R.

### Useful commands

- Check local changes:
  git status --short
- See recent commits:
  git log --oneline -n 5
- Monitor the latest deployment run:
  gh run list --workflow deploy-pages.yml --limit 1
