import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // 1. Инициализируем серверный клиент Supabase для проверки сессии
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      },
    },
  });

  // Удобный хелпер для быстрого получения сессии во всех серверных файлах (+page.server.js)
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    if (!session) return { session: null, user: null };
    return { session, user: session.user };
  };

  const { session } = await event.locals.safeGetSession();

  // 2. ПРОТОКОЛ ЗАЩИТЫ ПЕРИМЕТРА (Редиректы)
  // Если пользователь не авторизован и пытается зайти куда-то, кроме страницы логина:
  if (!session && !event.url.pathname.startsWith('/login')) {
    throw redirect(303, '/login');
  }

  // Если пользователь УЖЕ авторизован, но зачем-то зашёл на страницу логина:
  if (session && event.url.pathname.startsWith('/login')) {
    throw redirect(303, '/');
  }

  // 3. Выполняем запрос и прокидываем правильные заголовки безопасности
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
}