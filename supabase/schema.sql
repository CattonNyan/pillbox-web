-- PillBox Supabase Schema
-- Supabase SQL Editor에서 실행하세요

-- profiles: auth.users 확장
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL DEFAULT '',
  birth_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  gender            TEXT NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female')),
  has_hypertension  BOOLEAN NOT NULL DEFAULT false,
  has_diabetes      BOOLEAN NOT NULL DEFAULT false,
  is_pregnant       BOOLEAN NOT NULL DEFAULT false,
  preset_morning    TEXT NOT NULL DEFAULT '08:00',
  preset_lunch      TEXT NOT NULL DEFAULT '12:00',
  preset_dinner     TEXT NOT NULL DEFAULT '18:00',
  preset_bedtime    TEXT NOT NULL DEFAULT '22:00',
  is_onboarded      BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- pill_histories: 복약 일정
CREATE TABLE IF NOT EXISTS pill_histories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pill_name   TEXT NOT NULL,
  item_seq    TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE,
  times       TEXT[] NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- pill_taken_records: 일별 복약 체크 기록
CREATE TABLE IF NOT EXISTS pill_taken_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pill_history_id UUID NOT NULL REFERENCES pill_histories(id) ON DELETE CASCADE,
  taken_date      DATE NOT NULL,
  time_slot       TEXT NOT NULL CHECK (time_slot IN ('morning', 'lunch', 'dinner', 'bedtime')),
  taken_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pill_history_id, taken_date, time_slot)
);

-- pill_information: 의약품 참조 데이터 (데이터는 추후 삽입)
CREATE TABLE IF NOT EXISTS pill_information (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_seq        TEXT UNIQUE NOT NULL,
  item_name       TEXT NOT NULL,
  entp_name       TEXT NOT NULL DEFAULT '',
  class_name      TEXT NOT NULL DEFAULT '',
  etc_otc_name    TEXT NOT NULL DEFAULT '',
  item_image      TEXT,
  efcy_qesitm     TEXT,
  use_method_qesitm TEXT,
  atpn_qesitm     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pill_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pill_taken_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pill_information ENABLE ROW LEVEL SECURITY;

-- profiles RLS
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- pill_histories RLS
CREATE POLICY "Users can view own histories" ON pill_histories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own histories" ON pill_histories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own histories" ON pill_histories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own histories" ON pill_histories FOR DELETE USING (auth.uid() = user_id);

-- pill_taken_records RLS
CREATE POLICY "Users can view own records" ON pill_taken_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON pill_taken_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON pill_taken_records FOR DELETE USING (auth.uid() = user_id);

-- pill_information: 모든 인증된 사용자 읽기 허용
CREATE POLICY "Authenticated users can read pill info" ON pill_information FOR SELECT TO authenticated USING (true);

-- 신규 사용자 가입 시 profiles 자동 생성 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_pill_histories_user_id ON pill_histories(user_id);
CREATE INDEX IF NOT EXISTS idx_pill_histories_active ON pill_histories(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_pill_taken_records_user_date ON pill_taken_records(user_id, taken_date);
CREATE INDEX IF NOT EXISTS idx_pill_information_item_seq ON pill_information(item_seq);
CREATE INDEX IF NOT EXISTS idx_pill_information_name ON pill_information USING gin(to_tsvector('simple', item_name));
