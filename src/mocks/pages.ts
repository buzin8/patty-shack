export const menuCategories = [
  {
    id: 'burgers',
    label: 'Burgers',
    note: 'Smashed thin, crusted hard, stacked double with Amul cheese.',
    items: [
      { id: 'the-og-smash', name: 'The OG Smash', price: '₹249', desc: 'Double smash patty, melted Amul cheese, pickles, Shack sauce.', tag: 'best seller' },
      { id: 'kolkata-heat', name: 'Kolkata Heat', price: '₹279', desc: 'Charred green chilies, pepper jack, hot honey glaze, chili mayo.', tag: 'spicy!' },
      { id: 'smoke-cheddar', name: 'Smoke & Cheddar', price: '₹299', desc: 'Smoked bacon, caramelized onions, sharp cheddar, Amul cheese melt, BBQ glaze.', tag: 'chef pick' },
      { id: 'single-smash', name: 'Single Smash', price: '₹199', desc: 'One patty, melted Amul cheese, pickles, onion, yellow mustard.', tag: 'classic' },
      { id: 'mushroom-smash', name: 'Mushroom Smash', price: '₹229', desc: 'Pan-seared mushroom & black bean patty, smoked cheddar, purple slaw, Shack sauce.', tag: 'veg' },
    ],
  },
  {
    id: 'grill',
    label: 'From the Grill',
    note: 'Over open charcoal, finished with fire.',
    items: [
      { id: 'chicken-thighs', name: 'Charcoal Chicken Thighs', price: '₹289', desc: 'Buttermilk-brined thighs, lemon sea salt, garlic aioli dip.', tag: '' },
      { id: 'sausage-dog', name: 'Grilled Sausage Dog', price: '₹239', desc: 'Grilled spiced pork & fennel sausage, burnt onions, yellow mustard.', tag: '' },
      { id: 'flame-corn', name: 'Flame Corn', price: '₹149', desc: 'Blistered sweet corn cob, chili butter, lime, cotija.', tag: '' },
    ],
  },
  {
    id: 'sides',
    label: 'Sides & Drinks',
    note: 'Crunchy, salty, cold — the supporting cast.',
    items: [
      { id: 'fries', name: 'Fries', price: '₹129', desc: 'Skin-on potato fries, twice cooked, flaky sea salt.', tag: '' },
      { id: 'loaded-shack-fries', name: 'Loaded Shack Fries', price: '₹199', desc: 'Twice-cooked fries, warm cheese sauce, Shack sauce, pickled jalapeños.', tag: 'share it' },
      { id: 'vanilla-shake', name: 'Vanilla Bean Shake', price: '₹179', desc: 'Thick vanilla bean soft-serve, fresh whipped cream, a cherry on top.', tag: 'cool down' },
      { id: 'lemonade', name: 'House Lemonade', price: '₹99', desc: 'Fresh-squeezed lemons, cane sugar, a pinch of black salt, chilled soda.', tag: '' },
    ],
  },
];

