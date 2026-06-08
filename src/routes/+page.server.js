/** @type {import('./$types').PageServerLoad} */
export async function load({ parent, locals }) {
  // Вытаскиваем живой профиль сожителя, который спас нам hooks.server.js
  const { profile } = await parent();

  // Если профиля или дома нет — отдаем по нулям безопасно
  if (!profile || !profile.household_id) {
    return {
      leaderboard: [],
      totalSpent: 0,
      activeChoresCount: 0
    };
  }

  const currentHouseholdId = profile.household_id;

  // 1. Загружаем сожителей для Лидерборда (динамическая сортировка по XP очкам)
  const { data: leaderboard, error: leaderError } = await locals.supabase
    .from('profiles')
    .select('username, points')
    .eq('household_id', currentHouseholdId)
    .order('points', { ascending: false });

  if (leaderError) console.error('Leaderboard fetch error:', leaderError);

  // 2. Считаем общую сумму трат именно нашего дома для Bento-карточки
  const { data: expenses, error: expError } = await locals.supabase
    .from('expenses')
    .select('amount')
    .eq('household_id', currentHouseholdId);

  if (expError) console.error('Expenses statistics error:', expError);
  const totalSpent = expenses ? expenses.reduce((sum, e) => sum + Number(e.amount), 0) : 0;

  // 3. Считаем количество только активных (невыполненных) задач в доме
  const { data: chores, error: choresError } = await locals.supabase
    .from('chores')
    .select('id')
    .eq('household_id', currentHouseholdId)
    .eq('is_done', false);

  if (choresError) console.error('Chores statistics error:', choresError);
  const activeChoresCount = chores ? chores.length : 0;

  return {
    leaderboard: leaderboard || [],
    totalSpent: totalSpent,
    activeChoresCount: activeChoresCount
  };
}