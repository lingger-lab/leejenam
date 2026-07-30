import type { Metadata } from "next";
import { Gowun_Batang, IBM_Plex_Sans_KR, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";

const batang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gowun-batang",
  display: "swap",
});

const plex = IBM_Plex_Sans_KR({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans-kr",
  display: "swap",
});

const pen = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nanum-pen",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ijenam.vercel.app"),
  title: "이제남 — 이름을 새기는 과일청",
  description:
    "제철 과일로 주문받고 담급니다. 복숭아청·자두청·블루베리청 26,000원.",
  openGraph: {
    title: "이제남 — 이름을 새기는 과일청",
    description: "제철 과일로 주문받고 담급니다. 복숭아청·자두청·블루베리청.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${batang.variable} ${plex.variable} ${pen.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
