<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  // Получаем данные от сервера (+page.server.js и глобального лейаута)
  export let data;
  $: ({ profile, inviteCode } = data);

  let copied = false;

  // Функция для копирования инвайт-кода в буфер обмена смартфона
  async function copyInviteCode() {
    if (!inviteCode || inviteCode === 'NOT_ASSIGNED') return;
    
    try {
      await navigator.clipboard.writeText(inviteCode);
      copied = true;
      // Сбрасываем статус "Скопировано" через 3 секунды
      setTimeout(() => copied = false, 3000);
    } catch (err) {
      alert('Failed to copy code: ' + err);
    }
  }

  // Функция безопасного выхода из аккаунта (деструктуризация сессии)
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Серверный хук hooks.server.js автоматически перехватит этот момент и выбросит на /login
      goto('/login');
    } else {
      alert('Error signing out: ' + error.message);
    }
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 relative overflow-hidden">
  
  <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-zinc-800/10 rounded-full blur-[130px] animate-ambient-glow pointer-events-none z-0"></div>
  <div class="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-cyber-orange/5 rounded-full blur-[140px] animate-ambient-glow pointer-events-none z-0" style="animation-delay: -6s;"></div>

  <div class="relative z-10 max-w-xl mx-auto space-y-6">
    
    <header class="mb-8">
      <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">System Core</span>
      <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Control Panel ⚙️</h1>
    </header>

    <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
          👤
        </div>
        <div>
          <span class="text-[9px] font-mono font-black text-cyber-orange uppercase tracking-wider">Active Operator</span>
          <h2 class="text-xl font-black text-white mt-0.5">{profile?.username || 'Unknown User'}</h2>
        </div>
      </div>
      
      <div class="bg-zinc-950/50 border border-white/5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-cyber-amber">
        {profile?.points || 0} XP
      </div>
    </div>

    <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl space-y-4">
      <div>
        <h3 class="text-sm font-bold text-zinc-200">Sector Synchronization</h3>
        <p class="text-xs text-zinc-500 mt-1 leading-relaxed">
          Share this encrypted authorization key with your roommates. Entering this code during registration links their grid with your finances and chores.
        </p>
      </div>

      <div class="flex gap-2">
        <div class="flex-1 bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 font-mono text-sm font-black text-center tracking-widest text-zinc-300 flex items-center justify-center select-all">
          {inviteCode}
        </div>

        <button 
          on:click={copyInviteCode}
          type="button"
          class="px-5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer min-w-[110px]"
        >
          {#if copied}
            <span class="text-cyber-green">Copied!</span>
          {:else}
            Copy
          {/if}
        </button>
      </div>
    </div>

    <div class="pt-4">
      <button 
        on:click={handleLogout}
        type="button"
        class="w-full py-3.5 bg-zinc-950/80 hover:bg-red-950/20 border border-white/5 hover:border-red-900/30 text-zinc-400 hover:text-red-500 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
      >
        Terminate Session (Log Out)
      </button>
    </div>

  </div>

  <BottomNav />

</div>