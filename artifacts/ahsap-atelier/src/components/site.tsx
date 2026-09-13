import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronRight, Instagram, Mail, Menu, Phone, Plus, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { blogPosts, faqs, SITE_ORIGIN, type BlogPost, type Location, type Media, type Project, type Service } from '@/data';

export type Crumb = { label: string; href?: string };

export function breadcrumbSchema(path: string, items: Crumb[]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Ana sayfa', href: '/' }, ...items].map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.label, item: index === items.length ? undefined : item.href,
    })),
  };
}

export function Seo({ title, description, canonical, path, type = 'website', robots = 'index,follow', jsonLd = [] }: { title: string; description: string; canonical?: string; path?: string; type?: string; robots?: string; jsonLd?: Record<string, unknown>[] }) {
  const route = canonical ?? path ?? '/';
  const inferredSchema = route.startsWith('/projeler/') ? { '@context': 'https://schema.org', '@type': 'CreativeWork', name: title, description }
    : route.startsWith('/blog/') ? { '@context': 'https://schema.org', '@type': 'Article', headline: title, description }
      : route.startsWith('/hizmetler/') ? { '@context': 'https://schema.org', '@type': 'Service', name: title, description }
        : undefined;
  const schemas = jsonLd.length ? jsonLd : (inferredSchema ? [inferredSchema] : []);
  useEffect(() => {
    const origin = SITE_ORIGIN;
    document.title = `${title} — Asya Mobilya Ahşap`;
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attr, name); document.head.appendChild(tag); }
      tag.setAttribute('content', content);
    };
    setMeta('description', description);
    setMeta('robots', robots);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    setMeta('og:url', `${origin}${route}`, true);
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${origin}${route}`;
    const old = document.head.querySelector('script[data-seo-jsonld]');
    old?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json'; script.dataset.seoJsonld = 'true';
    script.text = JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [description, robots, route, schemas, title, type]);
  return null;
}

export function MediaPlaceholder({ media, className = '' }: { media: Media; className?: string }) {
  return <div className={`placeholder-media wood-grain ${media.tone} ${className}`} role="img" aria-label={media.alt} data-testid={`media-${media.id}`}>
    {media.src ? <img src={media.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /> : null}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
  </div>;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground" data-testid="breadcrumb-nav">
    <Link href="/" className="transition-colors hover:text-foreground focus-ring" data-testid="link-breadcrumb-home">Ana sayfa</Link>
    {items.map((item, index) => <span className="flex items-center gap-2" key={`${item.label}-${index}`}>
      <ChevronRight size={13} aria-hidden="true" />
      {item.href ? <Link href={item.href} className="transition-colors hover:text-foreground focus-ring" data-testid={`link-breadcrumb-${index}`}>{item.label}</Link> : <span className="text-foreground">{item.label}</span>}
    </span>)}
  </nav>;
}

const navItems = [
  { href: '/marangoz/', label: 'Hizmetler' },
  { href: '/hakkimizda/', label: 'Atölye' },
  { href: '/blog/', label: 'Notlar' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return <header className="relative z-40 border-b hairline bg-background/90 backdrop-blur-md">
    <div className="container-wide flex h-[76px] items-center">
      <div className="flex items-center gap-3">
        <Link href="/" className="focus-ring flex items-center gap-3" onClick={() => setOpen(false)} data-testid="link-logo">
          <img src="/media/logo/logo.webp" alt="Asya Mobilya Ahşap" width="36" height="36" decoding="async" className="h-9 w-9 rounded-full border object-cover" />
          <span className="hidden md:block"><strong className="block text-[15px] leading-none tracking-[.02em]">ASYA</strong><small className="mt-1 block text-[9px] uppercase tracking-[.18em] text-muted-foreground">Mobilya Ahşap</small></span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 flex-1 justify-center" aria-label="Ana navigasyon">
        {navItems.map((item) => <Link href={item.href} key={item.href} className="nav-link focus-ring text-[13px]" aria-current={location.startsWith(item.href.split('/')[1] ? `/${item.href.split('/')[1]}` : item.href) ? 'page' : undefined} data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}</Link>)}
      </nav>

      <div className="flex items-center gap-3 ml-auto">
        <Link href="/iletisim/" className="btn-primary hidden min-h-[40px] px-4 text-xs md:inline-flex" data-testid="link-header-contact">Bir proje konuşalım <ArrowUpRight size={15} /></Link>
        <button className="focus-ring flex h-10 w-10 items-center justify-center md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={open} data-testid="button-mobile-menu">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </div>
    {open && <div className="border-t hairline bg-background px-5 py-5 md:hidden">
      <nav className="container-wide flex flex-col gap-1" aria-label="Mobil navigasyon">
        {navItems.map((item) => <Link href={item.href} key={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b hairline py-4 text-base" data-testid={`link-mobile-${item.label.toLowerCase()}`}>{item.label}<ArrowUpRight size={16} /></Link>)}
        <Link href="/iletisim/" onClick={() => setOpen(false)} className="btn-primary mt-4 text-sm" data-testid="link-mobile-contact">Bir proje konuşalım <ArrowUpRight size={15} /></Link>
      </nav>
    </div>}
  </header>;
}

export function SiteFooter() {
  return <footer className="border-t hairline bg-[#e8e0d3]">
    <div className="container-wide grid gap-12 py-14 md:grid-cols-[1.2fr_.8fr_.8fr_1.3fr] md:py-20">
      <div><div className="mb-5 flex items-center gap-3"><img src="/media/logo/logo.webp" alt="Asya Mobilya Ahşap" width="36" height="36" decoding="async" className="h-9 w-9 rounded-full border object-cover" /><span className="text-sm font-semibold tracking-[.12em]">ASYA MOBİLYA AHŞAP</span></div><p className="max-w-xs text-sm leading-6 text-muted-foreground">Ölçüsü size ait, işçiliği zamana ait özel mobilyalar ve mimari ahşap işler.</p></div>
      <div><p className="eyebrow mb-5">Keşfet</p><div className="flex flex-col gap-3 text-sm"><Link href="/marangoz/" className="hover:text-primary" data-testid="link-footer-services">Hizmetler</Link><Link href="/hakkimizda/" className="hover:text-primary" data-testid="link-footer-about">Atölye</Link><Link href="/blog/" className="hover:text-primary" data-testid="link-footer-blog">Notlar</Link></div></div>
      <div><p className="eyebrow mb-5">Temas</p><div className="flex flex-col gap-3 text-sm"><Link href="/iletisim/" className="flex items-center gap-2 hover:text-primary" data-testid="link-footer-contact"><Mail size={15} /> İletişim formu</Link><span className="text-sm leading-6 text-muted-foreground">Çeliktepe Kahramanlar Cad. &amp; Han Sokak 12/A<br />34413 Kağıthane/İstanbul Türkiye</span><a href="tel:+905375015408" className="flex items-center gap-2 hover:text-primary" data-testid="link-footer-phone"><Phone size={15} /> +90 537 501 54 08</a><a href="https://www.instagram.com/asyamobilyaahsap/" className="flex items-center gap-2 hover:text-primary" target="_blank" rel="noopener noreferrer" data-testid="link-footer-instagram"><Instagram size={15} /> Instagram</a></div></div>
      <div><p className="eyebrow mb-5">Konum</p><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.3949200090437!2d29.001952400000004!3d41.082217199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab66058374013%3A0x2d7d9c42957a2217!2sAsya%20Mobilya!5e0!3m2!1str!2str!4v1789314296909!5m2!1str!2str" title="Asya Mobilya Ahşap konumu" className="min-h-[220px] w-full flex-1 rounded-sm border-0" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
    </div>
    <div className="container-wide flex flex-col justify-between gap-3 border-t hairline py-5 text-[11px] text-muted-foreground md:flex-row"><span>© Asya Mobilya Ahşap · İçerik yer tutucu</span><span className="font-mono uppercase tracking-[.12em]">Malzeme / ölçü / emek</span></div>
  </footer>;
}

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  }, [location]);

  return <div className="site-shell"><SiteHeader /><main>{children}</main><SiteFooter /></div>;
}

export function SectionHeading({ eyebrow, title, copy, align = 'left' }: { eyebrow: string; title: string; copy?: string; align?: 'left' | 'center' }) {
  return <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl`}><p className="eyebrow mb-4">{eyebrow}</p><h2 className="display text-4xl leading-[1.06] md:text-6xl">{title}</h2>{copy && <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground md:text-base">{copy}</p>}</div>;
}

