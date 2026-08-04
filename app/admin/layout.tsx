import Link from 'next/link';
import { LogoutButton } from './LogoutButton';

const navItems = [
  { href: '/admin', label: '대시보드' },
  { href: '/admin/analytics', label: '분석' },
  { href: '/admin/orders', label: '주문' },
  { href: '/admin/labels', label: '라벨' },
  { href: '/admin/leads', label: '리드' },
  { href: '/admin/verdict', label: '판정' },
  { href: '/admin/settings', label: '설정' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white-2 font-plex">
      {/* 상단 네비게이션 */}
      <nav className="bg-ink text-paper px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link
            href="/admin"
            className="font-batang font-bold text-lg whitespace-nowrap flex-shrink-0"
          >
            이제남
          </Link>
          {/* 링크만 가운데서 가로 스크롤 — 로고·로그아웃은 양끝 고정(모바일에서도 항상 보임) */}
          <div className="flex gap-1 overflow-x-auto flex-1 min-w-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-paper/70 hover:text-paper px-3 py-1.5
                           transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <LogoutButton />
        </div>
      </nav>

      {/* 본문 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
