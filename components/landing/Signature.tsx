'use client';

import { useState, useEffect, useRef } from 'react';
import { LabelPreview } from '@/components/LabelPreview';
import { validateEngraveName } from '@/lib/validators';
import { track } from '@/lib/events';

export function Signature() {
  const [name, setName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (name.length === 1 && !hasStarted) {
      setHasStarted(true);
      track('name_input_start');
    }
  }, [name, hasStarted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 10) {
      setName(val);
    }
  };

  const handleBlur = () => {
    if (name.trim()) {
      const { ok } = validateEngraveName(name);
      if (ok) {
        track('name_input_complete', { name });
      }
    }
  };

  return (
    <section className="bg-paper-2 py-20 px-6">
      <div className="max-w-sm mx-auto">
        {/* 안내 텍스트 */}
        <div className="text-center mb-10">
          <p className="font-batang text-soft text-sm tracking-widest mb-3">
            라벨에 새길 이름
          </p>
          <h2 className="font-batang font-bold text-2xl text-ink leading-relaxed">
            드시는 분의 이름을
            <br />
            써주세요.
          </h2>
        </div>

        {/* 이름 입력 */}
        <div className="mb-10">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="이름을 입력하세요"
            className="w-full text-center font-pen text-4xl text-seal bg-transparent
                       border-0 border-b-2 border-rule focus:border-seal
                       outline-none py-3 placeholder:text-rule placeholder:font-plex
                       placeholder:text-base transition-colors"
            maxLength={10}
            autoComplete="off"
            enterKeyHint="done"
          />
        </div>

        {/* 라벨 미리보기 */}
        <div
          className="transition-all duration-500"
          style={{
            opacity: name ? 1 : 0.4,
            transform: name ? 'scale(1)' : 'scale(0.97)',
          }}
        >
          <LabelPreview name={name} productName="복숭아청" size="md" />
        </div>

        {name && (
          <p className="text-center text-soft text-xs mt-6 font-plex">
            이 이름을 손으로 씁니다.
          </p>
        )}
      </div>
    </section>
  );
}
