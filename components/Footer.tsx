import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-ink py-12 lg:py-16 px-6">
      <div className="max-w-lg lg:max-w-3xl mx-auto text-center">
        {/* 브랜드 */}
        <p className="font-batang font-bold text-xl text-paper">이제남</p>
        <p className="text-gold text-xs mt-1.5">이제, 오늘 담갔습니다</p>

        {/* 네비게이션 */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 my-8">
          <Link
            href="/#founder"
            className="font-plex text-sm text-paper/70 hover:text-paper py-2 transition-colors"
          >
            회사소개
          </Link>
          <Link
            href="/terms"
            className="font-plex text-sm text-paper/70 hover:text-paper py-2 transition-colors"
          >
            이용약관
          </Link>
          <Link
            href="/privacy"
            className="font-plex text-sm text-paper/70 hover:text-paper py-2 transition-colors"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/#spec"
            className="font-plex text-sm text-paper/70 hover:text-paper py-2 transition-colors"
          >
            이용안내
          </Link>
        </div>

        {/* 전화 주문 안내 */}
        <p className="font-plex text-sm text-paper/70 leading-relaxed mb-2">
          온라인이 불편하시면, 전화로 주문하셔도 됩니다.
        </p>
        <a
          href="tel:010-8339-5585"
          className="inline-block font-plex text-base text-gold font-medium
                     hover:underline underline-offset-2"
        >
          010-8339-5585
        </a>
        <p className="font-plex text-sm text-paper/70 mt-2 tabular-nums">
          농협 947-02-126434 예금주 이제남
        </p>

        {/* 구분선 */}
        <div className="w-8 h-px bg-paper/30 mx-auto my-8" />

        {/* 사업자 정보 */}
        <div className="font-plex text-xs text-paper/70 leading-loose space-y-1">
          <p>농업회사법인(주)제이엔 · 대표 이제남</p>
          <p>사업자등록번호 587-87-03728</p>
          <p>경상남도 창원시 마산합포구 구산면 옥곡1길 77</p>
          <p>
            <a href="tel:010-8339-5585" className="hover:text-paper/70 transition-colors">
              010-8339-5585
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
