import ahsapBolmeDekorasyon from './content/services/ahsap-bolme-dekorasyon.json';
import ahsapKapi from './content/services/ahsap-kapi.json';
import ahsapMerdiven from './content/services/ahsap-merdiven.json';
import ahsapRafSistemleri from './content/services/ahsap-raf-sistemleri.json';
import bankoResepsiyon from './content/services/banko-resepsiyon.json';
import calismaMasasi from './content/services/calisma-masasi.json';
import dolapKapakDegisimi from './content/services/dolap-kapak-degisimi.json';
import eskiMobilyaYenileme from './content/services/eski-mobilya-yenileme.json';
import gardrop from './content/services/gardrop.json';
import gommeDolap from './content/services/gomme-dolap.json';
import hasarliMobilyaOnarimi from './content/services/hasarli-mobilya-onarimi.json';
import kitaplik from './content/services/kitaplik.json';
import magazaIsletmeMobilyalari from './content/services/magaza-isletme-mobilyalari.json';
import menteseRayAksesuarDegisimi from './content/services/mentese-ray-aksesuar-degisimi.json';
import mobilyaTadilati from './content/services/mobilya-tadilati.json';
import mobilyaTamiri from './content/services/mobilya-tamiri.json';
import mutfakDolabi from './content/services/mutfak-dolabi.json';
import mutfakDolabiYenileme from './content/services/mutfak-dolabi-yenileme.json';
import ofisMobilyalari from './content/services/ofis-mobilyalari.json';
import ozelOlcuMobilya from './content/services/ozel-olcu-mobilya.json';
import sehpa from './content/services/sehpa.json';
import tvUnitesi from './content/services/tv-unitesi.json';
import yatakOdasiMobilyalari from './content/services/yatak-odasi-mobilyalari.json';
import yemekMasasi from './content/services/yemek-masasi.json';
import acikRafVeBolme from './content/projects/acik-raf-ve-bolme.json';
import ahsapMerdivenDetayi from './content/projects/ahsap-merdiven-detayi.json';
import aynaKapakliGardirop from './content/projects/ayna-kapakli-gardirop.json';
import banyoLavaboAltModulu from './content/projects/banyo-lavabo-alt-modulu.json';
import cocukOdasiCalismaUnitesi from './content/projects/cocuk-odasi-calisma-unitesi.json';
import icMekanPanelKapilar from './content/projects/ic-mekan-panel-kapilar.json';
import modernMutfakDolaplari from './content/projects/modern-mutfak-dolaplari.json';
import ozelAhsapYuvarlakMasa from './content/projects/ozel-ahsap-yuvarlak-masa.json';
import pencereOnuCalismaMasasi from './content/projects/pencere-onu-calisma-masasi.json';
import petekUstuAhsapKaplama from './content/projects/petek-ustu-ahsap-kaplama.json';
import resepsiyonBankosu from './content/projects/resepsiyon-bankosu.json';
import salonTvDuvari from './content/projects/salon-tv-duvari.json';
import yatakOdasiSabitDolap from './content/projects/yatak-odasi-sabit-dolap.json';
import ankara from './content/locations/ankara.json';
import besiktas from './content/locations/besiktas.json';
import istanbul from './content/locations/istanbul.json';
import izmir from './content/locations/izmir.json';
import kadikoy from './content/locations/kadikoy.json';
import sariyer from './content/locations/sariyer.json';
import ahsapRafSistemiPlanlama from './content/blog/ahsap-raf-sistemi-planlama.json';
import gommeDolapOlcusu from './content/blog/gomme-dolap-olcusu-nasil-planlanir.json';
import mdfLamLakeMasif from './content/blog/mdf-lam-lake-masif-hangi-durumda.json';
import mobilyaTamirYenileme from './content/blog/mobilya-tamir-mi-yenileme-mi.json';
import mutfakDolabiKarari from './content/blog/mutfak-dolabi-yenileme-mi-degisimi-mi.json';
import ozelOlcuFiyat from './content/blog/ozel-olcu-mobilya-fiyatini-belirleyen-faktorler.json';
import { importedArticles } from './content/blog/imported-50';

