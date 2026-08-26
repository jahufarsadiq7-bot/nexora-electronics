import { useEffect, useMemo, useState } from 'react';
import { type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Headphones,
  Menu,
  MessageCircle,
  Minus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { useGetProducts, useGetProductBySlug } from '@workspace/api-client-react';

const queryClient = new QueryClient();

type Product = {
  id: string | number;
  slug?: string;
  name: string;
  type?: string;
  category: string;
  description: string | null;
  price: string;
  image?: string;
  images?: string[];
  accent?: string;
  featured?: boolean;
};

const products: Product[] = [
  {
    id: 'arc',
    name: 'Arc One',
    type: 'Audio',
    category: 'Gadgets',
    description: 'A sculptural audio hub for rooms that deserve a quieter presence.',
    price: '₹29,999',
    image: '/nexora-hub.jpg',
    accent: '#35cddd',
    featured: true,
  },
  {
    id: 'halo',
    name: 'Halo Buds',
    type: 'Audio',
    category: 'Accessories',
    description: 'Compact wireless earbuds shaped for commutes and slow mornings.',
    price: '₹15,999',
    image: '/nexora-earbuds.jpg',
    accent: '#e18b6d',
    featured: true,
  },
  {
    id: 'beam',
    name: 'Beam Mini',
    type: 'Home',
    category: 'Gadgets',
    description: 'A small ambient speaker for desks, shelves, and bedside tables.',
    price: '₹19,999',
    accent: '#c6a75e',
  },
  {
    id: 'form',
    name: 'Form Dock',
    type: 'Workspace',
    category: 'Accessories',
    description: 'A considered charging dock for an uncluttered workspace.',
    price: '₹10,999',
    accent: '#919aaa',
  },
  {
    id: 'trace',
    name: 'Trace Tag',
    type: 'Everyday',
    category: 'Accessories',
    description: 'A pocket-sized finder for the everyday things you carry.',
    price: '₹3,999',
    accent: '#8bb8a4',
  },
  {
    id: 'pulse',
    name: 'Pulse Watch',
    type: 'Wellness',
    category: 'Gadgets',
    description: 'A pared-back wearable for staying close to your daily rhythm.',
    price: '₹23,999',
    accent: '#ab93b5',
  },
];

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const categoryItems = ['Accessories', 'Gadgets'];

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2.5" data-testid="link-logo">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#112431] text-[#42d9e8]">
        <span className="h-3 w-3 rounded-full border-2 border-current" />
      </span>
      <span className="display-font text-[17px] font-semibold tracking-[-0.04em]">nexora</span>
    </a>
  );
}

