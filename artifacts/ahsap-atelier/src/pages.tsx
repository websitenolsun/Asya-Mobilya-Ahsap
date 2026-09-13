import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, Check, Send } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { blogPosts, findBySlug, locations, projects, services, testimonials, type Faq } from '@/data';
import { loadBlogBody } from '@/blog-body';
import { Breadcrumbs, BlogCard, FaqList, LocationCard, MediaPlaceholder, ProjectCard, SectionHeading, ServiceCard, Seo, Shell, type Crumb } from '@/components/site';

const localBusinessSchema = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Asya Mobilya Ahşap' };
const pageSchemas = (canonical: string, crumbs: Crumb[], primary?: Record<string, unknown>, entityFaqs: Faq[] = []) => [
  ...(primary ? [primary] : []),
  ...(entityFaqs.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: entityFaqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }] : []),
];

function PageIntro({ eyebrow, title, copy, crumbs }: { eyebrow: string; title: string; copy: string; crumbs: Crumb[] }) {
  return <section className="container-wide pb-14 pt-12 md:pb-20 md:pt-20"><Breadcrumbs items={crumbs} /><div className="mt-14 max-w-4xl reveal"><p className="eyebrow mb-5">{eyebrow}</p><h1 className="display max-w-4xl text-5xl leading-[.98] md:text-8xl">{title}</h1><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">{copy}</p></div></section>;
}

/** Empty relations intentionally render nothing until editorial data is supplied. */
function RelatedEntityLinks({ services: relatedServices = [], locations: relatedLocations = [], projects: relatedProjects = [] }: { services?: typeof services; locations?: typeof locations; projects?: typeof projects }) {
  if (!relatedServices.length && !relatedLocations.length && !relatedProjects.length) return null;
  return <section className="container-wide border-t hairline py-12"><p className="eyebrow">İlgili bağlantılar</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">{relatedServices.map((item) => <Link key={item.slug} href={item.canonical} className="underline underline-offset-4">{item.name}</Link>)}{relatedLocations.map((item) => <Link key={item.slug} href={item.canonical} className="underline underline-offset-4">{item.name}</Link>)}{relatedProjects.map((item) => <Link key={item.slug} href={item.canonical} className="underline underline-offset-4">{item.name}</Link>)}</div></section>;
}

function EntityFaqs({ faqs: entityFaqs }: { faqs: Faq[] }) {
  return entityFaqs.length ? <section className="container-wide py-16"><SectionHeading eyebrow="Sık sorulanlar" title="Projeye özel bilgiler." /><FaqList items={entityFaqs} /></section> : null;
}