export type Media = { id: string; type: 'image' | 'video'; src?: string; alt: string; label: string; tone: string; caption?: string; poster?: string; serviceSlugs: string[]; locationSlugs: string[]; projectSlugs: string[] };
export type Faq = { id: string; question: string; answer: string };
export type EntitySeo = { seoTitle: string; seoDescription: string; canonical: string; faqs: Faq[]; gallery: Media[]; videos: Media[]; relatedServices: string[]; relatedLocations: string[]; relatedProjects: string[] };
export type Service = EntitySeo & { slug: string; name: string; category: string; summary: string; detail: string; bluf: string; scope: string[]; benefits: string[]; materials: string[]; process: string[]; pricingFactors: string[]; media: Media };
export type Location = EntitySeo & { slug: string; name: string; region: string; summary: string; focus: string[]; neighborhoods: string[] };
export type Project = EntitySeo & { slug: string; name: string; type: string; year: string; summary: string; materials: string[]; media: Media; challenge?: string; solution?: string; dimensions?: string; beforeImages: Media[]; afterImages: Media[]; duration?: string; result?: string; locationLabel?: string };
export type BlogPost = EntitySeo & { slug: string; title: string; category: string; date: string; readingTime: string; excerpt: string; media: Media };
export type Testimonial = { id: string; quote: string; name: string; context: string };

const media = (id: string, label: string, tone: string, alt: string): Media => ({ id, type: 'image', label, tone, alt, serviceSlugs: [], locationSlugs: [], projectSlugs: [] });
const cardImageSources: Record<string, string> = {
  'ozel-olcu-mobilya': '/media/cards/ozel-olcu.webp',
  'mutfak-dolabi': '/media/cards/d.webp',
  'mutfak-dolabi-yenileme': '/media/cards/d.webp',
  'gardrop': '/media/cards/n.webp',
  'gomme-dolap': '/media/cards/g.webp',
  'yatak-odasi-mobilyalari': '/media/cards/u.webp',
  'tv-unitesi': '/media/cards/a.webp',
  'kitaplik': '/media/cards/k.webp',
  'calisma-masasi': '/media/cards/c.webp',
  'yemek-masasi': '/media/cards/p.webp',
  'sehpa': '/media/cards/s.webp',
  'ofis-mobilyalari': '/media/cards/o.webp',
  'magaza-isletme-mobilyalari': '/media/cards/m.webp',
  'banko-resepsiyon': '/media/cards/b.webp',
  'ahsap-raf-sistemleri': '/media/cards/r.webp',
  'ahsap-kapi': '/media/cards/l.webp',
  'ahsap-merdiven': '/media/cards/merdiven.webp',
  'ahsap-bolme-dekorasyon': '/media/cards/e.webp',
  'mobilya-tamiri': '/media/cards/t.webp',
  'mobilya-tadilati': '/media/cards/tadilat.webp',
  'dolap-kapak-degisimi': '/media/cards/f.webp',
  'mentese-ray-aksesuar-degisimi': '/media/cards/h.webp',
  'hasarli-mobilya-onarimi': '/media/cards/i.webp',
  'eski-mobilya-yenileme': '/media/cards/j.webp',
};
const serviceMedia = (slug: string, name: string) => ({ ...media(slug, name, slug, name), src: cardImageSources[slug] });
// Use a shared blog note image; the uploaded image is at /public/media/blog/notlar-image.webp
const blogMedia = (slug: string, title: string) => ({ ...media(slug, title, slug, title), src: '/media/blog/notlar-image.webp' });

