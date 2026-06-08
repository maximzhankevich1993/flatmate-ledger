-- 1. ТАБЛИЦА ДОМОВ (HOUSEHOLDS)
CREATE TABLE public.households (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. ТАБЛИЦА ПРОФИЛЕЙ ПОЛЬЗОВАТЕЛЕЙ (PROFILES)
-- Связана со встроенной авторизацией Supabase (auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    household_id UUID REFERENCES public.households(id) ON DELETE SET NULL,
    username TEXT NOT NULL,
    avatar TEXT,
    points INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Включаем Row Level Security (RLS) для защиты данных
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Создаем базовые политики безопасности (Пользователь видит только свой дом и сожителей)
CREATE POLICY "Users can view their own household" ON public.households
    FOR SELECT USING (id IN (SELECT household_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view profiles in the same household" ON public.profiles
    FOR SELECT USING (household_id IN (SELECT household_id FROM public.profiles WHERE id = auth.uid()) OR id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());
-- 3. ТАБЛИЦА ОБЯЗАННОСТЕЙ (CHORES)
CREATE TABLE public.chores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- NULL означает "Everyone / На ротации"
    title TEXT NOT NULL,
    points INTEGER DEFAULT 10 NOT NULL,
    due_date TEXT DEFAULT 'Today'::text NOT NULL,
    is_done BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ТАБЛИЦА РАСХОДОВ (EXPENSES)
CREATE TABLE public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
    paid_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    tag TEXT DEFAULT 'General'::text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Включаем Row Level Security (RLS) для новых таблиц
ALTER TABLE public.chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для Задач (Chores)
CREATE POLICY "Users can manage chores in their household" ON public.chores
    FOR ALL USING (
        household_id IN (SELECT household_id FROM public.profiles WHERE id = auth.uid())
    );

-- Политики безопасности для Расходов (Expenses)
CREATE POLICY "Users can manage expenses in their household" ON public.expenses
    FOR ALL USING (
        household_id IN (SELECT household_id FROM public.profiles WHERE id = auth.uid())
    );