function Home() {
  return <Shell><Seo title="Çeliktepe Marangoz & Özel Ölçü Mobilya | Asya Mobilya" description="Çeliktepe'de özel ölçü marangoz ve mobilya hizmetleri. Mutfak dolabı, gömme dolap, gardırop, TV ünitesi ve ahşap işler için Asya Mobilya Ahşap'a ulaşın." canonical="/" jsonLd={[localBusinessSchema]} />
    <section className="container-wide relative grid min-h-[calc(100dvh-76px)] items-center gap-10 py-12 md:grid-cols-[.92fr_1.08fr] md:gap-20 md:py-20">
      <div className="relative z-10 reveal"><p className="eyebrow mb-6">İstanbul · ölçüye göre üretim</p><h1 className="display max-w-xl text-[clamp(3.8rem,8vw,7.7rem)] leading-[.88]">Mekâna<br /><em className="text-primary">yer açan</em><br />ahşap.</h1><p className="mt-8 max-w-md text-base leading-7 text-muted-foreground md:text-lg">Eviniz için düşünülmüş özel mobilyalar, mimari ahşap işler ve atölye titizliğinde bir üretim süreci.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/iletisim/" className="btn-primary focus-ring" data-testid="link-hero-contact">Projenizi anlatın <ArrowUpRight size={16} /></Link><Link href="/marangoz/" className="btn-quiet focus-ring" data-testid="link-hero-services">Hizmetleri keşfedin</Link></div></div>
      <div className="relative reveal reveal-delay-2">
        <div className="hero-visual placeholder-media aspect-[.82] w-full md:aspect-[.9]">
          <img src="/media/hero/stairs.webp" alt="" aria-hidden="true" fetchPriority="high" decoding="async" width="1189" height="1323" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,rgba(246,216,166,.45),transparent_28%),linear-gradient(145deg,transparent_40%,rgba(23,18,15,.42))]" />
        </div>
        <div className="absolute -bottom-5 -left-4 w-36 border border-primary/30 bg-background p-4 shadow-[var(--shadow-float)] md:-left-10 md:w-44"><p className="eyebrow">Atölye notu</p><p className="display mt-2 text-xl leading-tight">İyi detay, sessiz kalır.</p></div>
      </div>
    </section>
    <div className="overflow-hidden border-y hairline py-4 text-[10px] uppercase tracking-[.2em] text-muted-foreground"><div className="marquee flex w-max gap-10"><span>ölçü</span><span>malzeme</span><span>işçilik</span><span>yerinde montaj</span><span>ölçü</span><span>malzeme</span><span>işçilik</span><span>yerinde montaj</span><span>ölçü</span><span>malzeme</span><span>işçilik</span><span>yerinde montaj</span></div></div>
    <section className="container-wide grid gap-10 py-20 md:grid-cols-[.7fr_1.3fr] md:py-32"><div><p className="eyebrow">01 / yaklaşım</p></div><div><h2 className="display max-w-3xl text-4xl leading-tight md:text-6xl">Hazır bir kalıba değil, <span className="text-primary">sizin hayatınıza</span> göre çalışıyoruz.</h2><p className="mt-7 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">Asya Mobilya Ahşap, marangozluk becerisini mimari düşünceyle bir araya getirir. Her proje, atölyede üretilmeden önce mekânda, ışıkta ve günlük kullanımda sınanır.</p><Link href="/hakkimizda/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary underline decoration-primary/30 underline-offset-8 hover:decoration-primary" data-testid="link-home-about">Atölyeyi tanıyın <ArrowUpRight size={15} /></Link></div></section>
    <section className="bg-[#ded4c5] py-20 md:py-28"><div className="container-wide"><SectionHeading eyebrow="02 / hizmetler" title="Bir mekânın bütün parçaları." copy="Fikrin ilk ölçüsünden son vidaya kadar, birbirini tamamlayan işler." /><div className="mt-12 grid gap-4 md:grid-cols-3">{services.slice(0, 3).map((item, index) => <ServiceCard key={item.slug} item={item} index={index} />)}</div><Link href="/marangoz/" className="btn-quiet mt-8 focus-ring" data-testid="link-home-all-services">24 hizmeti görün <ArrowUpRight size={15} /></Link></div></section>
    {projects.length ? <section className="container-wide py-20 md:py-32"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="03 / seçili işler" title="Yaşanmış gibi duran çizgiler." /><Link href="/projeler/" className="btn-quiet shrink-0 focus-ring" data-testid="link-home-projects">Proje arşivine git <ArrowUpRight size={15} /></Link></div><div className="mt-12 grid gap-10 md:grid-cols-[1.25fr_.75fr]">{projects.slice(0, 2).map((item) => <ProjectCard key={item.slug} item={item} />)}</div></section> : null}
    <section className="bg-primary py-20 text-primary-foreground md:py-28"><div className="container-wide grid gap-14 md:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow text-[#d5c7a8]">04 / nasıl çalışırız</p><p className="mt-4 font-mono text-xs text-primary-foreground/60">Süreç notları · 001—004</p></div><div className="grid gap-9 md:grid-cols-2">{[['01', 'Tanışma & keşif', 'İhtiyacınızı, mekânın ölçüsünü ve projenin sınırlarını dinliyoruz.'], ['02', 'Tasarım & teklif', 'Malzeme, detay ve bütçeyi aynı masada netleştiriyoruz.'], ['03', 'Üretim', 'Onaylanan iş, atölyede sabırla ve kontrol edilerek üretiliyor.'], ['04', 'Montaj', 'Parçalar mekânınıza geliyor; son ayar ve temizlikle tamamlanıyor.']].map(([number, title, copy]) => <div key={number} className="border-t border-white/20 pt-5"><span className="font-mono text-xs text-[#d5c7a8]">{number}</span><h3 className="display mt-3 text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/65">{copy}</p></div>)}</div></div></section>
    <section className="container-wide py-20 md:py-32"><div className="grid gap-14 md:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">05 / nerede</p><h2 className="display mt-4 text-4xl leading-tight md:text-5xl">Yakın çalışmanın<br /><span className="text-primary">farkı var.</span></h2><p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">Yerinde görmek, ölçmek ve malzemeyi birlikte seçmek için seçili bölgelerdeyiz.</p></div><div>{locations.slice(0, 4).map((item) => <LocationCard key={item.slug} item={item} />)}<Link href="/hizmet-bolgeleri/" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary" data-testid="link-home-locations">Bölgeleri inceleyin <ArrowUpRight size={15} /></Link></div></div></section>
    <section className="bg-[#F5F1EA] py-16 sm:py-20 md:py-28"><div className="container-wide"><div className="mx-auto max-w-3xl px-1 text-center text-[#3A3732]"><p className="eyebrow text-[#3A3732]/75">06 / söz</p><blockquote className="mt-6 font-[Cormorant_Garamond,Georgia,serif] text-[clamp(1.8rem,7vw,2.8rem)] leading-[1.2] sm:mt-8 md:text-[42px] md:leading-[1.35]" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Sadeleşen mekân,<br />derinleşen yaşam.</blockquote></div></div></section>
    <section className="container-wide py-20 md:py-32"><div className="flex items-end justify-between gap-5"><SectionHeading eyebrow="07 / atölye notları" title="Malzemeyi biraz daha yakından." /><Link href="/blog/" className="btn-quiet hidden shrink-0 md:inline-flex" data-testid="link-home-blog">Tüm notlar <ArrowUpRight size={15} /></Link></div><div className="mt-10 grid gap-4 md:grid-cols-3">{blogPosts.slice(0, 3).map((post) => <BlogCard key={post.slug} item={post} />)}</div><Link href="/blog/" className="btn-quiet mt-6 md:hidden" data-testid="link-mobile-home-blog">Tüm notlar <ArrowUpRight size={15} /></Link></section>
    <CtaBand />
  </Shell>;
}