function Header({ activeSection, activeCategory, onCategorySelect }: { activeSection: string; activeCategory: string; onCategorySelect: (category: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);
  const selectCategory = (category: string) => {
    onCategorySelect(category);
    closeMenu();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#d8d3c8]/70 bg-[#f5f2ec]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              href={item.href}
              key={item.href}
              className={`nav-link text-[13px] font-medium ${activeSection === item.href.slice(1) ? 'active' : ''}`}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
            >
              {item.label}
            </a>
          ))}
          {categoryItems.map((category) => (
            <a
              href="#products"
              key={category}
              onClick={() => selectCategory(category)}
              className={`nav-link text-[13px] font-medium ${activeCategory === category ? 'active' : ''}`}
              data-testid={`link-nav-category-${category.toLowerCase().replaceAll(' ', '-')}`}
            >
              {category}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://wa.me/917299934445?text=Hello%20Nexora%2C%20I%27d%20like%20to%20talk%20about%20a%20product."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-[#39434c] transition-colors hover:bg-[#e8e5de]"
            data-testid="link-whatsapp-header"
          >
            <MessageCircle size={15} strokeWidth={1.8} />
            Talk to us
          </a>
          <a
            href="#products"
            className="button-lift flex items-center gap-2 rounded-full bg-[#112431] px-4 py-2.5 text-[12px] font-semibold text-[#f5f2ec]"
            data-testid="link-shop-header"
          >
            Explore collection <ArrowRight size={14} />
          </a>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-full bg-[#e8e5de] md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X size={19} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-[#d8d3c8] bg-[#f5f2ec] px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                href={item.href}
                key={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-[#e1ddd5] py-4 text-base font-medium"
                data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
                <ArrowDownRight size={16} className="text-[#35aab8]" />
              </a>
            ))}
            <div className="border-b border-[#e1ddd5] py-3">
              <p className="eyebrow mb-1 text-[#35aab8]">Shop by category</p>
              {categoryItems.map((category) => (
                <a
                  href="#products"
                  key={category}
                  onClick={() => selectCategory(category)}
                  className={`flex items-center justify-between py-3 text-base font-medium ${activeCategory === category ? 'text-[#188b98]' : ''}`}
                  data-testid={`link-mobile-category-${category.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {category}
                  <ArrowDownRight size={16} className="text-[#35aab8]" />
                </a>
              ))}
            </div>
          </nav>
          <a
            href="https://wa.me/917299934445?text=Hello%20Nexora"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#112431] py-3 text-sm font-semibold text-[#f5f2ec]"
            data-testid="link-whatsapp-mobile"
          >
            <MessageCircle size={16} /> Start a conversation
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="scroll-mt-nav relative overflow-hidden bg-[#112431] text-[#f5f2ec]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 18%, #42d9e8 0, transparent 30%), radial-gradient(circle at 10% 80%, #cb785f 0, transparent 25%)' }} />
      <div className="grid-line absolute inset-0 opacity-[.08]" />
      <div className="relative mx-auto grid min-h-[710px] max-w-[1280px] items-center gap-8 px-5 pb-20 pt-36 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-24 lg:pt-40">
        <div className="max-w-[680px]">
          <div className="reveal mb-7 flex items-center gap-3 text-[#70e3eb]">
            <span className="h-px w-9 bg-[#42d9e8]" />
            <span className="eyebrow">Modern Electronics &amp; Smart Technology</span>
          </div>
          <h1 className="display-font reveal reveal-delay-1 max-w-[700px] text-[clamp(3.6rem,8vw,7.75rem)] font-medium leading-[.9] tracking-[-.085em]">
            Technology,<br /><span className="text-[#42d9e8]">considered.</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-8 max-w-[420px] text-[15px] leading-7 text-[#bbc9cc]">
            Nexora makes quietly powerful devices for the way you actually live. Fewer compromises. Better mornings.
          </p>
          <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-4">
            <a href="#products" className="button-lift inline-flex items-center gap-3 rounded-full bg-[#42d9e8] px-5 py-3.5 text-[13px] font-bold text-[#112431]" data-testid="link-hero-products">
              See the collection <ArrowRight size={16} />
            </a>
            <a href="#about" className="inline-flex items-center gap-2 px-3 py-3 text-[13px] font-semibold text-[#d6e0df] hover:text-[#42d9e8]" data-testid="link-hero-about">
              Why Nexora <ArrowDownRight size={15} />
            </a>
          </div>
        </div>
        <div className="relative mx-auto mt-10 h-[330px] w-full max-w-[510px] lg:mt-0 lg:h-[480px]">
          <div className="absolute left-[12%] top-[11%] h-[74%] w-[74%] rounded-full border border-[#42d9e8]/30" />
          <div className="absolute left-[21%] top-[20%] h-[56%] w-[56%] rounded-full border border-[#42d9e8]/20" />
          <div className="absolute left-[29%] top-[28%] h-[40%] w-[40%] rounded-full bg-[#42d9e8]/10 blur-[2px]" />
          <div className="absolute bottom-[13%] left-[4%] right-[4%] h-8 rounded-[50%] bg-[#050e14]/70 blur-xl" />
          <div className="product-visual absolute left-[17%] top-[25%] h-[48%] w-[66%] rotate-[-8deg] rounded-[42px] border border-white/20 bg-gradient-to-br from-[#566874] via-[#1e313d] to-[#0a151d] shadow-[22px_35px_45px_rgba(0,0,0,.42)]">
            <div className="absolute inset-x-[12%] top-[13%] h-px bg-white/20" />
            <div className="absolute right-[12%] top-[12%] h-2 w-2 rounded-full bg-[#42d9e8] shadow-[0_0_18px_#42d9e8]" />
            <div className="absolute bottom-[14%] left-[12%] flex items-center gap-2 text-[9px] tracking-[.22em] text-white/50"><span className="h-1.5 w-1.5 rounded-full bg-[#d68c72]" /> NEXORA / ARC</div>
          </div>
          <div className="absolute bottom-[17%] right-[4%] rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] tracking-[.15em] text-white/65 backdrop-blur-md">ARC ONE · 01</div>
          <div className="absolute left-[3%] top-[32%] h-1.5 w-1.5 rounded-full bg-[#d68c72]" />
          <div className="absolute right-[10%] top-[8%] h-1.5 w-1.5 rounded-full bg-[#42d9e8]" />
        </div>
      </div>
      <div className="absolute bottom-6 left-5 flex items-center gap-3 text-[10px] tracking-[.16em] text-[#81969b] sm:left-8 lg:left-12">
        <span className="h-px w-8 bg-[#81969b]" /> SCROLL TO EXPLORE
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-b border-[#d8d3c8] bg-[#e8e5de]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-5 px-5 py-6 sm:px-8 lg:px-12">
        <p className="eyebrow text-[#6a7477]">Designed in San Francisco · tuned for real life</p>
        <div className="flex items-center gap-6 text-[12px] text-[#4d5a5e] sm:gap-10">
          <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#35aab8]" /> 2 year care</span>
          <span className="flex items-center gap-2"><Zap size={15} className="text-[#d27b60]" /> Free shipping</span>
          <span className="hidden items-center gap-2 sm:flex"><Headphones size={15} className="text-[#35aab8]" /> Human support</span>
        </div>
      </div>
    </section>
  );
}

function ProductArtwork({ product }: { product: Product }) {
  if (product.image) {
    return <img src={product.image} alt={`${product.name} product`} className="product-visual h-full w-full object-cover" data-testid={`img-product-${product.id}`} />;
  }
  return (
    <div className="product-visual relative h-full w-full overflow-hidden" style={{ background: `radial-gradient(circle at 66% 35%, ${product.accent}55, transparent 24%), linear-gradient(135deg, #202d38, #111b23)` }}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(125deg, transparent 46%, rgba(255,255,255,.45) 47%, transparent 49%)' }} />
      <div className={`absolute border border-white/25 bg-gradient-to-br from-[#81909a] via-[#293944] to-[#111b23] shadow-2xl ${product.type === 'Home' ? 'left-[20%] top-[27%] h-[42%] w-[60%] rounded-[24px]' : product.type === 'Workspace' ? 'left-[18%] top-[33%] h-[28%] w-[64%] rounded-[10px]' : product.type === 'Everyday' ? 'left-[29%] top-[27%] h-[44%] w-[42%] rounded-full' : 'left-[30%] top-[22%] h-[53%] w-[40%] rounded-[30px]'}`}>
        <span className="absolute right-[16%] top-[15%] h-2 w-2 rounded-full" style={{ backgroundColor: product.accent }} />
        <span className="absolute bottom-[14%] left-[15%] text-[8px] tracking-[.2em] text-white/50">NEXORA</span>
      </div>
      <span className="absolute bottom-4 left-5 text-[10px] tracking-[.18em] text-white/40">OBJECT / {String(product.id).toUpperCase()}</span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card group overflow-hidden rounded-[22px] border border-[#d8d3c8] bg-[#f9f7f3] transition-shadow duration-500 hover:shadow-[0_22px_45px_rgba(17,36,49,.12)]" data-testid={`card-product-${product.id}`}>
      <div className="relative h-[285px] overflow-hidden bg-[#1d2a34]">
        <ProductArtwork product={product} />
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span className="rounded-full bg-[#f5f2ec]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#34434a]">{product.type}</span>
          {product.featured && <span className="rounded-full bg-[#42d9e8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#112431]">Featured</span>}
        </div>
        <button className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-[#f5f2ec] text-[#112431] opacity-0 transition-opacity group-hover:opacity-100" aria-label={`View ${product.name}`} onClick={() => { window.location.href = `/products/${product.slug}`; }} data-testid={`button-view-${product.id}`}>
          <ArrowUpRightIcon />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="display-font text-[21px] font-semibold tracking-[-.04em]">{product.name}</h3>
            <p className="mt-1 text-[13px] text-[#6d7577]">{product.description}</p>
          </div>
          <span className="display-font text-[14px] font-semibold">{product.price}</span>
        </div>
        <div className="mt-5">
          <span className="rounded-full bg-[#ebe8e2] px-2.5 py-1 text-[10px] text-[#687174]">Fictional concept product</span>
        </div>
      </div>
    </article>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight size={16} className="-rotate-45" />;
}

function Products({ activeCategory, onCategorySelect }: { activeCategory: string; onCategorySelect: (category: string) => void }) {
  const [query, setQuery] = useState('');
  const { data: rawApiProducts = [] } = useGetProducts();
  const apiProducts: Product[] = rawApiProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    type: product.category,
    category: product.category,
    description: product.description ?? '',
    price: product.price,
    image: product.images[0],
    accent: '#35cddd',
  }));
  const categoryFilters = ['All', ...categoryItems];
  const visibleProducts = useMemo(() => apiProducts.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesQuery = `${product.name} ${product.description ?? ""} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [activeCategory, query]);

  return (
    <section id="products" className="scroll-mt-nav bg-[#f5f2ec] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col justify-between gap-9 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-[#35aab8]">The collection / 01</p>
            <h2 className="display-font mt-4 max-w-[610px] text-[clamp(2.7rem,6vw,5.2rem)] font-medium leading-[.95] tracking-[-.075em]">Objects with a point of view.</h2>
          </div>
          <p className="max-w-[280px] text-sm leading-6 text-[#6d7577]">Every Nexora product starts with a question: what can we make feel simpler?</p>
        </div>
        <div className="mt-12 border-y border-[#d8d3c8] py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Main product categories">
              <span className="eyebrow mr-2 text-[#6d7577]">Shop by category</span>
              {categoryFilters.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategorySelect(category)}
                  className={`rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${activeCategory === category ? 'bg-[#112431] text-[#f5f2ec]' : 'text-[#6d7577] hover:bg-[#e8e5de]'}`}
                  data-testid={`button-category-${category.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 border-b border-[#bdbab2] pb-2 text-[#6d7577] sm:w-[190px]">
                <Search size={15} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-[12px] text-[#112431] outline-none placeholder:text-[#8b918f]" placeholder="Search collection" aria-label="Search collection" data-testid="input-product-search" />
              </label>
            </div>
        </div>
        </div>
        {visibleProducts.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        ) : (
          <div className="mt-8 flex min-h-[260px] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#c8c3b8] bg-[#efede8] px-6 text-center" data-testid="empty-product-results">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#dfe9e7] text-[#35aab8]"><Search size={20} /></div>
            <h3 className="display-font text-xl font-semibold">Nothing in that frequency.</h3>
            <p className="mt-2 max-w-sm text-sm text-[#737b7a]">Try a different search or reset the collection filters.</p>
            <button onClick={() => { setQuery(''); onCategorySelect('All'); }} className="mt-5 text-xs font-bold text-[#188b98] underline underline-offset-4" data-testid="button-reset-products">Reset filters</button>
          </div>
        )}
        <div className="mt-10 flex items-center justify-between border-t border-[#d8d3c8] pt-5 text-[11px] text-[#737b7a]">
          <span>{visibleProducts.length} of {products.length} fictional objects</span>
          <span className="hidden items-center gap-2 sm:flex"><Sparkles size={14} className="text-[#d27b60]" /> New shapes arrive seasonally</span>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-nav bg-[#e8e5de]">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[.86fr_1.14fr] lg:gap-24 lg:px-12 lg:py-32">
        <div>
          <p className="eyebrow text-[#d27b60]">The Nexora standard / 02</p>
          <h2 className="display-font mt-4 text-[clamp(2.6rem,5vw,4.5rem)] font-medium leading-[.96] tracking-[-.075em]">Make room for<br /><span className="text-[#35aab8]">better.</span></h2>
          <p className="mt-8 max-w-[360px] text-[15px] leading-7 text-[#626b6b]">We believe the best technology is felt before it is noticed. It earns its place through restraint, clarity, and an almost unreasonable attention to the everyday.</p>
          <a href="#contact" className="mt-8 inline-flex items-center gap-3 text-[13px] font-bold text-[#112431] underline decoration-[#35aab8] decoration-2 underline-offset-8" data-testid="link-about-contact">Work with our studio <ArrowRight size={15} /></a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[22px] bg-[#112431] p-7 text-[#f5f2ec] sm:row-span-2 sm:flex sm:flex-col sm:justify-between">
            <div className="flex items-center justify-between"><span className="eyebrow text-[#72dce5]">01 — Clarity</span><Minus size={17} className="text-[#72dce5]" /></div>
            <div className="mt-14 sm:mt-0"><p className="display-font text-5xl tracking-[-.08em] text-[#42d9e8]">47.2</p><p className="mt-2 max-w-[200px] text-sm leading-6 text-[#aebfc2]">hours of prototyping before the first line of code ships.</p></div>
          </div>
          <div className="rounded-[22px] border border-[#c9c5bc] bg-[#f4f1eb] p-7">
            <span className="eyebrow text-[#d27b60]">02 — Longevity</span>
            <p className="mt-12 text-[15px] leading-6 text-[#626b6b]">Materials chosen to age with grace, not date with fashion.</p>
          </div>
          <div className="rounded-[22px] border border-[#c9c5bc] bg-[#f4f1eb] p-7">
            <span className="eyebrow text-[#35aab8]">03 — Warmth</span>
            <p className="mt-12 text-[15px] leading-6 text-[#626b6b]">Technology should invite you in, not ask you to learn a new language.</p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden border-y border-[#cbc6bc] bg-[#d8d4cc]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-5 py-5 sm:px-8 lg:px-12">
          <p className="display-font whitespace-nowrap text-[clamp(1.7rem,4vw,3.6rem)] font-medium tracking-[-.07em] text-[#465355]">No noise. No shortcuts. Just useful wonder.</p>
          <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-[#687475] sm:grid"><ArrowDownRight size={18} /></span>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const update = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="scroll-mt-nav bg-[#112431] text-[#f5f2ec]">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24 lg:px-12 lg:py-32">
        <div>
          <p className="eyebrow text-[#42d9e8]">Open channel / 03</p>
          <h2 className="display-font mt-5 max-w-[470px] text-[clamp(3rem,6vw,5.5rem)] font-medium leading-[.9] tracking-[-.08em]">Let’s talk about what’s next.</h2>
          <p className="mt-7 max-w-[350px] text-sm leading-7 text-[#adc1c3]">Questions about a product, a partnership, or an idea that is still taking shape? We’re listening.</p>
          <div className="mt-10 space-y-4 text-sm text-[#d8e2e0]">
            <a href="mailto:jahufarsadiq7@gmail.com" className="flex items-center gap-3 hover:text-[#42d9e8]" data-testid="link-email-contact"><Send size={16} className="text-[#42d9e8]" /> jahufarsadiq7@gmail.com</a>
            <a href="https://wa.me/917299934445?text=Hello%20Nexora%2C%20I%27d%20like%20to%20talk." target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#42d9e8]" data-testid="link-whatsapp-contact"><MessageCircle size={16} className="text-[#42d9e8]" /> WhatsApp / +91 7299934445</a>
          </div>
        </div>
        <div className="rounded-[24px] bg-[#f5f2ec] p-6 text-[#112431] sm:p-8">
          {submitted ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center text-center" data-testid="status-contact-success">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#d8f4ef] text-[#148b90]"><Check size={24} /></div>
              <h3 className="display-font mt-6 text-2xl font-semibold tracking-[-.04em]">Message received.</h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[#6b7576]">Thanks, {form.name.split(' ')[0] || 'there'}. A real person from the studio will be in touch shortly.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }} className="mt-8 text-xs font-bold text-[#148b90] underline underline-offset-4" data-testid="button-send-another">Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="contact-name" className="eyebrow text-[#778181]">Your name</label>
                <input id="contact-name" value={form.name} onChange={update('name')} required className="mt-2 w-full border-b border-[#c8c4ba] bg-transparent py-2.5 text-[15px] outline-none transition-colors placeholder:text-[#a9aeaa] focus:border-[#35aab8]" placeholder="How should we address you?" data-testid="input-contact-name" />
              </div>
              <div>
                <label htmlFor="contact-email" className="eyebrow text-[#778181]">Email address</label>
                <input id="contact-email" type="email" value={form.email} onChange={update('email')} required className="mt-2 w-full border-b border-[#c8c4ba] bg-transparent py-2.5 text-[15px] outline-none transition-colors placeholder:text-[#a9aeaa] focus:border-[#35aab8]" placeholder="you@somewhere.com" data-testid="input-contact-email" />
              </div>
              <div>
                <label htmlFor="contact-message" className="eyebrow text-[#778181]">The good stuff</label>
                <textarea id="contact-message" value={form.message} onChange={update('message')} required rows={4} className="mt-2 w-full resize-none border-b border-[#c8c4ba] bg-transparent py-2.5 text-[15px] outline-none transition-colors placeholder:text-[#a9aeaa] focus:border-[#35aab8]" placeholder="Tell us what you’re thinking..." data-testid="input-contact-message" />
              </div>
              <button type="submit" className="button-lift flex w-full items-center justify-center gap-3 rounded-full bg-[#112431] py-3.5 text-[13px] font-bold text-[#f5f2ec]" data-testid="button-submit-contact">Send to the studio <ArrowRight size={16} /></button>
              <p className="text-center text-[10px] text-[#899290]">No mailing lists. No auto-replies. Just a thoughtful response.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#112431] px-5 pb-8 text-[#f5f2ec] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1280px] border-t border-[#37515a] pt-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <Logo />
          <p className="text-[11px] text-[#82999d]">Considered technology for everyday life.</p>
          <div className="flex gap-5 text-[11px] text-[#82999d]"><a href="#home" className="hover:text-[#42d9e8]" data-testid="link-footer-home">Back to top</a><span>© 2026 Nexora Electronics</span></div>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const selectCategory = (category: string) => {
    setActiveCategory(category);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    const sections = navItems.map(({ href }) => document.querySelector(href)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.3, 0.6] });
    sections.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="noise min-h-[100dvh] overflow-x-hidden">
      <Header activeSection={activeSection} activeCategory={activeCategory} onCategorySelect={selectCategory} />
      <main>
        <Hero />
        <TrustStrip />
        <Products activeCategory={activeCategory} onCategorySelect={selectCategory} />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function ProductDetail({ slug }: { slug: string }) {
  const { data: product, isLoading, isError } = useGetProductBySlug(slug);

  if (isLoading) {
    return (
      <div className="noise min-h-[100dvh] bg-[#f5f2ec] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <a href="/" className="text-sm font-semibold text-[#188b98]">
            ← Back to collection
          </a>
          <div className="mt-16">
            <p className="text-sm text-[#737b7a]">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="noise min-h-[100dvh] bg-[#f5f2ec] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <a href="/" className="text-sm font-semibold text-[#188b98]">
            ← Back to collection
          </a>
          <div className="mt-16">
            <h1 className="display-font text-4xl font-semibold">
              Product not found
            </h1>
            <p className="mt-3 text-sm text-[#737b7a]">
              The product you requested is unavailable.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="noise min-h-[100dvh] overflow-x-hidden bg-[#f5f2ec] text-[#112431]">
      <main className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-12">
        <a href="/" className="text-sm font-semibold text-[#188b98]">
          ← Back to collection
        </a>

        <section className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#1d2a34]">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full min-h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center">
                <span className="text-xs font-bold tracking-[.2em] text-white/40">
                  NEXORA / {product.slug.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div>
            <span className="rounded-full bg-[#ebe8e2] px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#687174]">
              {product.category}
            </span>

            <h1 className="display-font mt-5 text-5xl font-semibold tracking-[-.05em] sm:text-6xl">
              {product.name}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#6d7577]">
              {product.description}
            </p>

            <div className="mt-8 flex items-center gap-5">
              <span className="display-font text-2xl font-semibold">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              {product.compareAtPrice && (
                <span className="text-sm text-[#8b918f] line-through">
                  ₹{Number(product.compareAtPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <div className="mt-8 border-t border-[#d8d3c8] pt-6 text-sm text-[#687174]">
              <p>Stock available: {product.stock}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products/:slug" component={({ params }) => <ProductDetail slug={params.slug} />} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;