/** @type {import('./$types').PageServerLoad} */
export async function load({ parent, locals }) {
  // 1. Извлекаем глобальный профиль пользователя из родительского layout
  const { profile } = await parent();

  // Защита на случай, если профиль не прогрузился
  if (!profile || !profile.household_id) {
    return {
      expenses: [],
    };
  }

  // 2. Делаем запрос к Supabase: вытягиваем тратты этого дома
  // Используем связку 'profiles(username)', чтобы вместо ID сожителя сразу получить его понятное имя
  const { data: expenses, error } = await locals.supabase
    .from('expenses')
    .select(`
      id,
      description,
      amount,
      category,
      created_at,
      profiles (
        username
      )
    `)
    .eq('household_id', profile.household_id)
    .order('created_at', { ascending: false }); // Свежие траты всегда сверху

  if (error) {
    console.error('Error loading expenses stream:', error.message);
  }

  // Возвращаем массив расходов в интерфейс +page.svelte
  return {
    expenses: expenses || [],
  };
}