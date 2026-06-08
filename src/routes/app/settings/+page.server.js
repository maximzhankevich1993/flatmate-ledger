/** @type {import('./$types').PageServerLoad} */
export async function load({ parent, locals }) {
  // Забираем профиль из родительского лейаута
  const { profile } = await parent();

  if (!profile || !profile.household_id) {
    return { household: null };
  }

  // Вытягиваем данные о доме сожителя
  const { data: household, error } = await locals.supabase
    .from('households')
    .select('name, invite_code')
    .eq('id', profile.household_id)
    .single();

  if (error) console.error('Error fetching household settings:', error);

  return {
    household: household || null
  };
}