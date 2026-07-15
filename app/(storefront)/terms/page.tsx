export default function TermsPage() {
  return (
    <div className="bg-paper min-h-screen px-6 py-10">
      <div className="max-w-lg mx-auto">
        <p className="font-batang text-soft text-sm tracking-widest mb-3 text-center">
          농업회사법인 제이엔
        </p>
        <h1 className="font-batang font-bold text-2xl text-ink text-center mb-14">
          이용약관
        </h1>

        <div className="space-y-10 font-plex text-sm text-ink leading-relaxed">
          <Section title="1. 목적">
            <p>
              본 약관은 농업회사법인(주)제이엔(이하 &ldquo;회사&rdquo;)이 운영하는
              이제남 온라인 스토어(이하 &ldquo;스토어&rdquo;)에서 제공하는 서비스의
              이용 조건 및 절차에 관한 사항을 규정합니다.
            </p>
          </Section>

          <Section title="2. 용어 정의">
            <ul className="list-disc list-inside space-y-1 text-soft">
              <li>&ldquo;구매자&rdquo;란 스토어를 통해 상품을 주문하는 개인을 말합니다.</li>
              <li>&ldquo;상품&rdquo;이란 회사가 제조·판매하는 과일청 제품을 말합니다.</li>
              <li>&ldquo;각인 서비스&rdquo;란 상품 라벨에 구매자가 지정한 이름을 손글씨로 새기는 서비스를 말합니다.</li>
            </ul>
          </Section>

          <Section title="3. 주문 및 계약">
            <p>
              구매자가 주문서를 작성하고 &ldquo;주문하기&rdquo; 버튼을 클릭하면
              주문이 접수됩니다. 회사가 주문을 확인한 시점에 계약이 성립합니다.
            </p>
            <p className="mt-2 text-soft">
              주문 후 제조에 착수한 상품은 각인 서비스의 특성상
              주문 취소가 제한될 수 있습니다.
            </p>
          </Section>

          <Section title="4. 가격 및 결제">
            <ul className="list-disc list-inside space-y-1 text-soft">
              <li>상품 가격은 스토어에 표시된 금액을 따릅니다.</li>
              <li>배송비는 무료입니다.</li>
              <li>결제 방식은 회사가 정하는 바에 따릅니다.</li>
            </ul>
          </Section>

          <Section title="5. 배송">
            <p>
              주문 후 <strong>3~4일</strong> 이내에 발송합니다.
              도서산간 지역은 1~2일이 추가될 수 있습니다.
            </p>
            <p className="mt-2 text-soft">
              주문 제작 상품으로, 원물 수급 상황에 따라
              배송이 지연될 수 있으며, 이 경우 사전에 안내드립니다.
            </p>
          </Section>

          <Section title="6. 교환 및 환불">
            <p>
              식품의 특성상 단순 변심에 의한 교환·환불은 어렵습니다.
              다만, 다음의 경우 교환 또는 환불이 가능합니다.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-soft">
              <li>상품이 파손된 상태로 배송된 경우</li>
              <li>주문한 상품과 다른 상품이 배송된 경우</li>
              <li>각인 이름이 주문 내용과 다른 경우</li>
            </ul>
            <p className="mt-2 text-soft">
              수령 후 3일 이내에 연락해주시면 확인 후 처리해드립니다.
            </p>
          </Section>

          <Section title="7. 면책">
            <p className="text-soft">
              천재지변, 자연재해 등 불가항력적 사유로 인한
              서비스 중단 또는 배송 지연에 대해 회사는 책임을 지지 않습니다.
            </p>
          </Section>
        </div>

        <p className="font-plex text-xs text-soft mt-14 text-center">
          본 약관은 2025년 1월 1일부터 시행합니다.
        </p>
      </div>
    </div>
  );
}

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
