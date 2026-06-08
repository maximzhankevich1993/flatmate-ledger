/** @type {import('./$types').PageServerLoad} */
export async function load({ parent, locals }) {
  // 1. Забираем профиль пользователя, загруженный в родительском +layout.server.js
  const { profile } = await parent();

  // Если у пользователя по какой-то причине нет привязки к дому, отдаем дефолтные нули
  if (!profile || !profile.household_id) {
    return {
      leaderboard: [],
      totalSpent: 0,
      activeChoresCount: 0,
    };
  }

  const householdId = profile.household_id;

  // 2. ЗАПРОС 1: Считаем общую сумму расходов этого дома
  const { data: expenses, error: expensesError } = await locals.supabase
    .from('expenses')
    .select('amount')
    .eq('household_id', householdId);

  if (expensesError) console.error('Error fetching dashboard expenses:', expensesError.message);
  
  const totalSpent = expenses ? expenses.reduce((sum, exp) => sum + Number(exp.amount), 0) : 0;

  // 3. ЗАПРОС 2: Считаем количество активных (невыполненных) задач
  const { count: activeChoresCount, error: choresCountError } = await locals.supabase
    .from('chores')
    .select('*', { count: 'exact', head: true })
    .eq('household_id', householdId)
    .eq('is_done', false);

  if (choresCountError) console.error('Error counting active chores:', choresCountError.message);

  // 4. ЗАПРОС 3: Формируем лидерборд сожителей (сортировка по XP)
  const { data: leaderboard, error: leaderboardError } = await locals.supabase
    .from('profiles')
    .select('username, points')
    .eq('household_id', householdId)
    .order('points', { ascending: false });

  if (leaderboardError) console.error('Error fetching leaderboard:', leaderboardError.message);

  // Возвращаем чистые агрегированные данные прямо в интерфейс +page.svelte
  return {
    leaderboard: leaderboard || [],
    totalSpent,
    activeChoresCount: activeChoresCount || 0,
  };
}