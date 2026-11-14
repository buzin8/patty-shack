import { signatureBurgers } from '@/mocks/menu';
import { menuCategories, extraItemImages, extraItemCutouts } from '@/mocks/pages';

export interface MenuItemView {
  id: string;
  name: string;
  price: string;
  desc: string;
  tag: string;
  image: string;
  cutout: boolean;
}

const idAliases: Record<string, string> = {
  original: 'the-og-smash',
  'hot-one': 'kolkata-heat',
  smokehouse: 'smoke-cheddar',
  'veggie-smash': 'mushroom-smash',
  'fire-fries': 'loaded-shack-fries',
  'the-og-smash': 'the-og-smash',
  'kolkata-heat': 'kolkata-heat',
  'smoke-cheddar': 'smoke-cheddar',
  'mushroom-smash': 'mushroom-smash',
  'loaded-shack-fries': 'loaded-shack-fries',
};

export const allMenuItems: MenuItemView[] = menuCategories.flatMap((c) => c.items).map((item) => {
  const sig = signatureBurgers.find((s) => s.id === item.id || s.id === idAliases[item.id]);
  const cut = extraItemCutouts.find((e) => e.id === item.id || e.id === idAliases[item.id]);
  const extra = extraItemImages.find((e) => e.id === item.id || e.id === idAliases[item.id]);
  const image = sig?.image || cut?.image || extra?.image || '';
  return { ...item, image, cutout: Boolean(sig || cut) };
});

export const findMenuItem = (id?: string) => {
  if (!id) return undefined;
  const canonicalId = idAliases[id] || id;
  return allMenuItems.find((i) => i.id === canonicalId || i.id === id);
};
