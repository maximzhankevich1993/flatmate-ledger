/** @type {import('./$types').PageServerLoad} */
export async function load({ parent, locals }) {
  // 1. Получаем профиль текущего пользователя
  const { profile } = await parent();

  // Защитный барьер, если структуры дома нет
  if (!profile || !profile.household_id) {
    return {
      chores: [],
      roommates: []
    };
  }

  const householdId = profile.household_id;

  // 2. ЗАПРОС 1: Тянем все задачи этого сектора (сначала невыполненные, затем свежие)
  const { data: chores, error: choresError } = await locals.supabase
    .from('chores')
    .select(`
      id,
      title,
      points,
      due_date,
      is_done,
      assignee_id,
      profiles (
        username
      )
    `)
    .eq('household_id', householdId)
    .order('is_done', { ascending: true }) // Сначала активные задачи
    .order('created_at', { ascending: false }); // Внутри групп — самые свежие сверху

  if (choresError) console.error('Error loading chores grid:', choresError.message);

  // 3. ЗАПРОС 2: Получаем список всех жильцов этого дома для селекта в форме
  const { data: roommates, error: roommatesError } = await locals.supabase
    .from('profiles')
    .select('id, username')
    .eq('household_id', householdId);

  if (roommatesError) console.error('Error loading roommates list:', roommatesError.message);

  // Возвращаем данные в интерфейс +page.svelte
  return {
    chores: chores || [],
    roommates: roommates || []
  };
}