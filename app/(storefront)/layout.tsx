import Script from 'next/script';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-14">{children}</main>
      <Footer />
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
    </>
  );
}
