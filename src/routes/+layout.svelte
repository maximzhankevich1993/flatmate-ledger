<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { invalidateAll } from '$app/navigation';
  import '../app.css'; // Подключаем наши кастомные неоновые стили

  export let data;
  $: ({ session } = data);

  onMount(() => {
    // Слушаем изменения состояния авторизации (вход, выход, обновление токена)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        // Если сессия изменилась — перезапускаем все серверные загрузчики (+page.server.js)
        invalidateAll();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<slot />