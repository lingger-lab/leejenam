'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('이메일 또는 비밀번호를 확인해주세요.');
        setLoading(false);
        return;
      }

      // 전체 페이지 이동으로 새로 설정된 세션 쿠키를 미들웨어가 확실히 읽게 함.
      // (router.push는 쿠키 전파 레이스로 /admin이 다시 로그인으로 튕겨
      //  로그인 페이지가 남고 loading이 안 풀려 무한 '로그인 중...'이 됨)
      window.location.href = '/admin';
    } catch {
      setError('로그인 중 문제가 발생했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-batang font-bold text-2xl text-ink text-center mb-8">
          이제남 관리자
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-soft mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-rule bg-white-2 text-ink
                         outline-none focus:border-ink transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-soft mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-rule bg-white-2 text-ink
                         outline-none focus:border-ink transition-colors text-sm"
            />
          </div>

          {error && (
            <p className="text-seal text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ink text-paper text-sm font-medium
                       hover:bg-seal transition-colors disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
