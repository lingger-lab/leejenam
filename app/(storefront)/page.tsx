import { Monologue } from '@/components/landing/Monologue';
import { FruitBanner } from '@/components/landing/FruitBanner';
import { Serving } from '@/components/landing/Serving';
import { FounderLetter } from '@/components/landing/FounderLetter';
import { Credentials } from '@/components/landing/Credentials';
import { Maker } from '@/components/landing/Maker';
import { Refuse } from '@/components/landing/Refuse';
import { FruitShowcase } from '@/components/landing/FruitShowcase';
import { Process } from '@/components/landing/Process';
import { Origin } from '@/components/landing/Origin';
import { Rent } from '@/components/landing/Rent';
import { ProductionLimit } from '@/components/landing/ProductionLimit';
import { Hero } from '@/components/landing/Hero';
import { Signature } from '@/components/landing/Signature';
import { Shop } from '@/components/landing/Shop';
import { Spec } from '@/components/landing/Spec';
import { PageTracker } from '@/components/PageTracker';
import { NameGate } from '@/components/NameGate';
import { FadeUp } from '@/components/FadeUp';

export default function Home() {
  return (
    <>
      <NameGate />
      <PageTracker />
      <Monologue />
      <FruitBanner />
      <FadeUp><Serving /></FadeUp>
      <FruitShowcase />
      <Hero />
      <FadeUp><FounderLetter /></FadeUp>
      <FadeUp><Credentials /></FadeUp>
      <FadeUp><Maker /></FadeUp>
      <FadeUp><Refuse /></FadeUp>
      <FadeUp><Process /></FadeUp>
      <FadeUp><Origin /></FadeUp>
      <FadeUp><Rent /></FadeUp>
      <FadeUp><ProductionLimit /></FadeUp>
      <FadeUp><Signature /></FadeUp>
      <FadeUp><Shop /></FadeUp>
      <FadeUp><Spec /></FadeUp>
    </>
  );
}
