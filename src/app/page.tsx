import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <LandingHero />
      <LandingFeatures />
    </main>
  );
}
