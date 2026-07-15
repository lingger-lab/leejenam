export default function PrivacyPage() {
  return (
    <div className="bg-paper min-h-screen px-6 py-10">
      <div className="max-w-lg mx-auto">
        <p className="font-batang text-soft text-sm tracking-widest mb-3 text-center">
          농업회사법인 제이엔
        </p>
        <h1 className="font-batang font-bold text-2xl text-ink text-center mb-14">
          개인정보처리방침
        </h1>

        <div className="space-y-10 font-plex text-sm text-ink leading-relaxed">
          {/* 1. 수집 항목 */}
          <Section title="1. 수집하는 개인정보 항목">
            <p>
              농업회사법인 제이엔(이하 &ldquo;회사&rdquo;)은 주문 처리를 위해
              아래 항목을 수집합니다.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-soft">
              <li>주문자 이름</li>
              <li>연락처 (휴대전화번호)</li>
              <li>배송지 주소 (우편번호, 기본주소, 상세주소)</li>
              <li>라벨 각인 이름</li>
            </ul>
          </Section>

          {/* 2. 수집 목적 */}
          <Section title="2. 개인정보의 수집 및 이용 목적">
            <ul className="list-disc list-inside space-y-1 text-soft">
              <li>주문 접수 및 상품 배송</li>
              <li>주문 관련 안내 및 고객 문의 응대</li>
              <li>라벨 각인 서비스 제공</li>
            </ul>
          </Section>

          {/* 3. 보유 기간 */}
          <Section title="3. 개인정보의 보유 및 이용 기간">
            <p>
              수집된 개인정보는 <strong>주문 후 3년간</strong> 보유하며,
              보유 기간 경과 시 지체 없이 파기합니다.
              단, 관련 법령에 의해 보존이 필요한 경우 해당 법령에서
              정한 기간 동안 보존합니다.
            </p>
          </Section>

          {/* 4. 제3자 제공 */}
          <Section title="4. 개인정보의 제3자 제공">
            <p>
              회사는 수집한 개인정보를 제3자에게 제공하지 않습니다.
              다만, 배송 업무 위탁 시 배송에 필요한 최소한의 정보(수령인, 연락처, 주소)를
              배송 업체에 전달할 수 있습니다.
            </p>
          </Section>

          {/* 5. 정보주체 권리 */}
          <Section title="5. 정보주체의 권리">
            <p>
              주문자는 언제든지 자신의 개인정보에 대해
              열람, 정정, 삭제를 요청할 수 있습니다.
              삭제 요청은 아래 연락처로 접수해주세요.
            </p>
          </Section>

          {/* 6. 연락처 */}
          <Section title="6. 개인정보 보호 문의">
            <p className="text-soft">
              농업회사법인 제이엔
              <br />
              대표: 이제남
            </p>
          </Section>
        </div>

        {/* 시행일 */}
        <p className="font-plex text-xs text-soft mt-14 text-center">
          본 방침은 2025년 1월 1일부터 시행합니다.
        </p>

      </div>
    </div>
  );
}

/* ---------- Section 컴포넌트 ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-batang font-bold text-base text-ink mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
