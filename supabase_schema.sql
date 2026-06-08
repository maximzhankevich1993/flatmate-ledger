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