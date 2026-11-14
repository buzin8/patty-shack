import { Link, useParams } from 'react-router-dom';
import PageShell from '@/components/feature/PageShell';
import { itemDetails, menuCategories } from '@/mocks/pages';
import { findMenuItem } from '@/pages/menu/menuData';
import ItemImage from '@/pages/menu/components/ItemImage';
import NotFound from '@/pages/NotFound';

export default function MenuDetailPage() {
  const { id } = useParams();
  const item = findMenuItem(id);
  const detail = itemDetails.find((d) => d.id === id);
  if (!item || !detail) return <NotFound />;
  const category = menuCategories.find((c) => c.items.some((x) => x.id === id));
  const others = (category?.items || [])
    .filter((x) => x.id !== id)
    .slice(0, 3)
    .map((x) => findMenuItem(x.id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <PageShell title={`${item.name} | Patty Shack Menu`}>
      <section className="wrap py-10 md:py-16">
        <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-bold mb-8 cursor-pointer hover:text-accent-500 whitespace-nowrap">
          <i className="ri-arrow-left-line" /> Back to menu
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ItemImage item={item} split="split-v2" className="lg:col-span-7 poster-frame hard-drop aspect-square" />
          <div className="lg:col-span-5">
            <span className="sticker bg-accent-500 text-background-50 tilt-l">{item.tag || category?.label}</span>
            <h1 className="h-statement mt-6">{item.name}</h1>
            <p className="mt-5 text-base md:text-lg leading-[1.7] text-foreground-800">{item.desc}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="display text-[28px] rounded-full bg-foreground-950 text-background-50 px-5 py-2">{item.price}</span>
              <span className="sticker !text-[14px] bg-primary-100 text-primary-900">{detail.kcal} kcal</span>
              <span className="sticker !text-[14px] bg-background-100 text-foreground-950 inline-flex items-center gap-1">
                heat
                {[1, 2, 3].map((n) => (
                  <i key={n} className={`ri-fire-fill ${n <= detail.heat ? 'text-accent-500' : 'text-foreground-300'}`} />
                ))}
              </span>
            </div>
            <h2 className="eyebrow mt-10 mb-3">How it&apos;s built</h2>
            <ol className="text-[15px]">
              {detail.build.map((b, i) => (
                <li key={b} className="grid grid-cols-[48px_1fr] items-center h-12 border-t-2 border-dashed border-foreground-300">
                  <span className="hand text-accent-500">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ol>
            <h2 className="eyebrow mt-8 mb-3">Allergens</h2>
            <div className="flex flex-wrap gap-2">
              {detail.allergens.length ? detail.allergens.map((a) => (
                <span key={a} className="rounded-full border-2 border-foreground-950 px-3 py-1 text-xs font-semibold">{a}</span>
              )) : <span className="text-sm text-foreground-700">None of the major allergens</span>}
            </div>
            <Link to="/locations" className="mt-10 btn-poster btn-berry">
              Find the counter <i className="ri-map-pin-line" />
            </Link>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-background-100 border-t-[2.5px] border-foreground-950 wrap py-14 md:py-20">
          <h2 className="h-section mb-10">More {category?.label}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {others.map((o, i) => (
              <Link key={o.id} to={`/menu/${o.id}`} className="group block poster-card hard-drop cursor-pointer transition-transform hover:-translate-y-1">
                <ItemImage item={o} split={`split-v${i + 3}`} className="aspect-[4/3] border-b-[2.5px] border-foreground-950" />
                <div className="p-5 flex items-center justify-between gap-3">
                  <h3 className="h-card">{o.name}</h3>
                  <span className="display text-[18px]">{o.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}