const serviceContent = [ozelOlcuMobilya, mutfakDolabi, mutfakDolabiYenileme, gardrop, gommeDolap, yatakOdasiMobilyalari, tvUnitesi, kitaplik, calismaMasasi, yemekMasasi, sehpa, ofisMobilyalari, magazaIsletmeMobilyalari, bankoResepsiyon, ahsapRafSistemleri, ahsapKapi, ahsapMerdiven, ahsapBolmeDekorasyon, mobilyaTamiri, mobilyaTadilati, dolapKapakDegisimi, menteseRayAksesuarDegisimi, hasarliMobilyaOnarimi, eskiMobilyaYenileme];
export const services: Service[] = serviceContent.map((item) => ({ ...item, name: item.title, summary: item.bluf, detail: item.description, media: serviceMedia(item.slug, item.title) }));

const regions: Record<string, string> = { istanbul: 'Marmara', kadikoy: 'İstanbul', besiktas: 'İstanbul', sariyer: 'İstanbul', ankara: 'İç Anadolu', izmir: 'Ege' };
const locationContent = [istanbul, kadikoy, besiktas, sariyer, ankara, izmir];
export const locations: Location[] = locationContent.map((item) => ({ ...item, name: item.title.replace(' marangoz hizmetleri', ''), region: regions[item.slug], relatedServices: item.services }));

const projectContent = [modernMutfakDolaplari, aynaKapakliGardirop, salonTvDuvari, pencereOnuCalismaMasasi, cocukOdasiCalismaUnitesi, acikRafVeBolme, ahsapMerdivenDetayi, icMekanPanelKapilar, yatakOdasiSabitDolap, banyoLavaboAltModulu, petekUstuAhsapKaplama, resepsiyonBankosu, ozelAhsapYuvarlakMasa];
export const projects: Project[] = projectContent.map((item) => item as unknown as Project);

const blogContent = [ozelOlcuFiyat, mutfakDolabiKarari, mobilyaTamirYenileme, mdfLamLakeMasif, gommeDolapOlcusu, ahsapRafSistemiPlanlama, ...importedArticles];
export const blogPosts: BlogPost[] = blogContent.map((item) => ({ ...item, media: blogMedia(item.slug, item.title) }));
export const testimonials: Testimonial[] = [];
export const faqs: Faq[] = [
  { id: 'f1', question: 'Özel üretim süreci nasıl ilerliyor?', answer: 'Kısa bir tanışma, keşif ve ölçü, tasarım ile teklif, üretim ve son olarak montaj adımlarında ilerliyoruz. Her projenin ritmi ve kapsamı farklıdır.' },
  { id: 'f2', question: 'Hangi bölgelere hizmet veriyorsunuz?', answer: 'İstanbul ve seçili yakın bölgeler için yerinde keşif planlayabiliyoruz. Diğer şehirler için proje kapsamına göre birlikte değerlendirme yapıyoruz.' },
  { id: 'f3', question: 'Kendi malzememi kullanabilir miyim?', answer: 'Malzemenin kullanım alanına uygunluğu, stabilitesi ve işlenebilirliği birlikte kontrol edildikten sonra değerlendirebiliriz.' },
  { id: 'f4', question: 'Tek bir parça için de çalışıyor musunuz?', answer: 'Evet. Bir sehpa, masa veya yatak başlığı gibi tekil parçalar da aynı dikkatle ele alınır.' },
];

export const findBySlug = <T extends { slug: string }>(items: T[], slug?: string) => items.find((item) => item.slug === slug);
export const SITE_ORIGIN = 'https://asyamobilyaahsap.com';
export const generateSitemap = (origin = SITE_ORIGIN) => [...new Set(['/', '/marangoz/', '/hakkimizda/', '/iletisim/', ...services.map((item) => item.canonical), ...locations.map((item) => item.canonical), ...projects.map((item) => item.canonical), ...blogPosts.map((item) => item.canonical)])].map((path) => `${origin}${path}`);
