# Justin Gray's Personal Blog

This is my personal blog built with Astro, designed to be fast, accessible, and easy to maintain. The site focuses on technical content and personal thoughts about software development.

## Core Commands

- Development server: `pnpm dev`
- Build for production: `pnpm build` (runs postbuild automatically)
- Preview build: `pnpm preview`
- Type checking: `pnpm check`
- Format code: `pnpm format`
- Linting: `pnpm lint`

## Architecture Overview

The site follows Astro's content collections pattern:

- **src/content/**: All content (posts, notes, tags)
- **src/components/**: Reusable UI components
- **src/layouts/**: Page layout templates
- **src/pages/**: Route-specific pages and dynamic routes
- **public/**: Static assets (images, icons)

Content is managed through Astro's Content Collections with TypeScript schemas for type safety.

## Development Patterns & Constraints

### Code Style
- Uses Biome for formatting and linting (configured in `biome.json`)
- Tab indentation, 100-character line limit
- JavaScript: trailing commas, semicolons, bracketSameLine: false
- Astro files have relaxed linting rules for unused variables/imports

### Content Structure
- Posts in `src/content/post/` with frontmatter schema validation
- Notes in `src/content/note/` for shorter content
- Tags in `src/content/tag/` for tag page overrides
- Use `.md` for simple posts, `.mdx` for posts requiring React components

### Component Organization
- Shared components in `src/components/`
- Blog-specific components in `src/components/blog/`
- Layout components in `src/layouts/`
- Page components in `src/pages/`

## Build & Deployment

The site builds to `dist/` directory. The `postbuild` script runs Pagefind to generate static search. The site is designed to deploy to any static hosting platform (Vercel, Netlify, Cloudflare Pages, etc.).

## Configuration Files

- `src/site.config.ts`: Site metadata, navigation, and global settings
- `astro.config.ts`: Astro build configuration and integrations
- `biome.json`: Code formatting and linting rules
- `tailwind.config.ts`: Tailwind CSS customization
- `src/content/config.ts`: Content collection schemas

## External Services

- No external APIs required for core functionality
- Pagefind for client-side search (static, no external service)
- Can be configured for webmentions via `src/content/config.ts`

## Conventions

- Posts should have meaningful titles and descriptions for SEO
- Use tags to categorize content (creates automatic tag pages)
- Cover images are optional but recommended for featured posts
- Draft posts are excluded from production builds
- Date format follows locale settings in `site.config.ts`

## Gotchas

- Pagefind search only works after running `postbuild` script
- OG images are generated automatically unless `ogImage` frontmatter is provided
- Content changes may require running `pnpm check` to update TypeScript types
- Astro dev server typically runs on port 4321, not 3000

## Git Workflow

- Main branch is always deployable
- Feature branches should be descriptive
- No strict commit message format required
- Focus on content quality over process overhead
