import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // 1. Инициализируем серверный клиент Supabase для работы с куками
  event.locals.supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co',
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key',
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' });
          });
        },
      },
    }
  );

  // Помощник для безопасного получения сессии
  event.locals.safeGetSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    if (!session) return { session: null, user: null };
    return { session, user: session.user };
  };

  const { session } = await event.locals.safeGetSession();

  // 2. ЛОГИКА ЗАЩИТЫ ПЕРИМЕТРА (GUARD)
  const isAuthPage = event.url.pathname.startsWith('/auth');
  
  // Если пользователь НЕ авторизован и пытается зайти куда угодно, кроме /auth — жестко редиректим на логин
  if (!session && !isAuthPage) {
    throw redirect(303, '/auth');
  }

  // Если пользователь УЖЕ авторизован, но зачем-то ломится на страницу /auth — отправляем его на главный дашборд
  if (session && isAuthPage) {
    throw redirect(303, '/');
  }

  // Если проверка пройдена, отдаем управление SvelteKit дальше
  return resolve(event);
}