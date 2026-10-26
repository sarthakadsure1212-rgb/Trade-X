-- ==============================================================
-- TradeX Mobile Trading Platform — Supabase Database & Security Schema
-- Row-Level Security (RLS) policies for complete multi-user isolation
-- ==============================================================

-- 1. Profiles Table (Linked 1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  currency_preference VARCHAR(4) DEFAULT 'INR' CHECK (currency_preference IN ('INR', 'USD')),
  theme VARCHAR(10) DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile only"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile only"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile only"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Demo & Live Balances Table (Per-user account balance)
CREATE TABLE IF NOT EXISTS public.user_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trading_mode VARCHAR(10) DEFAULT 'DEMO' CHECK (trading_mode IN ('DEMO', 'LIVE')),
  currency VARCHAR(4) DEFAULT 'INR' CHECK (currency IN ('INR', 'USD')),
  available_balance NUMERIC(15, 2) NOT NULL DEFAULT 100000.00,
  invested_capital NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  realized_pnl NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, trading_mode, currency)
);

ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own balance only"
  ON public.user_balances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can modify their own balance only"
  ON public.user_balances FOR ALL
  USING (auth.uid() = user_id);

-- 3. Positions Table
CREATE TABLE IF NOT EXISTS public.positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trading_mode VARCHAR(10) DEFAULT 'DEMO' CHECK (trading_mode IN ('DEMO', 'LIVE')),
  symbol TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  exchange VARCHAR(10) NOT NULL,
  side VARCHAR(4) NOT NULL CHECK (side IN ('BUY', 'SELL')),
  quantity NUMERIC(12, 4) NOT NULL CHECK (quantity > 0),
  avg_entry_price NUMERIC(15, 2) NOT NULL CHECK (avg_entry_price > 0),
  currency VARCHAR(4) DEFAULT 'INR' CHECK (currency IN ('INR', 'USD')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own positions only"
  ON public.positions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own positions only"
  ON public.positions FOR ALL
  USING (auth.uid() = user_id);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trading_mode VARCHAR(10) DEFAULT 'DEMO' CHECK (trading_mode IN ('DEMO', 'LIVE')),
  symbol TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  exchange VARCHAR(10) NOT NULL,
  side VARCHAR(4) NOT NULL CHECK (side IN ('BUY', 'SELL')),
  order_type VARCHAR(10) NOT NULL CHECK (order_type IN ('MARKET', 'LIMIT', 'STOP')),
  quantity NUMERIC(12, 4) NOT NULL CHECK (quantity > 0),
  order_price NUMERIC(15, 2) NOT NULL,
  filled_price NUMERIC(15, 2),
  status VARCHAR(12) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'FILLED', 'CANCELLED', 'REJECTED')),
  currency VARCHAR(4) DEFAULT 'INR' CHECK (currency IN ('INR', 'USD')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders only"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create and cancel their own orders only"
  ON public.orders FOR ALL
  USING (auth.uid() = user_id);

-- 5. User Watchlist Table
CREATE TABLE IF NOT EXISTS public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, symbol)
);

ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own watchlist only"
  ON public.watchlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can modify their own watchlist only"
  ON public.watchlists FOR ALL
  USING (auth.uid() = user_id);

-- 6. Trigger to automatically create a profile and default balance on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, currency_preference)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'INR'
  );

  -- Seed initial demo balances: INR 100,000 and USD 1,000
  INSERT INTO public.user_balances (user_id, trading_mode, currency, available_balance)
  VALUES 
    (new.id, 'DEMO', 'INR', 100000.00),
    (new.id, 'DEMO', 'USD', 1000.00);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