export const itemDetails = [
  { id: 'the-og-smash', kcal: '740', heat: 1, allergens: ['Gluten', 'Dairy', 'Egg', 'Mustard'], build: ['Toasted brioche', 'Shack sauce', 'Pickles & diced onion', 'Amul cheese', 'Two smashed chicken patties'] },
  { id: 'kolkata-heat', kcal: '780', heat: 3, allergens: ['Gluten', 'Dairy', 'Egg'], build: ['Toasted brioche', 'Chili mayo', 'Charred green chilies', 'Pepper jack & Amul cheese', 'Two smashed chicken patties', 'Hot honey glaze'] },
  { id: 'smoke-cheddar', kcal: '880', heat: 1, allergens: ['Gluten', 'Dairy', 'Mustard'], build: ['Toasted brioche', 'BBQ glaze', 'Smoked bacon', 'Caramelized onion', 'Sharp cheddar & Amul cheese', 'Two smashed patties'] },
  { id: 'single-smash', kcal: '480', heat: 0, allergens: ['Gluten', 'Dairy', 'Mustard'], build: ['Toasted brioche', 'Yellow mustard', 'Pickles & diced onion', 'Amul cheese', 'One smashed chicken patty'] },
  { id: 'mushroom-smash', kcal: '620', heat: 1, allergens: ['Gluten', 'Dairy', 'Soy'], build: ['Toasted brioche', 'Shack sauce', 'Mushroom & black bean patty', 'Smoked cheddar & Amul cheese', 'Crunchy purple slaw'] },
  { id: 'chicken-thighs', kcal: '560', heat: 1, allergens: ['Dairy', 'Egg'], build: ['Buttermilk-brined thighs', 'Open charcoal grill', 'Lemon sea salt', 'Garlic dip'] },
  { id: 'sausage-dog', kcal: '610', heat: 0, allergens: ['Gluten', 'Mustard'], build: ['Toasted brioche bun', 'Grilled sausage', 'Burnt griddled onions', 'Yellow mustard'] },
  { id: 'flame-corn', kcal: '290', heat: 2, allergens: ['Dairy'], build: ['Flame-blistered corn', 'Chili butter', 'Cotija cheese', 'Fresh lime'] },
  { id: 'fries', kcal: '380', heat: 0, allergens: [], build: ['Skin-on potatoes', 'Twice cooked', 'Flaky sea salt'] },
  { id: 'loaded-shack-fries', kcal: '690', heat: 2, allergens: ['Dairy'], build: ['Twice-cooked fries', 'Warm cheese sauce', 'Shack sauce', 'Chili flakes', 'Pickled jalapeños'] },
  { id: 'vanilla-shake', kcal: '620', heat: 0, allergens: ['Dairy'], build: ['Vanilla bean soft-serve', 'Full cream milk', 'Whipped cream', 'Cherry'] },
  { id: 'lemonade', kcal: '140', heat: 0, allergens: [], build: ['Fresh lemons', 'Cane sugar', 'Black salt', 'Soda & Ice'] },
];

