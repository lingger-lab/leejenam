import { Hero } from '@/components/landing/Hero';
import { Signature } from '@/components/landing/Signature';
import { Badges } from '@/components/landing/Badges';
import { Monologue } from '@/components/landing/Monologue';
import { Declare } from '@/components/landing/Declare';
import { Process } from '@/components/landing/Process';
import { Origin } from '@/components/landing/Origin';
import { Rent } from '@/components/landing/Rent';
import { Maker } from '@/components/landing/Maker';
import { Refuse } from '@/components/landing/Refuse';
import { Shop } from '@/components/landing/Shop';
import { Spec } from '@/components/landing/Spec';
import { PageTracker } from '@/components/PageTracker';
import { NameGate } from '@/components/NameGate';

export default function Home() {
  return (
    <>
      <NameGate />
      <PageTracker />
      <Hero />
      <Signature />
      <Badges />
      <Monologue />
      <Declare />
      <Process />
      <Origin />
      <Rent />
      <Maker />
      <Refuse />
      <Shop />
      <Spec />
    </>
  );
}
