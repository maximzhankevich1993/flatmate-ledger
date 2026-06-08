<script>
  import '../app.css'; // Твои глобальные стили Tailwind
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;
  $: ({ supabase, session } = data);

  onMount(() => {
    // Подписываемся на изменения состояния авторизации (например, если токен протухнет)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        // Перезапускает все серверные функции load() на текущем экране для обновления данных
        invalidate('supabase:auth');
      }
    });

    return () => subscription.unsubscribe();
  });
</script>

<div class="min-h-screen w-full bg-zinc-950 font-sans antialiased text-white selection:bg-cyber-orange/30 selection:text-white">
  
  <slot />

</div>