function CtaBand() {
  return <section className="container-wide pb-20 md:pb-32"><div className="relative overflow-hidden bg-[#3c3028] px-7 py-12 text-[#f3eadc] md:px-16 md:py-20"><div className="absolute -right-16 -top-28 h-80 w-80 rounded-full border border-[#d4b78a]/25" /><div className="absolute -right-2 -top-16 h-64 w-64 rounded-full border border-[#d4b78a]/20" /><p className="eyebrow text-[#d5c7a8]">Bir sonraki adım</p><h2 className="display relative mt-4 max-w-2xl text-4xl leading-tight md:text-6xl">Mekânınız için ilk çizgiyi birlikte çekelim.</h2><p className="relative mt-5 max-w-md text-sm leading-6 text-[#f3eadc]/65">Projenizin neye ihtiyacı olduğunu birkaç cümleyle anlatın. İlk karşılaşmayı sade tutuyoruz.</p><Link href="/iletisim/" className="btn-primary relative mt-8 bg-[#c69b6b] text-[#2e241e] hover:bg-[#d5b080]" data-testid="link-cta-contact">İletişime geçin <ArrowUpRight size={16} /></Link></div></section>;
}

function ServicesHub() {
  const crumbs = [{ label: 'Hizmetler' }];
  return <Shell><Seo title="Hizmetler" description="Mutfak, sabit mobilya, mimari ahşap işler ve özel parçalar için Asya Mobilya Ahşap hizmetleri." canonical="/marangoz/" jsonLd={pageSchemas('/marangoz/', crumbs)} /><PageIntro eyebrow="Hizmetler / 24 iş kolu" title="Mekânı birlikte kuran işler." copy="Bir odanın tek bir üründen fazlasına ihtiyacı olduğunda, farklı parçaları aynı malzeme ve detay diliyle üretiyoruz." crumbs={crumbs} /><section className="container-wide pb-24"><div className="mb-10 flex items-center justify-between border-y hairline py-4"><span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground">01—24 / iş listesi</span><span className="text-xs text-muted-foreground">Özel üretim · yer tutucu içerik</span></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map((item, index) => <ServiceCard key={item.slug} item={item} index={index} />)}</div></section><CtaBand /></Shell>;
}

