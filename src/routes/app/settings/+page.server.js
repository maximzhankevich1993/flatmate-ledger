import { supabase } from '$lib/supabaseClient';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const targetHouseholdId = "99999999-9999-9999-9999-999999999999";

  // 1. Получаем данные о самом доме (Имя и Код приглашения)
  const { data: household, error: houseError } = await supabase
    .from('households')
    .select('name, invite_code')
    .eq('id', targetHouseholdId)
    .single();

  if (houseError) console.error('Error fetching household settings:', houseError);

  // 2. Получаем список всех жильцов для управления комнатой
  const { data: roommates, error: roommatesError } = await supabase
    .from('profiles')
    .select('id, username, created_at')
    .eq('household_id', targetHouseholdId);

  if (roommatesError) console.error('Error fetching roommates list:', roommatesError);

  return {
    household: household || { name: "Cyber Apartment", invite_code: "ERROR-CODE" },
    roommates: roommates || []
  };
}