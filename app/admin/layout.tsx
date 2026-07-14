import Link from 'next/link';

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
        <div className="max-w-6xl mx-auto flex items-center gap-6 overflow-x-auto">
          <Link
            href="/admin"
            className="font-batang font-bold text-lg whitespace-nowrap flex-shrink-0"
          >
            이제남
          </Link>
          <div className="flex gap-1">
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
          <form action="/api/auth/signout" method="post" className="ml-auto flex-shrink-0">
            <button type="submit" className="text-sm text-paper/50 hover:text-paper transition-colors">
              로그아웃
            </button>
          </form>
        </div>
      </nav>

      {/* 본문 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
