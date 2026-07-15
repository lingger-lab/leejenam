import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = '이제남 — 주문받고 담그는 과일청. 라벨에 드시는 분 이름을 새깁니다.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const fontData = await readFile(
    join(process.cwd(), 'assets/GowunBatang-Bold.woff')
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#EFE9DE',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            border: '1px solid #CCC2AE',
            padding: '60px',
          }}
        >
          <div
            style={{
              fontFamily: 'GowunBatang',
              fontSize: 120,
              fontWeight: 700,
              color: '#1B1917',
              marginBottom: 16,
            }}
          >
            이제남
          </div>

          <div
            style={{
              fontFamily: 'GowunBatang',
              fontSize: 36,
              color: '#7A2E22',
              marginBottom: 40,
            }}
          >
            이제, 오늘 담갔습니다
          </div>

          <div
            style={{
              width: 60,
              height: 1,
              backgroundColor: '#CCC2AE',
              marginBottom: 40,
            }}
          />

          <div
            style={{
              fontFamily: 'GowunBatang',
              fontSize: 26,
              color: '#5E564C',
            }}
          >
            주문받고 담그는 과일청 · 라벨에 이름을 새깁니다
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'GowunBatang',
          data: fontData,
          style: 'normal' as const,
          weight: 700 as const,
        },
      ],
    }
  );
}
