/** @type {import('./$types').PageServerLoad} */
export async function load({ parent, locals }) {
  // 1. Получаем профиль текущего пользователя из родительского layout
  const { profile } = await parent();

  // Защита, если профиль не загрузился
  if (!profile || !profile.household_id) {
    return {
      inviteCode: 'NOT_ASSIGNED'
    };
  }

  // 2. Запрашиваем из базы код приглашения (invite_code) именно для этого дома
  const { data: household, error } = await locals.supabase
    .from('households')
    .select('invite_code')
    .eq('id', profile.household_id)
    .single();

  if (error) {
    console.error('Error loading household invite code:', error.message);
  }

  // Передаем инвайт-код на фронтенд страницы настроек
  return {
    inviteCode: household ? household.invite_code : 'NOT_ASSIGNED'
  };
}