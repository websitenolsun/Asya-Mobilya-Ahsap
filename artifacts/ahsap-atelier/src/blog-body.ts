// Yazı gövdeleri ana pakete girmez; yalnızca o yazının sayfası açıldığında yüklenir.
// (Bu dosya vite.config.ts tarafından import EDİLMEMELİDİR — import.meta.glob yalnızca uygulama derlemesinde çalışır.)
const loaders = import.meta.glob<{ default: { body: string[] } }>('./content/blog/bodies/*.json');

export async function loadBlogBody(slug: string): Promise<string[]> {
  const loader = loaders[`./content/blog/bodies/${slug}.json`];
  if (!loader) return [];
  try {
    return (await loader()).default.body ?? [];
  } catch {
    return [];
  }
}
