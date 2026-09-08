import path from 'path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { blogPosts, locations, projects, services, SITE_ORIGIN } from './src/data';

type StaticPage = { canonical: string; title: string; description: string; h1: string; schema: string };
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Emits minimal, route-specific HTML before the existing client application hydrates. */
function seoFirstStaticHtml() {
  return {
    name: 'seo-first-static-html',
    apply: 'build' as const,
    async writeBundle() {
      const outDir = path.resolve(import.meta.dirname, 'dist/public');
      const index = await readFile(path.join(outDir, 'index.html'), 'utf8');
      const origin = SITE_ORIGIN;
      const breadcrumb = (canonical: string, label: string) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Ana sayfa', item: `${origin}/` }, { '@type': 'ListItem', position: 2, name: label, item: `${origin}${canonical}` }] });
      const page = (canonical: string, title: string, description: string, h1: string, schema: Record<string, unknown>): StaticPage => ({ canonical, title, description, h1, schema: JSON.stringify({ '@context': 'https://schema.org', '@graph': [schema, breadcrumb(canonical, h1)] }) });
      const pages: StaticPage[] = [
        page('/', 'Özel üretim mobilya ve mimari ahşap işleri', 'Asya Mobilya Ahşap; eviniz, projeniz ve kullanım biçiminiz için özel üretim mobilya ve mimari ahşap detaylar tasarlar.', 'Mekâna yer açan ahşap.', { '@type': 'LocalBusiness', name: 'Asya Mobilya Ahşap' }),
        page('/marangoz/', 'Hizmetler', 'Mutfak, sabit mobilya, mimari ahşap işler ve özel parçalar için Asya Mobilya Ahşap hizmetleri.', 'Mekânı birlikte kuran işler.', { '@type': 'Organization', name: 'Asya Mobilya Ahşap' }),
        page('/hakkimizda/', 'Atölye', "Asya Mobilya Ahşap'ın ölçü, malzeme ve işçilik etrafında şekillenen yaklaşımı.", 'Eşyadan önce, ilişkiyi tasarlıyoruz.', { '@type': 'Organization', name: 'Asya Mobilya Ahşap' }),
        page('/iletisim/', 'İletişim', 'Özel mobilya veya mimari ahşap projenizi Asya Mobilya Ahşap’a anlatın.', 'Projenizi anlatın.', { '@type': 'Organization', name: 'Asya Mobilya Ahşap' }),
        ...services.map((item) => page(item.canonical, item.seoTitle, item.seoDescription, item.name, { '@type': 'Service', name: item.name, description: item.summary })),
        ...locations.map((item) => page(item.canonical, item.seoTitle, item.seoDescription, `${item.name} için ölçülü çözümler.`, { '@type': 'LocalBusiness', name: 'Asya Mobilya Ahşap', areaServed: item.name, description: item.summary })),
        ...projects.map((item) => page(item.canonical, item.seoTitle, item.seoDescription, item.name, { '@type': 'CreativeWork', name: item.name, description: item.summary })),
        ...blogPosts.map((item) => page(item.canonical, item.seoTitle, item.seoDescription, item.title, { '@type': 'Article', headline: item.title, description: item.excerpt })),
      ];
      for (const current of pages) {
        const canonical = `${origin}${current.canonical}`;
        const head = `<title>${escapeHtml(current.title)} — Asya Mobilya Ahşap</title><meta name="description" content="${escapeHtml(current.description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escapeHtml(current.title)}"><meta property="og:description" content="${escapeHtml(current.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><script type="application/ld+json">${current.schema}</script>`;
        const html = index.replace(/<title>[\s\S]*?<\/title>[\s\S]*?<meta name="description"[^>]*>[\s\S]*?<meta name="robots"[^>]*>[\s\S]*?<meta property="og:title"[^>]*>[\s\S]*?<meta property="og:description"[^>]*>[\s\S]*?<meta property="og:type"[^>]*>/, head).replace('<div id="root"></div>', `<div id="root"><main><h1>${escapeHtml(current.h1)}</h1><p>${escapeHtml(current.description)}</p></main></div>`);
        const destination = current.canonical === '/' ? path.join(outDir, 'index.html') : path.join(outDir, current.canonical, 'index.html');
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, html);
      }
      const urls = [...new Set(pages.map((item) => item.canonical))];
      await writeFile(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${origin}${url}</loc></url>`).join('')}</urlset>`);
    },
  };
}

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    seoFirstStaticHtml(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
