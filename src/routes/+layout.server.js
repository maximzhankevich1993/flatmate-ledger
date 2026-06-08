/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  // 1. Извлекаем безопасную сессию, которую подготовил hooks.server.js
  const { session } = await locals.safeGetSession();

  // Если сессии нет (пользователь не залогинен), отдаем пустой профиль
  if (!session) {
    return {
      session: null,
      profile: null,
      isPremium: false
    };
  }

  // 2. Вытягиваем из базы реальные данные сожителя (включая household_id)
  const { data: profile, error: profileError } = await locals.supabase
    .from('profiles')
    .select('id, username, points, household_id')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    console.error('Error loading global profile layout:', profileError.message);
  }

  // 3. Проверяем статус Премиума для дома, если пользователь к нему привязан
  let isPremium = false;
  if (profile && profile.household_id) {
    const { data: household, error: householdError } = await locals.supabase
      .from('households')
      .select('premium_until')
      .eq('id', profile.household_id)
      .single();

    if (!householdError && household && household.premium_until) {
      // Сравниваем дату окончания премиума с текущим временем
      const premiumDate = new Date(household.premium_until);
      const now = new Date();
      isPremium = premiumDate > now; // true, если премиум еще активен
    }
  }

  // Возвращаем данные, которые автоматически станут доступны во всех файлах +page.svelte
  return {
    session,
    profile: profile || null,
    isPremium
  };
}