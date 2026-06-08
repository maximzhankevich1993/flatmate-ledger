/** @type {import('./$types').PageServerLoad} */
export async function load({ parent, locals }) {
  // Наследуем живой профиль авторизованного юзера
  const { profile } = await parent();

  if (!profile || !profile.household_id) {
    return { chores: [], roommates: [] };
  }

  // 1. Тянем все задачи этого дома + JOIN имени исполнителя
  const { data: chores, error: choresError } = await locals.supabase
    .from('chores')
    .select(`
      id,
      title,
      points,
      due_date,
      is_done,
      assignee_id,
      profiles ( username )
    `)
    .eq('household_id', profile.household_id)
    .order('is_done', { ascending: true }) // Сначала невыполненные
    .order('created_at', { ascending: false });

  if (choresError) console.error('Error fetching chores:', choresError);

  // 2. Тянем список сожителей для выпадающего меню в форме
  const { data: roommates, error: roommatesError } = await locals.supabase
    .from('profiles')
    .select('id, username')
    .eq('household_id', profile.household_id);

  if (roommatesError) console.error('Error fetching roommates for chores:', roommatesError);

  return {
    chores: chores || [],
    roommates: roommates || []
  };
}