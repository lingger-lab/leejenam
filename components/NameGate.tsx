'use client';

import { useState, useEffect, useRef } from 'react';
import { getStoredName, setStoredName } from '@/lib/name';
import { validateEngraveName } from '@/lib/validators';
import { track } from '@/lib/events';

export function NameGate() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = getStoredName();
    if (!stored) {
      setVisible(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, []);

  const handleSubmit = () => {
    const trimmed = name.trim();
    const result = validateEngraveName(trimmed);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setStoredName(trimmed);
    track('name_input_complete', { name: trimmed, source: 'gate' });

    setFading(true);
    setTimeout(() => setVisible(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] bg-paper flex items-center justify-center px-6
                  motion-safe:transition-opacity motion-safe:duration-500
                  ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="w-full max-w-sm text-center">
        <p className="font-batang font-bold text-2xl text-ink mb-2">
          이제남
        </p>
        <p className="font-batang text-soft text-sm tracking-wider mb-12">
          이제, 오늘 담갔습니다
        </p>

        <h2 className="font-batang text-xl text-ink leading-relaxed mb-8">
          드시는 분의 이름을
          <br />
          알려주세요
        </h2>

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => {
            if (e.target.value.length <= 10) {
              setName(e.target.value);
              setError('');
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="한글 이름"
          className="w-full text-center font-pen text-4xl text-seal bg-transparent
                     border-0 border-b-2 border-rule focus:border-seal
                     outline-none py-3 placeholder:text-rule placeholder:font-plex
                     placeholder:text-base transition-colors"
          maxLength={10}
          autoComplete="off"
          enterKeyHint="done"
        />

        {error && (
          <p className="font-plex text-xs text-seal mt-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full mt-10 py-4 bg-ink text-paper font-plex font-medium
                     text-sm tracking-wide hover:bg-seal active:bg-seal
                     transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ touchAction: 'manipulation' }}
        >
          시작하기
        </button>

        <p className="font-plex text-xs text-soft mt-6">
          라벨에 새겨드립니다
        </p>
      </div>
    </div>
  );
}
