import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

interface PageShellProps {
  title: string;
  children: ReactNode;
}

export default function PageShell({ title, children }: PageShellProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <Navbar />
      <main className="pt-[76px] bg-background-50">{children}</main>
      <Footer />
    </>
  );
}