function LocationsHub() {
  const crumbs = [{ label: 'Hizmet bölgeleri' }];
  return <Shell><Seo title="Hizmet bölgeleri" description="İstanbul, Kadıköy, Beşiktaş ve diğer bölgeler için Asya Mobilya Ahşap hizmet alanları." canonical="/hizmet-bolgeleri/" jsonLd={pageSchemas('/hizmet-bolgeleri/', crumbs)} /><PageIntro eyebrow="Hizmet bölgeleri / alanlar" title="Kendi bölgenizde birlikte çalışıyoruz." copy="İhtiyacınız olan mekân, çeşitlilik ve işçilik yaklaşımına göre alanlarımıza göre özel çözümler üretiyoruz." crumbs={crumbs} /><section className="container-wide pb-24"><div className="mb-10 flex items-center justify-between border-y hairline py-4"><span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground">01—06 / bölgeler</span><span className="text-xs text-muted-foreground">Özel üretim · yerinde keşif</span></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{locations.map((item, index) => <LocationCard key={item.slug} item={item}  />)}</div></section><CtaBand /></Shell>;
}

function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = findBySlug(services, slug);
  if (!item) return <MissingState label="Hizmet bulunamadı" />;
  const crumbs = [{ label: 'Hizmetler', href: '/marangoz/' }, { label: item.name }];
  const related = services.filter((service) => item.relatedServices.includes(service.slug));
  const groups = [['Kapsam', item.scope], ['Malzemeler', item.materials], ['Süreç', item.process], ['Fiyatı etkileyenler', item.pricingFactors]] as const;
  return <Shell><Seo title={item.seoTitle} description={item.seoDescription} canonical={item.canonical} jsonLd={pageSchemas(item.canonical, crumbs, { '@context': 'https://schema.org', '@type': 'Service', name: item.name, description: item.summary }, item.faqs)} /><PageIntro eyebrow={`${item.category} / hizmet`} title={item.name} copy={item.bluf} crumbs={crumbs} /><section className="container-wide grid gap-12 pb-24 md:grid-cols-[1.1fr_.9fr] md:gap-20"><MediaPlaceholder media={item.media} className="aspect-[1.1] md:sticky md:top-8 md:aspect-[.86]" /><div><span className="number-mark">HİZMET / {item.category}</span><h2 className="display mt-5 text-4xl leading-tight md:text-6xl">İhtiyaca göre<br /><span className="text-primary">planlanır.</span></h2><p className="mt-7 text-base leading-7 text-muted-foreground">{item.detail}</p><div className="mt-10 border-y hairline">{groups.map(([label, values]) => <div key={label} className="grid gap-3 border-b hairline py-5 last:border-0"><span className="font-mono text-[10px] uppercase tracking-[.12em] text-primary">{label}</span><ul className="grid gap-2 text-sm text-muted-foreground">{values.map((value) => <li key={value}>{value}</li>)}</ul></div>)}</div><Link href="/iletisim/" className="btn-primary mt-9 focus-ring" data-testid={`link-service-contact-${item.slug}`}>Bu hizmeti konuşalım <ArrowUpRight size={16} /></Link></div></section><RelatedEntityLinks services={related} locations={locations.filter((location) => item.relatedLocations.includes(location.slug))} projects={projects.filter((project) => item.relatedProjects.includes(project.slug))} />{related.length ? <section className="bg-[#ded4c5] py-20"><div className="container-wide"><SectionHeading eyebrow="İlgili işler" title="Aynı dilde başka parçalar." /><div className="mt-10 grid gap-4 md:grid-cols-3">{related.map((service, index) => <ServiceCard item={service} index={index} key={service.slug} />)}</div></div></section> : null}<EntityFaqs faqs={item.faqs} /><CtaBand /></Shell>;
}

function LocationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const normalizedSlug = slug?.replace(/-marangoz$/, '');
  const item = findBySlug(locations, normalizedSlug);
  if (!item) return <MissingState label="Hizmet bölgesi bulunamadı" />;
  const relatedServices = services.filter((service) => item.relatedServices.includes(service.slug));
  const relatedProjects = projects.filter((project) => item.relatedProjects.includes(project.slug));
  const neighborhoodsLabel = item.slug === 'kadikoy' ? 'Kağıthane mahalleleri' : 'Mahalleler';
  return <Shell><Seo title={item.seoTitle} description={item.seoDescription} canonical={item.canonical} jsonLd={pageSchemas(item.canonical, [{ label: 'Hizmet bölgeleri', href: '/hizmet-bolgeleri/' }, { label: item.name }], { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Asya Mobilya Ahşap', areaServed: item.name }, item.faqs)} /><PageIntro eyebrow={`${item.region} / hizmet bölgesi`} title={`${item.name} için ölçülü çözümler.`} copy={item.summary} crumbs={[{ label: 'Hizmet bölgeleri', href: '/hizmet-bolgeleri/' }, { label: item.name }]} /><section className="container-wide grid gap-12 pb-24 md:grid-cols-[.85fr_1.15fr]"><div className="wood-grain placeholder-media aspect-square md:aspect-[.9] relative overflow-hidden"><img src="/media/locations/4.webp" alt={`${item.name} bölgesi`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#2e241e]/70 to-transparent p-7"><div className="text-[#f5ecdf]"><p className="eyebrow text-[#d5c7a8]">Bölge notu</p><p className="display mt-2 text-3xl">Yakından bakınca<br />farklı görünür.</p></div></div></div><div><p className="eyebrow">Bu bölgede odaklandıklarımız</p><div className="mt-7">{item.focus.map((focus, index) => <div key={focus} className="flex gap-5 border-t hairline py-5"><span className="font-mono text-xs text-primary">0{index + 1}</span><span className="text-lg">{focus}</span></div>)}</div>{item.neighborhoods.length ? <div className="mt-7"><p className="eyebrow">{neighborhoodsLabel}</p><p className="mt-3 text-sm text-muted-foreground">{item.neighborhoods.join(' · ')}</p></div> : null}<Link href="/iletisim/" className="btn-primary mt-8" data-testid={`link-location-contact-${item.slug}`}>Keşif talebi bırakın <ArrowUpRight size={16} /></Link></div></section><RelatedEntityLinks services={relatedServices} projects={relatedProjects} /><EntityFaqs faqs={item.faqs} /></Shell>;
}

function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = findBySlug(projects, slug);
  if (!item) return <MissingState label="Proje bulunamadı" />;
  const relatedServices = services.filter((service) => item.relatedServices.includes(service.slug));
  const relatedLocations = locations.filter((location) => item.relatedLocations.includes(location.slug));
  const relatedProjects = projects.filter((project) => item.relatedProjects.includes(project.slug));
  const crumbs = [{ label: 'Projeler', href: '/projeler/' }, { label: item.name }];
  return <Shell><Seo title={item.seoTitle} description={item.seoDescription} canonical={item.canonical} type="article" jsonLd={pageSchemas(item.canonical, crumbs, { '@context': 'https://schema.org', '@type': 'CreativeWork', name: item.name, description: item.summary }, item.faqs)} /><PageIntro eyebrow={`${item.type} / ${item.year}`} title={item.name} copy={item.summary} crumbs={crumbs} /><section className="container-wide pb-24"><MediaPlaceholder media={item.media} className="aspect-[1.45] md:aspect-[2.1]" /><div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.3fr]"><div><p className="eyebrow">Malzeme paleti</p><div className="mt-5 flex flex-wrap gap-2">{item.materials.map((material) => <span key={material} className="border hairline px-3 py-2 text-xs">{material}</span>)}</div></div><div><p className="text-lg leading-7 md:text-2xl">{item.summary}</p></div></div></section><RelatedEntityLinks services={relatedServices} locations={relatedLocations} projects={relatedProjects} /><EntityFaqs faqs={item.faqs} /><CtaBand /></Shell>;
}

