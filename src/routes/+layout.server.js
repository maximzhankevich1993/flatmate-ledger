/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  // 1. Извлекаем безопасную сессию, которую подготовил hooks.server.js
  const { session } = await locals.safeGetSession();

  // Если сессии нет (пользователь не залогинен), отдаем пустой профиль
  if (!session) {
    return {
      session: null,
      profile: null,
    };
  }

  // 2. Вытягиваем из базы реальные данные сожителя (username, points, household_id)
  const { data: profile, error } = await locals.supabase
    .from('profiles')
    .select('id, username, points, household_id')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error loading global profile layout:', error.message);
  }

  // Возвращаем данные, которые автоматически станут доступны во всех файлах +page.svelte
  return {
    session,
    profile: profile || null,
  };
}