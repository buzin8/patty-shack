import type { MenuItemView } from '@/pages/menu/menuData';

interface ItemImageProps {
  item: MenuItemView;
  split: string;
  className?: string;
}

export default function ItemImage({ item, split, className = '' }: ItemImageProps) {
  if (!item.cutout) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={item.image}
          alt={`${item.name} at Patty Shack`}
          title={`${item.name} — Patty Shack menu`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }
  return (
    <div className={`split-rays ${split} relative overflow-hidden p-[6%] ${className}`}>
      <img
        src={item.image}
        alt={`${item.name} at Patty Shack`}
        title={`${item.name} — Patty Shack menu`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain object-center drop-shadow-[0_10px_8px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}
