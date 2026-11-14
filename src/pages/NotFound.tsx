import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-background-50 flex flex-col">
      <div className="h-[72px] border-b border-background-300 flex items-center wrap">
        <Link to="/" className="display text-[28px] cursor-pointer">
          <span className="text-accent-500">Patty</span> Shack
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-center wrap py-16">
        <p className="eyebrow text-foreground-600">Error 404 — {location.pathname}</p>
        <h1 className="display text-[clamp(96px,18vw,280px)] mt-4">
          Burnt<span className="text-primary-500">.</span>
        </h1>
        <p className="max-w-[420px] mt-4 text-foreground-700 leading-[1.7]">
          This page fell off the griddle. Head back to the counter and grab something hot.
        </p>
        <Link to="/" className="mt-8 self-start rounded-md bg-primary-500 px-8 py-4 eyebrow text-background-50 whitespace-nowrap hover:bg-primary-600 cursor-pointer">
          Back to Patty Shack
        </Link>
      </div>
    </main>
  );
}
