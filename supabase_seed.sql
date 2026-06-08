-- ОЧИСТКА СТАРЫХ ДАННЫХ (чтобы можно было перезапускать скрипт без ошибок дублирования)
TRUNCATE public.households, public.chores, public.expenses CASCADE;
DELETE FROM public.profiles WHERE household_id = '99999999-9999-9999-9999-999999999999';
DELETE FROM auth.users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');

-- 1. СОЗДАЕМ ТЕСТОВЫЙ ДОМ С НАШИМ MVP-ИДЕНТИФИКАТОРОМ
INSERT INTO public.households (id, name, invite_code)
VALUES ('99999999-9999-9999-9999-999999999999', 'Neon Citadel', 'VIBE-CODE-2026');

-- 2. ГЕНЕРИРУЕМ ТРЕХ ПОЛЬЗОВАТЕЛЕЙ В СИСТЕМЕ АВТОРИЗАЦИИ SUPABASE
INSERT INTO auth.users (id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'alice@vibe.dev', 'mock_encrypted_password', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('22222222-2222-2222-2222-222222222222', 'bob@vibe.dev', 'mock_encrypted_password', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('33333333-3333-3333-3333-333333333333', 'you@vibe.dev', 'mock_encrypted_password', '{"provider":"email"}', '{}', 'authenticated', 'authenticated');

-- 3. СОЗДАЕМ ИХ ИГРОВЫЕ ПУБЛИЧНЫЕ ПРОФИЛИ
INSERT INTO public.profiles (id, household_id, username, points)
VALUES 
    ('11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', 'Alice', 120),
    ('22222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 'Bob', 85),
    ('33333333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999999', 'Vibe Coder (You)', 240);

-- 4. ЗАКИНЕМ ТЕСТОВЫЕ РАСХОДЫ ДЛЯ ПРОВЕРКИ МАТЕМАТИКИ СХЛОПЫВАНИЯ
-- Математика кейса: Всего потрачено $180. Справедливая доля каждого — $60.
-- Алиса внесла $150 (ей все должны). Боб внес $30 (он должен $30). Ты внес $0 (ты должен $60).
INSERT INTO public.expenses (household_id, paid_by, description, amount, tag)
VALUES 
    ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Gigabit Internet & Netflix', 150.00, 'Bills'),
    ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'Coffee Beans & Milk', 30.00, 'Grocery');

-- 5. ДОБАВЛЯЕМ ОБЯЗАННОСТИ ДЛЯ ПРОВЕРКИ ТРЕКЕРА ЗАДАЧ И ИГРОВЫХ ОЧКОВ
INSERT INTO public.chores (household_id, assignee_id, title, points, due_date, is_done)
VALUES 
    ('99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'Clean the kitchen workstation', 50, 'Today', false),
    ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'Take out the trash matrix', 15, 'Tomorrow', false),
    ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Wipe down smart mirrors', 20, 'Yesterday', true);