function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = findBySlug(blogPosts, slug);
  const [body, setBody] = useState<string[]>([]);
  useEffect(() => {
    if (!item) return;
    let active = true;
    loadBlogBody(item.slug).then((paragraphs) => { if (active) setBody(paragraphs); });
    return () => { active = false; };
  }, [item]);
  if (!item) return <MissingState label="Not bulunamadı" />;
  const relatedServices = services.filter((service) => item.relatedServices.includes(service.slug));
  const relatedLocations = locations.filter((location) => item.relatedLocations.includes(location.slug));
  const relatedProjects = projects.filter((project) => item.relatedProjects.includes(project.slug));
  const crumbs = [{ label: 'Notlar', href: '/blog/' }, { label: item.title }];
  const hasLargeIntro = blogPosts.slice(0, 6).some((post) => post.slug === item.slug);
  return <Shell><Seo title={item.seoTitle} description={item.seoDescription} canonical={item.canonical} type="article" jsonLd={pageSchemas(item.canonical, crumbs, { '@context': 'https://schema.org', '@type': 'Article', headline: item.title, description: item.excerpt }, item.faqs)} /><PageIntro eyebrow={`${item.category} / ${item.date} / ${item.readingTime}`} title={item.title} copy={item.excerpt} crumbs={crumbs} /><article className="container-wide grid gap-12 pb-24 md:grid-cols-[.78fr_1.22fr]"><MediaPlaceholder media={item.media} className="aspect-[.65] md:sticky md:top-8 md:aspect-[.7]" /><div className="max-w-2xl">{body.map((paragraph, index) => <p key={`${item.slug}-${index}`} className={`${index === 0 && hasLargeIntro ? 'display text-2xl leading-tight md:text-4xl' : 'text-base leading-7'} mb-7 text-foreground`}>{paragraph}</p>)}</div></article><RelatedEntityLinks services={relatedServices} locations={relatedLocations} projects={relatedProjects} /><EntityFaqs faqs={item.faqs} /></Shell>;
}

function BlogIndex() {
  const crumbs = [{ label: 'Notlar' }];
  return <Shell>
    <Seo title="Notlar" description="Atölye notları ve proje paylaşımları." canonical="/blog/" jsonLd={pageSchemas('/blog/', crumbs)} />
    <PageIntro eyebrow="Notlar / arşiv" title="Atölye notları" copy="Atölyenin projeleri, süreçleri ve notları." crumbs={crumbs} />
    <section className="container-wide py-20"><div className="grid gap-4 md:grid-cols-3">{blogPosts.map((post) => <BlogCard key={post.slug} item={post} />)}</div></section>
  </Shell>;
}

