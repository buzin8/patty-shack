import { useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import SignatureBurgers from './components/SignatureBurgers';
import Marquee from './components/Marquee';
import Craft from './components/Craft';
import Layers from './components/Layers';
import People from './components/People';
import Locations from './components/Locations';

export default function Home() {
  useEffect(() => {
    document.title = 'Patty Shack | Smash Burgers & Charcoal Grill';
  }, []);
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Manifesto />
        <SignatureBurgers />
        <Marquee />
        <Craft />
        <Layers />
        <People />
        <Locations />
      </main>
      <Footer />
    </>
  );
}
