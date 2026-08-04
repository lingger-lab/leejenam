'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    // 브라우저 세션에서 직접 로그아웃 — 쿠키가 확실히 정리된 뒤 로그인으로 이동
    await createClient().auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-paper/80 hover:text-paper border border-paper/30
                 hover:border-paper/60 px-3 py-1.5 whitespace-nowrap flex-shrink-0
                 transition-colors disabled:opacity-50"
    >
      {loading ? '로그아웃 중...' : '로그아웃'}
    </button>
  );
}