function ProjectsIndex() {
  const crumbs = [{ label: 'Projeler' }];
  return <Shell>
    <Seo title="Projeler" description="Asya Mobilya Ahşap'ın özel üretim mobilya ve mimari ahşap işleri." canonical="/projeler/" jsonLd={pageSchemas('/projeler/', crumbs)} />
    <PageIntro eyebrow="Projeler / arşiv" title="Tamamlanan işler" copy="Atölyeden çıkan projelerin tamamı burada." crumbs={crumbs} />
    <section className="container-wide pb-24"><div className="mb-10 flex items-center justify-between border-y hairline py-4"><span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground">01—{projects.length} / iş listesi</span><span className="text-xs text-muted-foreground">Özel üretim · tamamlanan işler</span></div><div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.slug} item={project} />)}</div></section>
  </Shell>;
}

function About() {
  return <Shell><Seo title="Atölye" description="Asya Mobilya Ahşap'ın ölçü, malzeme ve işçilik etrafında şekillenen yaklaşımı." path="/hakkimizda/" /><PageIntro eyebrow="Asya Mobilya Ahşap / atölye" title="Eşyadan önce, ilişkiyi tasarlıyoruz." copy="İyi bir özel üretim, yalnızca güzel görünen bir parça değil; mekânla ve onun içindeki hayatla kurulan uzun bir anlaşmadır." crumbs={[{ label: 'Atölye' }]} /><section className="container-wide grid gap-12 pb-24 md:grid-cols-[.7fr_1.3fr]"><div className="wood-grain placeholder-media aspect-[.82]"><img src="/media/about/2.webp" alt="Atölye 001" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /></div><div><p className="eyebrow">Nasıl bakıyoruz</p><h2 className="display mt-5 max-w-2xl text-4xl leading-tight md:text-6xl">Sade görünenin arkasında <span className="text-primary">çokça düşünce.</span></h2><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">Malzemenin doğal davranışını, mekânın oranını ve kullanıcının gündelik hareketlerini aynı masaya koyuyoruz. Bu yüzden her detayın bir gerekçesi, her birleşimin bir sessizliği var.</p></div></section>

    <section className="container-wide py-20">
      <div className="flex items-end justify-between gap-5"><SectionHeading eyebrow="Seçili işler" title="Projelerimiz" /><Link href="/projeler/" className="btn-quiet hidden md:inline-flex">Proje arşivine git <ArrowUpRight size={15} /></Link></div>
      <div className="mt-10 grid gap-10 md:grid-cols-3">{projects.map((project) => <ProjectCard key={project.slug} item={project} />)}</div>
    </section>

    <section className="bg-primary py-20 text-primary-foreground"><div className="container-wide grid gap-10 md:grid-cols-3">{[['01', 'Ölçü', 'Mekânı varsaymayız; yerinde görür, not alır, yeniden düşünürüz.'], ['02', 'Malzeme', 'Yüzeyin sadece rengini değil, ışıkta ve temasta nasıl değişeceğini konuşuruz.'], ['03', 'Emek', 'Görünmeyen birleşimlerde de görünen yüzey kadar dikkatli oluruz.']].map(([no, title, copy]) => <div key={no} className="border-t border-white/20 pt-5"><span className="font-mono text-xs text-[#d5c7a8]">{no}</span><h3 className="display mt-7 text-3xl">{title}</h3><p className="mt-4 text-sm leading-6 text-primary-foreground/65">{copy}</p></div>)}</div></section><section className="container-wide py-20 md:py-28"><div className="grid gap-12 md:grid-cols-[1fr_1fr]"><div><SectionHeading eyebrow="Sık sorulanlar" title="Başlamadan önce." /></div><FaqList /></div></section><CtaBand /></Shell>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', project: '' });
  const update = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { ok?: boolean };
      if (!response.ok || !result?.ok) throw new Error('Gönderim başarısız oldu.');
      setSent(true);
    } catch {
      setError('Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };
  return <Shell><Seo title="İletişim" description="Özel mobilya veya mimari ahşap projenizi Asya Mobilya Ahşap’a anlatın." path="/iletisim/" /><PageIntro eyebrow="İletişim / ilk adım" title="Projenizi anlatın." copy="Henüz netleşmemiş olabilir. Mekânı, ihtiyacı veya aklınızdaki ilk fikri paylaşmanız yeterli." crumbs={[{ label: 'İletişim' }]} /><section className="container-wide grid gap-14 pb-24 md:grid-cols-[.75fr_1.25fr]"><div><div className="border-t hairline py-5"><p className="eyebrow">Çalışma alanı</p><p className="mt-3 text-sm leading-6">Çeliktepe/Kağıthane ve çevresi<br />Diğer bölgeler · proje kapsamına göre</p></div><div className="border-t hairline py-5"><p className="eyebrow">Yanıt süresi</p><p className="mt-3 text-sm leading-6">Birkaç saat içinde</p></div><div className="border-t hairline py-5"><p className="eyebrow">Doğrudan temas</p><p className="mt-3 text-sm leading-6"><a href="tel:+905375015408" className="hover:text-primary">0537 501 54 08</a><br /><a href="mailto:asyamobilyaweb@proton.me" className="hover:text-primary">asyamobilyaweb@proton.me</a></p></div></div><div className="border hairline bg-card p-6 md:p-10">{sent ? <div className="flex min-h-[360px] flex-col items-start justify-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check size={20} /></span><p className="eyebrow mt-7">Mesaj alındı</p><h2 className="display mt-3 text-4xl">Teşekkürler.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Mesajınız bize ulaştı. En kısa sürede size dönüş yapacağız.</p><Link href="/" className="btn-quiet mt-7" data-testid="link-contact-success-home">Ana sayfaya dön <ArrowUpRight size={15} /></Link></div> : <form onSubmit={submit} className="space-y-7" data-testid="form-contact"><div><label className="eyebrow" htmlFor="name">Adınız</label><input id="name" value={form.name} onChange={update('name')} placeholder="Adınız soyadınız" className="mt-3 w-full border-b hairline bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground/50 focus:border-primary" required data-testid="input-contact-name" /></div><div><label className="eyebrow" htmlFor="phone">Cep telefonu</label><input id="phone" type="tel" value={form.phone} onChange={update('phone')} placeholder="05xx xxx xx xx" className="mt-3 w-full border-b hairline bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground/50 focus:border-primary" required data-testid="input-contact-phone" /></div><div><label className="eyebrow" htmlFor="project">Projeniz</label><textarea id="project" value={form.project} onChange={update('project')} placeholder="Mekân, ihtiyaç veya fikirden bahsedin…" rows={5} className="mt-3 w-full resize-none border-b hairline bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground/50 focus:border-primary" required data-testid="input-contact-project" /></div><button type="submit" className="btn-primary w-full sm:w-auto" disabled={sending} data-testid="button-submit-contact">{sending ? 'Gönderiliyor…' : 'Mesajı gönder'} <Send size={15} /></button>{error ? <p className="text-[11px] leading-5 text-muted-foreground" role="alert" data-testid="form-contact-error">{error}</p> : null}</form>}</div></section><section className="bg-[#ded4c5] py-20"><div className="container-wide grid gap-12 md:grid-cols-[.8fr_1.2fr]"><SectionHeading eyebrow="Sık sorulanlar" title="Kafanızdaki ilk sorular." /><FaqList /></div></section></Shell>;
}

function MissingState({ label }: { label: string }) {
  return <Shell><Seo title="Sayfa bulunamadı" description="Aradığınız içerik bulunamadı." path="/404/" robots="noindex,nofollow" /><section className="container-wide flex min-h-[62dvh] flex-col justify-center py-20"><p className="eyebrow">404 / yer tutucu</p><h1 className="display mt-5 text-6xl">{label}</h1><p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">Bu bağlantı henüz içerik ile eşleştirilmemiş olabilir.</p><Link href="/" className="btn-primary mt-8 w-fit" data-testid="link-missing-home">Ana sayfaya dön <ArrowUpRight size={16} /></Link></section></Shell>;
}

export { About, BlogDetail, BlogIndex, Contact, Home, LocationDetail, LocationsHub, MissingState, ProjectDetail, ProjectsIndex, ServiceDetail, ServicesHub };

