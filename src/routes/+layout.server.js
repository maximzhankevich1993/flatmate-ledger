/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  // Забираем сессию, которую бережно подготовил наш hooks.server.js
  const { session } = await locals.safeGetSession();
  
  if (!session) {
    return { session: null, profile: null };
  }

  // Тянем из базы профиль сожителя вместе с данными его дома
  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('id, username, points, household_id')
    .eq('id', session.user.id)
    .single();

  return {
    session,
    profile: profile || null
  };
}