export const extraItemImages = [
  { id: 'the-og-smash', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_88f3ac66.webp' },
  { id: 'kolkata-heat', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_4499711d.webp' },
  { id: 'smoke-cheddar', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_7290e6fe.webp' },
  { id: 'single-smash', image: 'https://readdy.ai/api/search-image?query=Single%20smash%20burger%20with%20one%20crispy%20lacy%20beef%20patty%2C%20melted%20American%20cheese%2C%20pickles%20and%20diced%20onion%20on%20a%20glossy%20brioche%20bun%2C%20centered%20studio%20product%20shot%20on%20a%20plain%20warm%20cream%20seamless%20background%2C%20soft%20even%20light&width=900&height=900&seq=fc-item-single-smash&orientation=squarish' },
  { id: 'mushroom-smash', image: 'https://readdy.ai/api/search-image?query=Veggie%20smash%20burger%20with%20dark%20black%20bean%20mushroom%20patty%2C%20smoked%20cheddar%20and%20purple%20cabbage%20slaw%20on%20a%20toasted%20brioche%20bun%2C%20centered%20studio%20product%20shot%20on%20a%20plain%20warm%20cream%20seamless%20background%2C%20soft%20even%20light&width=900&height=900&seq=fc-item-veggie-smash&orientation=squarish' },
  { id: 'chicken-thighs', image: 'https://readdy.ai/api/search-image?query=Charcoal%20grilled%20chicken%20thighs%20with%20charred%20golden%20skin%2C%20lemon%20wedge%20and%20small%20garlic%20dip%20on%20a%20paper%20lined%20tray%2C%20centered%20studio%20product%20shot%20on%20a%20plain%20warm%20cream%20seamless%20background%2C%20soft%20even%20light&width=900&height=900&seq=fc-item-chicken-thighs&orientation=squarish' },
  { id: 'sausage-dog', image: 'https://readdy.ai/api/search-image?query=Grilled%20pork%20fennel%20sausage%20hot%20dog%20in%20a%20toasted%20bun%20with%20burnt%20onions%20and%20a%20zigzag%20of%20yellow%20mustard%2C%20centered%20studio%20product%20shot%20on%20a%20plain%20warm%20cream%20seamless%20background%2C%20soft%20even%20light&width=900&height=900&seq=fc-item-sausage-dog&orientation=squarish' },
  { id: 'flame-corn', image: 'https://readdy.ai/api/search-image?query=Blistered%20flame%20grilled%20corn%20on%20the%20cob%20brushed%20with%20red%20chili%20butter%2C%20crumbled%20cotija%20cheese%20and%20lime%20wedge%2C%20centered%20studio%20product%20shot%20on%20a%20plain%20warm%20cream%20seamless%20background%2C%20soft%20even%20light&width=900&height=900&seq=fc-item-flame-corn&orientation=squarish' },
  { id: 'fries', image: 'https://readdy.ai/api/search-image?query=Golden%20skin%20on%20french%20fries%20with%20flaky%20sea%20salt%20spilling%20from%20a%20red%20and%20white%20paper%20cup%2C%20centered%20studio%20product%20shot%20on%20a%20plain%20warm%20cream%20seamless%20background%2C%20soft%20even%20light&width=900&height=900&seq=fc-item-fries&orientation=squarish' },
  { id: 'loaded-shack-fries', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_445507e6.webp' },
  { id: 'vanilla-shake', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_5b001805.webp' },
  { id: 'lemonade', image: 'https://readdy.ai/api/search-image?query=Tall%20glass%20of%20fresh%20cloudy%20house%20lemonade%20with%20ice%20cubes%2C%20lemon%20slice%20and%20striped%20paper%20straw%2C%20condensation%20droplets%2C%20centered%20studio%20product%20shot%20on%20a%20plain%20warm%20cream%20seamless%20background%2C%20soft%20even%20light&width=900&height=900&seq=fc-item-lemonade&orientation=squarish' },
];

export const extraItemCutouts = [
  { id: 'the-og-smash', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_88f3ac66.webp' },
  { id: 'kolkata-heat', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_4499711d.webp' },
  { id: 'smoke-cheddar', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_7290e6fe.webp' },
  { id: 'single-smash', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_0bd21835.webp' },
  { id: 'mushroom-smash', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_91c4285c.webp' },
  { id: 'chicken-thighs', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_6de7da99.webp' },
  { id: 'sausage-dog', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_b56c4f24.webp' },
  { id: 'flame-corn', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_4cab13a2.webp' },
  { id: 'fries', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_33598b04.webp' },
  { id: 'loaded-shack-fries', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_445507e6.webp' },
  { id: 'vanilla-shake', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_5b001805.webp' },
  { id: 'lemonade', image: 'https://public.readdy.ai/ai/img_res/sandbox/46b3cb2df3e9774c2f64255192a14470/0ba43c55-3dd5-4419-bd54-30933f4086f0_82ce2950.webp' },
];

export const locationPageImages = [
  { id: 'salt-lake', image: '/images/patty_shack.jpg' },
];

export const aboutValues = [
  { no: '01', title: 'Fresh, never frozen', body: 'Fresh chicken ground and seasoned every morning. When the counter sells out, that is it for the day.' },
  { no: '02', title: 'Hot steel, open flame', body: 'Smashed on 260°C steel for lacy caramelized crust, kissed over charcoal for deep wood smoke.' },
  { no: '03', title: 'Short menu, done right', body: 'We would rather nail our signature burgers and fries than offer forty mediocre plates.' },
];

export const aboutTimeline = [
  { year: '2024', text: 'A small weekend pop-up grill in Kolkata. Sold out within two hours every single evening.' },
  { year: '2025', text: 'Dialed in the smash technique and locked down the signature Shack sauce recipe.' },
  { year: '2026', text: 'Patty Shack opens its permanent counter at Infinity Benchmark, Ground Floor, near RDB Cinema in Sector V, Kolkata.' },
];

export const contactInfo = [
  { icon: 'ri-phone-line', label: 'Phone', value: '+91 98746 81046' },
  { icon: 'ri-mail-line', label: 'Email', value: 'patty.shack@gmail.com' },
  { icon: 'ri-map-pin-line', label: 'Counter Location', value: 'Ground Floor, Infinity Benchmark, near RDB Cinema, Sector V, Salt Lake, Kolkata 700091' },
  { icon: 'ri-time-line', label: 'Opening Hours', value: 'Open Every Day · 11:00 am  – 10:00 pm' },
  { icon: 'ri-group-line', label: 'Parties & Catering', value: 'Large team orders & events welcome' },
];