export function ServiceCard({ item, index }: { item: Service; index: number }) {
  return <Link href={`/hizmetler/${item.slug}/`} className="card-lift group block border hairline bg-card p-3 focus-ring" data-testid={`card-service-${item.slug}`}>
    <MediaPlaceholder media={item.media} className="aspect-[1.38] w-full" />
    <div className="flex items-start justify-between gap-3 px-2 pb-2 pt-5"><div><span className="number-mark">0{index + 1} / {item.category}</span><h3 className="mt-2 text-lg font-medium">{item.name}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.summary}</p></div><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border hairline transition-all group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-primary-foreground"><ArrowUpRight size={15} /></span></div>
  </Link>;
}

export function ProjectCard({ item }: { item: Project }) {
  return <Link href={`/projeler/${item.slug}/`} className="group block focus-ring" data-testid={`card-project-${item.slug}`}><div className="overflow-hidden"><MediaPlaceholder media={item.media} className="aspect-[1.32] transition-transform duration-500 group-hover:scale-[1.025]" /></div><div className="mt-4 flex items-start justify-between gap-4"><div><span className="eyebrow">{item.type}</span><h3 className="display mt-2 text-2xl">{item.name}</h3></div><ArrowUpRight className="mt-1 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={19} /></div></Link>;
}

