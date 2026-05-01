-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text NOT NULL,
  daily_avg_expense numeric(12,2),
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE TO authenticated USING (id = auth.uid());

-- 2. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  icon text NOT NULL,
  archived boolean NOT NULL DEFAULT false,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_user_archived ON public.categories(user_id, archived);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select" ON public.categories;
CREATE POLICY "categories_select" ON public.categories FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "categories_insert" ON public.categories;
CREATE POLICY "categories_insert" ON public.categories FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "categories_update" ON public.categories;
CREATE POLICY "categories_update" ON public.categories FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "categories_delete" ON public.categories;
CREATE POLICY "categories_delete" ON public.categories FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 3. Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('entrada', 'saida', 'investimento', 'diario')),
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'estimado' CHECK (status IN ('estimado', 'confirmado')),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  description text,
  is_initial_balance boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON public.transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_status ON public.transactions(user_id, status);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "transactions_select" ON public.transactions;
CREATE POLICY "transactions_select" ON public.transactions FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "transactions_insert" ON public.transactions;
CREATE POLICY "transactions_insert" ON public.transactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "transactions_update" ON public.transactions;
CREATE POLICY "transactions_update" ON public.transactions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "transactions_delete" ON public.transactions;
CREATE POLICY "transactions_delete" ON public.transactions FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 4. Create fixed_accounts table
CREATE TABLE IF NOT EXISTS public.fixed_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  due_day integer NOT NULL CHECK (due_day BETWEEN 1 AND 31),
  type text NOT NULL CHECK (type IN ('entrada', 'saida')),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fixed_accounts_user_type_active ON public.fixed_accounts(user_id, type, active);

ALTER TABLE public.fixed_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fixed_accounts_select" ON public.fixed_accounts;
CREATE POLICY "fixed_accounts_select" ON public.fixed_accounts FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "fixed_accounts_insert" ON public.fixed_accounts;
CREATE POLICY "fixed_accounts_insert" ON public.fixed_accounts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "fixed_accounts_update" ON public.fixed_accounts;
CREATE POLICY "fixed_accounts_update" ON public.fixed_accounts FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "fixed_accounts_delete" ON public.fixed_accounts;
CREATE POLICY "fixed_accounts_delete" ON public.fixed_accounts FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 5. Triggers
-- Auth trigger for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, onboarding_completed)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), false)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profile trigger for categories
CREATE OR REPLACE FUNCTION public.handle_new_profile_categories()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.categories (user_id, name, color, icon, is_system)
  VALUES
    (NEW.id, 'Alimentação', '#F97316', 'Utensils', true),
    (NEW.id, 'Transporte', '#3B82F6', 'Car', true),
    (NEW.id, 'Saúde e Farmácia', '#10B981', 'Heart', true),
    (NEW.id, 'Lazer e Entretenimento', '#8B5CF6', 'Smile', true),
    (NEW.id, 'Mercado', '#F59E0B', 'ShoppingCart', true),
    (NEW.id, 'Assinaturas e Serviços', '#6366F1', 'CreditCard', true),
    (NEW.id, 'Vestuário', '#EC4899', 'Shirt', true),
    (NEW.id, 'Educação', '#14B8A6', 'BookOpen', true),
    (NEW.id, 'Outros', '#94A3B8', 'MoreHorizontal', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_categories();
