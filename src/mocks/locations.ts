import pattyShackImg from '@/assets/images/patty_shack.jpg';

export interface LocationItem {
  id: string;
  no: string;
  name: string;
  address: string;
  city: string;
  status: string;
  phone: string;
  email: string;
  mapUrl: string;
  hours: { day: string; time: string }[];
  image: string;
}

export const locations: LocationItem[] = [
  {
    id: 'salt-lake',
    no: '01',
    name: 'Infinity Benchmark, Sector V',
    address: 'Ground Floor, Infinity Benchmark, near RDB Cinema, Sector V, Salt Lake, Kolkata 700091',
    city: 'Kolkata',
    status: 'Counter Open',
    phone: '+91 98746 81046',
    email: 'patty.shack@gmail.com',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Infinity+Benchmark%2C+Sector+V%2C+Kolkata',
    hours: [
      { day: 'Every day', time: '10:00 am – 9:00 pm' },
      { day: 'Grill orders', time: 'Until 8:45 pm' },
    ],
    image: pattyShackImg || '/images/patty_shack.jpg',
  },
];