export function BlogCard({ item }: { item: BlogPost }) {
  return <Link href={`/blog/${item.slug}/`} className="card-lift group block border hairline bg-card p-3 focus-ring" data-testid={`card-blog-${item.slug}`}><MediaPlaceholder media={item.media} className="aspect-[1.65]" /><div className="px-2 pb-2 pt-5"><div className="flex justify-between gap-3 text-[10px] uppercase tracking-[.12em] text-muted-foreground"><span>{item.category}</span><span>{item.readingTime}</span></div><h3 className="display mt-3 text-2xl leading-tight group-hover:text-primary">{item.title}</h3><p className="mt-3 text-xs leading-5 text-muted-foreground">{item.excerpt}</p></div></Link>;
}

export function LocationCard({ item }: { item: Location }) {
  return <Link href={`/hizmet-bolgeleri/${item.slug}-marangoz/`} className="group flex items-center justify-between border-b hairline py-5 focus-ring" data-testid={`card-location-${item.slug}`}><div><p className="eyebrow">{item.region}</p><h3 className="display mt-1 text-3xl">{item.name}</h3><p className="mt-1 max-w-sm text-xs text-muted-foreground">{item.summary}</p></div><ArrowUpRight size={19} className="text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>;
}

export function FaqList({ items = faqs }: { items?: typeof faqs }) {
  const [active, setActive] = useState<string | null>(null);
  return <div className="divide-y hairline" data-testid="faq-list">{items.map((faq) => <div key={faq.id}><button className="focus-ring flex w-full items-center justify-between gap-4 py-5 text-left" onClick={() => setActive(active === faq.id ? null : faq.id)} aria-expanded={active === faq.id} data-testid={`button-faq-${faq.id}`}><span className="text-sm font-medium md:text-base">{faq.question}</span><Plus size={18} className={`shrink-0 transition-transform ${active === faq.id ? 'rotate-45' : ''}`} /></button><div className="accordion-content" data-open={active === faq.id}><div><p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-muted-foreground">{faq.answer}</p></div></div></div>)}</div>;
}
