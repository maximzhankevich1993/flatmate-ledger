import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

// Инициализируем приватный клиент Supabase с правами bypass RLS, 
// чтобы сервер мог обновить статус дома без авторизации юзера
const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE_KEY);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    // CryptoCloud присылает данные в формате x-www-form-urlencoded или JSON
    const contentType = request.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // 1. Проверяем статус заказа от CryptoCloud
    // 'success' или 'paid' (сверься со своим мерчантом, обычно приходит статус оплаты)
    if (data.status === 'success' || data.status === 'paid') {
      const householdId = data.order_id; // Мы передадим ID дома как ID заказа при создании счета

      if (!householdId) {
        return json({ error: 'Missing order_id (household_id)' }, { status: 400 });
      }

      // 2. Рассчитываем дату окончания Premium (например, +30 дней от текущего момента)
      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + 30);

      // 3. Обновляем запись в базе данных Supabase
      const { error } = await supabaseAdmin
        .from('households')
        .update({ premium_until: premiumUntil.toISOString() })
        .eq('id', householdId);

      if (error) {
        console.error('Webhook DB Update Error:', error.message);
        return json({ error: 'Failed to update database' }, { status: 500 });
      }

      console.log(`[CryptoCloud] Premium successfully activated for household: ${householdId}`);
      return new Response('OK', { status: 200 });
    }

    return json({ message: 'Status is not paid, skipping' }, { status: 200 });
  } catch (err) {
    console.error('Webhook Critical Error:', err.message);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}