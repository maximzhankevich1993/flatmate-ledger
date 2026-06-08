import { supabase } from '$lib/supabaseClient';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // Тот же захардкоженный ID дома для бесшовной синхронизации модулей в MVP
  const targetHouseholdId = "99999999-9999-9999-9999-999999999999"; 

  // 1. Запрашиваем список обязанностей с именем ответственного сожителя
  const { data: rawChores, error: choresError } = await supabase
    .from('chores')
    .select(`
      id,
      title,
      points,
      due_date,
      is_done,
      profiles ( username )
    `)
    .eq('household_id', targetHouseholdId)
    .order('is_done', { ascending: true }) // Сначала активные задачи, выполненные — вниз
    .order('created_at', { ascending: false });

  if (choresError) {
    console.error('Error fetching chores:', choresError);
  }

  // 2. Подтягиваем баланс XP очков для текущего пользователя из профиля
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('points')
    .eq('household_id', targetHouseholdId)
    .limit(1)
    .single(); // Берем один профиль для симуляции авторизованного юзера

  if (profileError) {
    console.error('Error fetching user points:', profileError);
  }

  return {
    chores: rawChores || [],
    userPoints: profileData?.points || 0
  };
}