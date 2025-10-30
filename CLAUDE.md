# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start dev server**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Preview production build**: `pnpm preview`
- **Type checking**: `pnpm check` (or `pnpm check:watch` for watch mode)
- **Linting**: `pnpm lint`
- **Format code**: `pnpm format`

## Project Overview

This is a personal portfolio site built with **SvelteKit 2** using **Svelte 5 runes mode**. The site is statically prerendered using `@sveltejs/adapter-static` and deployed to Vercel.

## Architecture

### Svelte 5 Runes Mode

The project uses Svelte 5 with runes enabled globally (`compilerOptions.runes: true` in [svelte.config.js](svelte.config.js)). All components should use runes syntax (`$state`, `$derived`, `$effect`, etc.) instead of legacy Svelte reactivity.

### Content System: Markdoc

Posts/projects are written as `.mdoc` files in [src/posts/](src/posts/) using Markdoc syntax. The Markdoc implementation is in [src/lib/markdoc/](src/lib/markdoc/).

**Key files:**

- [src/lib/markdoc/server.ts](src/lib/markdoc/server.ts) - `getPosts()` and `getPost()` functions read `.mdoc` files from disk, parse frontmatter, and transform to renderable content
- [src/lib/markdoc/types.ts](src/lib/markdoc/types.ts) - Zod schema for frontmatter validation
- [src/lib/markdoc/tags.ts](src/lib/markdoc/tags.ts) - Custom Markdoc tags: `{% grid %}`, `{% color %}`, `{% video %}`
- [src/lib/markdoc/nodes.ts](src/lib/markdoc/nodes.ts) - Custom node transforms (syntax highlighting with Shiki for code fences)

**Post frontmatter structure:**

```yaml
---
title: string
type: 'post' | 'talk' | 'build' | 'video'
directUrl?: string # redirects instead of rendering page
pageUrl?: string
githubUrl?: string
documentUrl?: string
priority?: number
previewTitle?: string
previewText?: string
previewImage?: string # path to image in /src/posts/
previewImageAlt?: string
todo?: boolean
---
```

**Date parsing**: Post slugs follow the pattern `yyyy-mm-dd-slug`, `yyyy-mm-slug`, or `yyyy-slug`. The date is extracted from the slug in [src/lib/markdoc/server.ts:30-42](src/lib/markdoc/server.ts#L30-L42).

**Image handling**: Images in posts are enhanced using `@sveltejs/enhanced-img`. The glob pattern in [src/routes/posts/[slug]/+page.server.ts:11-20](src/routes/posts/[slug]/+page.server.ts#L11-L20) eagerly loads all post images with the `enhanced` query.

### Routing Structure

- [src/routes/+page.svelte](src/routes/+page.svelte) - Homepage, composed of sections from [src/routes/+page/](src/routes/+page/)
- [src/routes/posts/[slug]/+page.svelte](src/routes/posts/[slug]/+page.svelte) - Dynamic post pages
- [src/routes/+layout.svelte](src/routes/+layout.svelte) - Root layout with theme management

### State Management

Global UI state (theme, reduced motion) is managed through Svelte 5 runes in [src/lib/stores/ui.svelte.ts](src/lib/stores/ui.svelte.ts). The `UIManager.svelte` component runs effects to sync with browser APIs.

**Theme system**: Theme is managed via inline script in the `<head>` that runs before page render to prevent flash. The store syncs with `window.__theme`, `window.__systemTheme`, and `window.__themePreference`.

### Styling

Uses **Tailwind CSS 4** via `@tailwindcss/vite` plugin. Typography components are in [src/lib/components/typography/](src/lib/components/typography/).

## Adding New Content

To add a post/project:

1. Create a new `.mdoc` file in [src/posts/](src/posts/) with the filename pattern `yyyy-mm-dd-slug.mdoc`
2. Add frontmatter following the schema in [src/lib/markdoc/types.ts](src/lib/markdoc/types.ts)
3. Write content using Markdoc syntax
4. Place any images in a subdirectory like `src/posts/yyyy-mm-dd-slug/`
5. Reference images with absolute paths: `![alt](/src/posts/yyyy-mm-dd-slug/image.png)`

The homepage will automatically include the new post via `getPosts()` in [src/routes/+page.server.ts](src/routes/+page.server.ts).

## Custom Markdoc Features

- **Code blocks**: Automatically syntax highlighted with Shiki. Supports `[!code highlight]`, `[!code ++]`, `[!code --]`, `[!code error]`, `[!code warning]` annotations
- **Grid layout**: `{% grid %}...{% /grid %}` for side-by-side content
- **Color**: `{% color color="#hex" %}` for inline color display
- **Video**: `{% video playbackId="..." title="..." width=N height=N %}` for Mux videos

## Important Implementation Details

- **Prerendering**: All routes are prerendered (`prerender = true` in [src/routes/+layout.ts](src/routes/+layout.ts))
- **Direct URLs**: Posts with `directUrl` in frontmatter trigger a 307 redirect in [src/routes/posts/[slug]/+page.server.ts:34-36](src/routes/posts/[slug]/+page.server.ts#L34-L36)
- **Image optimization**: Uses `vite-imagetools` for image processing and `@sveltejs/enhanced-img` for responsive images
- **Analytics**: Vercel Analytics injected in [src/routes/+layout.ts](src/routes/+layout.ts)

## Available MCP Tools

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
