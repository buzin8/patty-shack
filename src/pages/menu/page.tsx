import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/feature/PageShell';
import PageHero from '@/components/feature/PageHero';
import { menuCategories } from '@/mocks/pages';
import { findMenuItem } from '@/pages/menu/menuData';
import ItemImage from '@/pages/menu/components/ItemImage';

const splits = ['split-v1', 'split-v2', 'split-v3', 'split-v4', 'split-v5', 'split-v6'];

export default function MenuPage() {
  const [active, setActive] = useState('all');
  const shown = active === 'all' ? menuCategories : menuCategories.filter((c) => c.id === active);

  return (
    <PageShell title="Patty Shack Menu | Smash Burgers, Grill, Fries & Shakes">
      <PageHero
        sticker="the menu"
        title={<>Short menu.<br />Big <span className="text-accent-500">flavour.</span></>}
        intro={<>Everything we cook, in one place. Pick a category, <span className="hand text-accent-500 text-xl">come hungry.</span></>}
      />

      <section className="wrap py-14 md:py-20">
        <div className="flex flex-wrap gap-2 mb-12">
          {[{ id: 'all', label: 'All' }, ...menuCategories].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`display text-[15px] px-5 py-2.5 rounded-full border-[2.5px] border-foreground-950 whitespace-nowrap cursor-pointer transition-colors ${active === c.id ? 'bg-foreground-950 text-background-50' : 'bg-background-50 hover:bg-primary-500'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {shown.map((cat) => (
          <div key={cat.id} id={cat.id} className="mb-16 last:mb-0">
            <div data-m="up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-5 mb-8 dash-line pt-6">
              <h2 className="h-section">{cat.label}</h2>
              <p className="hand text-lg text-foreground-700">{cat.note}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {cat.items.map((raw, i) => {
                const item = findMenuItem(raw.id);
                if (!item) return null;
                return (
                  <Link key={item.id} to={`/menu/${item.id}`} data-m="up" data-m-delay={String((i % 3) * 90 + 120)} className="group block cursor-pointer">
                    <div className="h-full poster-card hard-drop transition-transform duration-300 group-hover:-translate-y-1">
                      <ItemImage item={item} split={splits[i % 6]} className="aspect-[4/3] w-full border-b-[2.5px] border-foreground-950" />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="h-card">{item.name}</h3>
                          <span className="display text-[20px] rounded-full bg-foreground-950 text-background-50 px-3 py-1.5 whitespace-nowrap">{item.price}</span>
                        </div>
                        <p className="mt-3 text-sm leading-[1.6] text-foreground-700">{item.desc}</p>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          {item.tag ? <span className="sticker !text-[13px] !py-1.5 bg-accent-100 text-accent-900">{item.tag}</span> : <span />}
                          <span className="m-arrow text-sm font-bold whitespace-nowrap inline-flex items-center gap-1"><span className="m-link-line">Details</span> <i className="ri-arrow-right-up-line" /></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}