-- ============================================================
-- 이제남 (ijenam) - Supabase Schema
-- 과일청 브랜드 · 이름 각인 라벨
-- ============================================================
-- EXECUTION ORDER:
--   1. Enums
--   2. Tables (products → orders → order_items → leads → events → settings)
--   3. Triggers
--   4. Views (operational + marketing analytics)
--   5. RLS policies
--   6. Seed data
-- ============================================================


-- ============================================================
-- 1. ENUMS
-- ============================================================

CREATE TYPE order_status AS ENUM (
  'ghost_received',
  'pending_payment',
  'paid',
  'brewing',
  'engraving',
  'shipped',
  'cancelled'
);

CREATE TYPE event_type AS ENUM (
  'page_view',
  'section_view',
  'name_input_start',
  'name_input_complete',
  'add_to_cart',
  'checkout_start',
  'order_submit',
  'subscribe_intent',
  'sms_consent',
  'survey_answer',
  'ghost_message_view'
);


-- ============================================================
-- 2. TABLES
-- ============================================================

-- ------------------------------------------------------------
-- 2-1. products  과일청 상품
-- ------------------------------------------------------------
CREATE TABLE products (
  id          text        PRIMARY KEY,            -- 'peach' | 'plum' | 'berry'
  name        text        NOT NULL,               -- 복숭아청, 자두청, 블루베리청
  price       integer     NOT NULL DEFAULT 26000, -- 원
  volume_ml   integer     NOT NULL DEFAULT 500,
  image_url   text,
  note        text,                               -- 한 줄 설명
  season_from smallint,                           -- 제철 시작 월 (1-12)
  season_to   smallint,                           -- 제철 종료 월 (1-12)
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 2-2. orders  주문
-- ------------------------------------------------------------
CREATE TABLE orders (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no        text        UNIQUE,                         -- IJN-YYMMDD-NNN (trigger 자동 생성)
  buyer_name      text        NOT NULL,
  buyer_phone     text        NOT NULL,
  buyer_email     text,
  zipcode         text,
  address1        text,
  address2        text,
  delivery_memo   text,
  subtotal        integer     NOT NULL DEFAULT 0,
  shipping_fee    integer     NOT NULL DEFAULT 0,
  total           integer     NOT NULL DEFAULT 0,
  payment_mode    text        NOT NULL DEFAULT 'ghost',       -- 'ghost' | 'live'
  status          order_status NOT NULL DEFAULT 'ghost_received',
  payment_key     text,                                       -- PG 결제 키
  paid_at         timestamptz,
  subscribe_intent boolean    NOT NULL DEFAULT false,         -- 구독 의사
  sms_consent     boolean     NOT NULL DEFAULT false,         -- SMS 수신 동의
  survey_who      text,                                       -- 'self' | 'family' | etc
  session_id      text,
  admin_memo      text,
  contacted_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 2-3. order_items  주문 항목 (각인 이름 포함)
-- ------------------------------------------------------------
CREATE TABLE order_items (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       uuid        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id     text        NOT NULL REFERENCES products(id),
  engrave_name   text        NOT NULL
                             CHECK (engrave_name ~ '^[가-힣]{1,10}$'),  -- 한글 1-10자
  quantity       integer     NOT NULL DEFAULT 1,
  unit_price     integer     NOT NULL DEFAULT 26000,
  label_printed  boolean     NOT NULL DEFAULT false,
  label_written  boolean     NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 2-4. leads  잠재 고객 (전화번호 기준 중복 방지)
-- ------------------------------------------------------------
CREATE TABLE leads (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone        text        UNIQUE NOT NULL,
  name         text,
  order_id     uuid        REFERENCES orders(id),
  source       text,                              -- 유입 경로
  session_id   text,
  contacted_at timestamptz,
  memo         text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 2-5. events  행동 로그
-- ------------------------------------------------------------
CREATE TABLE events (
  id          bigserial   PRIMARY KEY,
  type        event_type  NOT NULL,
  session_id  text,
  product_id  text,
  section     text,                               -- 섹션 이름 (hero, story, product …)
  utm_source  text,
  meta        jsonb       DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- index: 분석 쿼리 빈번
CREATE INDEX idx_events_type       ON events (type);
CREATE INDEX idx_events_session    ON events (session_id);
CREATE INDEX idx_events_created_at ON events (created_at);

-- ------------------------------------------------------------
-- 2-6. settings  운영 설정 (단일 행)
-- ------------------------------------------------------------
CREATE TABLE settings (
  id                integer     PRIMARY KEY CHECK (id = 1),
  payment_mode      text        NOT NULL DEFAULT 'ghost',     -- 'ghost' | 'live'
  accepting_orders  boolean     NOT NULL DEFAULT true,
  ghost_message     text,                                     -- 고스트 모드 안내 문구
  ad_spend_total    integer     NOT NULL DEFAULT 0,           -- 총 광고비 (원)
  updated_at        timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 3. TRIGGERS
-- ============================================================

-- ------------------------------------------------------------
-- 3-1. gen_order_no()  주문번호 자동 생성 IJN-YYMMDD-NNN
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION gen_order_no()
RETURNS trigger AS $$
DECLARE
  today text;
  seq   integer;
BEGIN
  today := to_char(now(), 'YYMMDD');

  SELECT count(*) + 1
    INTO seq
    FROM orders
   WHERE order_no LIKE 'IJN-' || today || '-%';

  NEW.order_no := 'IJN-' || today || '-' || lpad(seq::text, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gen_order_no
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_no IS NULL)
  EXECUTE FUNCTION gen_order_no();

-- ------------------------------------------------------------
-- 3-2. touch_updated_at()  updated_at 자동 갱신
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION touch_updated_at();

-- ------------------------------------------------------------
-- 3-3. order_to_lead()  주문 → 리드 자동 생성/갱신
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION order_to_lead()
RETURNS trigger AS $$
BEGIN
  INSERT INTO leads (phone, name, order_id, source, session_id)
  VALUES (
    NEW.buyer_phone,
    NEW.buyer_name,
    NEW.id,
    'order',
    NEW.session_id
  )
  ON CONFLICT (phone) DO UPDATE
    SET name       = EXCLUDED.name,
        order_id   = EXCLUDED.order_id,
        session_id = EXCLUDED.session_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_to_lead
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION order_to_lead();


-- ============================================================
-- 4. VIEWS
-- ============================================================

-- ------------------------------------------------------------
-- 4-1. verdict  자동 판정 (구매 클릭률, CAC, 구독 의사)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW verdict AS
WITH base AS (
  SELECT
    count(*) FILTER (WHERE type = 'page_view')     AS visitors,
    count(*) FILTER (WHERE type = 'add_to_cart')    AS cart_clicks,
    count(*) FILTER (WHERE type = 'order_submit')   AS order_submits
  FROM events
),
order_stats AS (
  SELECT
    count(*)                                        AS total_orders,
    coalesce(sum(total), 0)                         AS total_revenue,
    count(*) FILTER (WHERE subscribe_intent = true) AS subscribe_count
  FROM orders
  WHERE status != 'cancelled'
),
spend AS (
  SELECT coalesce(ad_spend_total, 0) AS ad_spend
  FROM settings
  WHERE id = 1
)
SELECT
  b.visitors,
  b.cart_clicks,
  b.order_submits,
  o.total_orders,
  o.total_revenue,
  s.ad_spend,

  -- 구매 클릭률 (add_to_cart / page_view)
  CASE WHEN b.visitors > 0
    THEN round(b.cart_clicks::numeric / b.visitors * 100, 2)
    ELSE 0
  END AS purchase_click_rate,

  -- CAC (광고비 / 주문수)
  CASE WHEN o.total_orders > 0
    THEN round(s.ad_spend::numeric / o.total_orders, 0)
    ELSE 0
  END AS cac,

  -- 구독 의사 비율
  CASE WHEN o.total_orders > 0
    THEN round(o.subscribe_count::numeric / o.total_orders * 100, 2)
    ELSE 0
  END AS subscribe_rate,

  -- 자동 판정
  CASE
    WHEN b.visitors < 50 THEN 'insufficient_data'
    WHEN (b.cart_clicks::numeric / NULLIF(b.visitors, 0) * 100) >= 5
         AND (o.total_orders > 0 AND s.ad_spend::numeric / o.total_orders <= 20000)
         AND (o.subscribe_count::numeric / NULLIF(o.total_orders, 0) * 100) >= 30
    THEN 'pass'
    ELSE 'fail'
  END AS judgement

FROM base b, order_stats o, spend s;

-- ------------------------------------------------------------
-- 4-2. product_distribution  상품별 주문 분포
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW product_distribution AS
SELECT
  oi.product_id,
  p.name                                          AS product_name,
  count(*)                                        AS order_count,
  sum(oi.quantity)                                 AS total_qty,
  round(
    count(*)::numeric
    / NULLIF((SELECT count(*) FROM order_items), 0) * 100, 1
  )                                               AS pct
FROM order_items oi
JOIN products p ON p.id = oi.product_id
GROUP BY oi.product_id, p.name
ORDER BY total_qty DESC;

-- ------------------------------------------------------------
-- 4-3. ad_performance  UTM 소스별 광고 성과
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW ad_performance AS
SELECT
  e.utm_source,
  count(*) FILTER (WHERE e.type = 'page_view')    AS visits,
  count(*) FILTER (WHERE e.type = 'add_to_cart')   AS cart_clicks,
  count(*) FILTER (WHERE e.type = 'order_submit')  AS order_submits,
  CASE WHEN count(*) FILTER (WHERE e.type = 'page_view') > 0
    THEN round(
      count(*) FILTER (WHERE e.type = 'order_submit')::numeric
      / count(*) FILTER (WHERE e.type = 'page_view') * 100, 2
    )
    ELSE 0
  END AS conversion_rate
FROM events e
WHERE e.utm_source IS NOT NULL
GROUP BY e.utm_source
ORDER BY order_submits DESC;

-- ------------------------------------------------------------
-- 4-4. survey_result  설문 결과 (self vs family)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW survey_result AS
SELECT
  survey_who,
  count(*)                                        AS cnt,
  round(
    count(*)::numeric
    / NULLIF((SELECT count(*) FROM orders WHERE survey_who IS NOT NULL), 0) * 100, 1
  )                                               AS pct
FROM orders
WHERE survey_who IS NOT NULL
GROUP BY survey_who
ORDER BY cnt DESC;

-- ------------------------------------------------------------
-- 4-5. uncontacted_leads  미연락 리드
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW uncontacted_leads AS
SELECT
  l.id,
  l.phone,
  l.name,
  l.source,
  l.created_at,
  o.order_no,
  o.total
FROM leads l
LEFT JOIN orders o ON o.id = l.order_id
WHERE l.contacted_at IS NULL
ORDER BY l.created_at ASC;

-- ------------------------------------------------------------
-- 4-6. label_queue  라벨 인쇄 대기열
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW label_queue AS
SELECT
  oi.id          AS item_id,
  o.order_no,
  o.buyer_name,
  p.name         AS product_name,
  oi.engrave_name,
  oi.quantity,
  o.status,
  oi.label_printed,
  oi.label_written,
  o.created_at   AS order_date
FROM order_items oi
JOIN orders o   ON o.id  = oi.order_id
JOIN products p ON p.id  = oi.product_id
WHERE o.status IN ('paid', 'brewing', 'engraving')
  AND oi.label_written = false
ORDER BY o.created_at ASC;

-- ------------------------------------------------------------
-- 4-7. daily_metrics  일별 핵심 지표
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW daily_metrics AS
SELECT
  date_trunc('day', created_at)::date              AS day,
  count(*) FILTER (WHERE type = 'page_view')       AS visitors,
  count(*) FILTER (WHERE type = 'add_to_cart')     AS cart_clicks,
  count(*) FILTER (WHERE type = 'order_submit')    AS orders,
  count(*) FILTER (WHERE type = 'name_input_start')    AS name_starts,
  count(*) FILTER (WHERE type = 'name_input_complete') AS name_completes,
  count(*) FILTER (WHERE type = 'checkout_start')  AS checkout_starts
FROM events
GROUP BY day
ORDER BY day DESC;

-- ------------------------------------------------------------
-- 4-8. hourly_pattern  시간대별 방문 패턴
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW hourly_pattern AS
SELECT
  extract(hour FROM created_at)::integer AS hour,
  count(*)                               AS visitor_count
FROM events
WHERE type = 'page_view'
GROUP BY hour
ORDER BY hour;

-- ------------------------------------------------------------
-- 4-9. section_reach  섹션 도달률
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW section_reach AS
WITH total_sessions AS (
  SELECT count(DISTINCT session_id) AS total
  FROM events
  WHERE type = 'page_view'
)
SELECT
  e.section,
  count(DISTINCT e.session_id)                     AS reached,
  t.total                                          AS total_sessions,
  CASE WHEN t.total > 0
    THEN round(
      count(DISTINCT e.session_id)::numeric / t.total * 100, 1
    )
    ELSE 0
  END                                              AS reach_rate
FROM events e, total_sessions t
WHERE e.type = 'section_view'
  AND e.section IS NOT NULL
GROUP BY e.section, t.total
ORDER BY reached DESC;

-- ------------------------------------------------------------
-- 4-10. funnel  전체 퍼널 (page_view → order_submit)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW funnel AS
WITH steps AS (
  SELECT
    count(DISTINCT session_id) FILTER (WHERE type = 'page_view')           AS s1_page_view,
    count(DISTINCT session_id) FILTER (WHERE type = 'name_input_start')    AS s2_name_start,
    count(DISTINCT session_id) FILTER (WHERE type = 'name_input_complete') AS s3_name_complete,
    count(DISTINCT session_id) FILTER (WHERE type = 'add_to_cart')         AS s4_add_to_cart,
    count(DISTINCT session_id) FILTER (WHERE type = 'checkout_start')      AS s5_checkout_start,
    count(DISTINCT session_id) FILTER (WHERE type = 'order_submit')        AS s6_order_submit
  FROM events
)
SELECT
  s1_page_view,
  s2_name_start,
  s3_name_complete,
  s4_add_to_cart,
  s5_checkout_start,
  s6_order_submit,

  -- 단계별 전환율 (직전 대비)
  CASE WHEN s1_page_view > 0
    THEN round(s2_name_start::numeric    / s1_page_view     * 100, 1) ELSE 0 END AS rate_1_2,
  CASE WHEN s2_name_start > 0
    THEN round(s3_name_complete::numeric / s2_name_start    * 100, 1) ELSE 0 END AS rate_2_3,
  CASE WHEN s3_name_complete > 0
    THEN round(s4_add_to_cart::numeric   / s3_name_complete * 100, 1) ELSE 0 END AS rate_3_4,
  CASE WHEN s4_add_to_cart > 0
    THEN round(s5_checkout_start::numeric / s4_add_to_cart  * 100, 1) ELSE 0 END AS rate_4_5,
  CASE WHEN s5_checkout_start > 0
    THEN round(s6_order_submit::numeric  / s5_checkout_start * 100, 1) ELSE 0 END AS rate_5_6,

  -- 전체 전환율 (page_view → order_submit)
  CASE WHEN s1_page_view > 0
    THEN round(s6_order_submit::numeric / s1_page_view * 100, 2) ELSE 0 END AS overall_rate

FROM steps;


-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings    ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 5-1. products: 공개 읽기 (is_active = true)
-- ------------------------------------------------------------
CREATE POLICY "products_public_read"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- ------------------------------------------------------------
-- 5-2. orders: anon insert, admin(authenticated) 전체
-- ------------------------------------------------------------
CREATE POLICY "orders_anon_insert"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "orders_admin_all"
  ON orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- 5-3. order_items: anon insert, admin 전체
-- ------------------------------------------------------------
CREATE POLICY "order_items_anon_insert"
  ON order_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "order_items_admin_all"
  ON order_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- 5-4. leads: anon insert, admin 전체
-- ------------------------------------------------------------
CREATE POLICY "leads_anon_insert"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "leads_admin_all"
  ON leads FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- 5-5. events: anon insert, admin read
-- ------------------------------------------------------------
CREATE POLICY "events_anon_insert"
  ON events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "events_admin_read"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- ------------------------------------------------------------
-- 5-6. settings: admin 전체
-- ------------------------------------------------------------
CREATE POLICY "settings_admin_all"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- 6. SEED DATA
-- ============================================================

-- 상품 3종
INSERT INTO products (id, name, price, volume_ml, image_url, note, sort_order) VALUES
  ('peach', '복숭아청', 26000, 500, '/img/01_peach.webp',  '여름에 복숭아를 먹는 건 오래된 습관입니다.', 1),
  ('plum',  '자두청',   26000, 500, '/img/02_plum.webp',   '시고 답니다. 물에 타면 여름 맛이 납니다.',    2),
  ('berry', '블루베리청', 26000, 500, '/img/03_berry.webp', '왜 좋은지는 저보다 잘 아실 겁니다.',         3)
ON CONFLICT (id) DO NOTHING;

-- 운영 설정 (단일 행)
INSERT INTO settings (id, ad_spend_total) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
