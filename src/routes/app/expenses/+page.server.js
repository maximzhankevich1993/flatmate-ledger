/** @type {import('./$types').PageServerLoad} */
export async function load({ parent, locals }) {
  // Занимаем профиль из родительского +layout.server.js
  const { profile } = await parent();

  // Если юзер каким-то чудом проскочил без дома, отдаем пустой массив
  if (!profile || !profile.household_id) {
    return { expenses: [] };
  }

  // Тянем расходы только нашего дома + через JOIN забираем имя того, кто оплатил чек
  const { data: expenses, error } = await locals.supabase
    .from('expenses')
    .select(`
      id,
      description,
      amount,
      tag,
      created_at,
      paid_by,
      profiles ( username )
    `)
    .eq('household_id', profile.household_id)
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching filtered expenses:', error);

  return {
    expenses: expenses || []
  };
}