import { supabase } from '$lib/supabaseClient';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // Наш MVP-идентификатор дома
  const targetHouseholdId = "99999999-9999-9999-9999-999999999999";

  // 1. Загружаем сожителей для Лидерборда (сортировка по XP очкам)
  const { data: leaderboard, error: leaderError } = await supabase
    .from('profiles')
    .select('username, points')
    .eq('household_id', targetHouseholdId)
    .order('points', { ascending: false });

  if (leaderError) console.error('Leaderboard error:', leaderError);

  // 2. Считаем общую сумму трат дома для Bento-карточки
  const { data: expenses, error: expError } = await supabase
    .from('expenses')
    .select('amount')
    .eq('household_id', targetHouseholdId);

  if (expError) console.error('Expenses stats error:', expError);
  const totalSpent = expenses ? expenses.reduce((sum, e) => sum + Number(e.amount), 0) : 0;

  // 3. Считаем количество горящих задач
  const { data: chores, error: choresError } = await supabase
    .from('chores')
    .select('id')
    .eq('household_id', targetHouseholdId)
    .eq('is_done', false);

  if (choresError) console.error('Chores stats error:', choresError);
  const activeChoresCount = chores ? chores.length : 0;

  return {
    leaderboard: leaderboard || [],
    totalSpent: totalSpent,
    activeChoresCount: activeChoresCount
  };
}