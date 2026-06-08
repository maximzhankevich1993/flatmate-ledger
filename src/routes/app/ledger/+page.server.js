import { supabase } from '$lib/supabaseClient';
import { simplifyDebts } from '$lib/utils/debtSimplifier';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // Для MVP захардкодим тестовый ID дома, который мы создадим при первом запуске.
  // В полноценном продакшене этот ID будет динамически подтягиваться из сессии авторизованного юзера.
  const targetHouseholdId = "99999999-9999-9999-9999-999999999999"; 

  // 1. Запрашиваем балансы сожителей из нашей умной SQL-view
  const { data: rawBalances, error: balanceError } = await supabase
    .from('household_balances')
    .select('profile_id, username, net_balance')
    .eq('household_id', targetHouseholdId);

  if (balanceError) {
    console.error('Error fetching balances:', balanceError);
  }

  // 2. Запрашиваем лог последних расходов (с авто-джоином имени того, кто заплатил)
  const { data: rawExpenses, error: expenseError } = await supabase
    .from('expenses')
    .select(`
      id,
      description,
      amount,
      tag,
      created_at,
      profiles ( username )
    `)
    .eq('household_id', targetHouseholdId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (expenseError) {
    console.error('Error fetching expenses:', expenseError);
  }

  // 3. Магия: Пропускаем сырые балансы из базы через наш алгоритм оптимизации цепочек
  const optimizedTransfers = rawBalances ? simplifyDebts(rawBalances) : [];

  // Возвращаем всё это добро на фронтенд
  return {
    balances: rawBalances || [],
    expenses: rawExpenses || [],
    optimizedTransfers: optimizedTransfers
  };
}