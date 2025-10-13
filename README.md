# Justin Gray's Blog

## Development Commands

| Command          | Action                                                         |
| :--------------- | :------------------------------------------------------------- |
| `pnpm install`   | Installs dependencies                                          |
| `pnpm dev`       | Starts local dev server at `localhost:4321`                    |
| `pnpm build`     | Build your production site to `./dist/`                        |
| `pnpm postbuild` | Pagefind script to build the static search of your blog posts  |
| `pnpm preview`   | Preview your build locally, before deploying                   |
| `pnpm sync`      | Generate types based on your config in `src/content/config.ts` |

## Adding New Posts

To add a new blog post:

1. Create a new `.md` or `.mdx` file in the `src/content/post/` directory
2. The filename will become the URL slug for your post
3. Add frontmatter with the following structure:

```yaml
---
title: "Your Post Title"
description: "A brief description for SEO and social sharing"
publishDate: "2024-01-15"
tags: ["tag1", "tag2"]
---
```

### Optional Frontmatter Fields

- `updatedDate`: When the post was last updated
- `coverImage`: Add a hero image with `{ src: "path/to/image", alt: "description" }`
- `ogImage`: Custom Open Graph image (auto-generated if not provided)
- `draft`: Set to `true` to exclude from production build

## Content Structure

- **Posts**: Long-form articles in `src/content/post/`
- **Notes**: Short thoughts and links in `src/content/note/`
- **Tags**: Create tag pages in `src/content/tag/` (filename must match tag name)

## Configuration

Key configuration files:
- `src/site.config.ts`: Site metadata, author info, and navigation
- `astro.config.ts`: Astro build configuration
- `tailwind.config.ts`: Tailwind CSS customization
- `src/layouts/Base.astro`: Main layout and HTML structure

## Features

- ✅ Dark/Light mode toggle
- ✅ Responsive design
- ✅ SEO optimized with auto-generated sitemap
- ✅ RSS feed for posts
- ✅ Full-text search with Pagefind
- ✅ Syntax highlighting with Expressive Code
- ✅ Open Graph image generation
- ✅ MDX support for interactive components
