<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import GlassCard from '$lib/components/ui/GlassCard.svelte';

  // Принимаем живые данные от сервера
  export let data;

  $: ({ leaderboard, totalSpent, activeChoresCount } = data);
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24">
  
  <!-- ХЕДЕР С ПРИВЕТСТВИЕМ -->
  <header class="max-w-5xl mx-auto mb-10">
    <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Cyber Household Ledger</span>
    <h1 class="text-4xl font-black tracking-tight text-white mt-1">Neon Citadel 🌌</h1>
    <p class="text-xs text-zinc-400 mt-1">Welcome back, vibe coder. Here is your house state.</p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto items-start">
    
    <!-- ЛЕВАЯ СЕКЦИЯ: Bento-сетка статистики (7 колонок) -->
    <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      
      <!-- Главная 3D GlassCard баланса (на всю ширину левой секции) -->
      <div class="sm:col-span-2">
        <GlassCard />
      </div>

      <!-- Bento Блок 1: Сумма общих трат дома -->
      <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl relative overflow-hidden group">
        <div class="absolute -bottom-6 -right-6 w-20 h-20 bg-cyber-green/10 rounded-full blur-xl group-hover:bg-cyber-green/20 transition-all"></div>
        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Total Pool Spent</span>
        <h3 class="text-2xl font-black text-white font-mono">${totalSpent.toFixed(2)}</h3>
        <p class="text-[11px] text-cyber-green mt-2 font-medium">Synced from Ledger →</p>
      </div>

      <!-- Bento Блок 2: Горящие задачи -->
      <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl relative overflow-hidden group">
        <div class="absolute -bottom-6 -right-6 w-20 h-20 bg-cyber-orange/10 rounded-full blur-xl group-hover:bg-cyber-orange/20 transition-all"></div>
        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Active Duties</span>
        <h3 class="text-2xl font-black text-white font-mono">{activeChoresCount} Chores</h3>
        <p class="text-[11px] text-cyber-orange mt-2 font-medium">Awaiting completion →</p>
      </div>

    </div>

    <!-- ПРАВАЯ СЕКЦИЯ: Игровой Лидерборд сожителей (5 колонок) -->
    <div class="lg:col-span-5 w-full p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl">
      <div class="mb-5">
        <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          🏆 House Leaderboard
        </h2>
        <p class="text-[11px] text-zinc-500 mt-0.5">Earn XP by completing tasks around the flat</p>
      </div>

      <!-- СПИСОК УЧАСТНИКОВ -->
      <div class="space-y-3">
        {#if leaderboard.length === 0}
          <p class="text-xs text-zinc-600 text-center py-6 font-medium">No roommates found.</p>
        {:else}
          {#each leaderboard as member, index}
            <div class="flex justify-between items-center p-3.5 bg-zinc-950/40 border border-white/[0.02] rounded-2xl relative group">
              
              <div class="flex items-center gap-3">
                <!-- Место в топе -->
                <span class="w-5 font-mono text-xs font-black text-center
                  {index === 0 ? 'text-cyber-amber text-sm' : index === 1 ? 'text-zinc-400' : 'text-zinc-600'}"
                >
                  #{index + 1}
                </span>

                <!-- Имя пользователя -->
                <span class="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                  {member.username}
                </span>
              </div>

              <!-- Его XP очки -->
              <span class="text-xs font-black px-2.5 py-1 bg-zinc-900/60 rounded-xl border border-white/5 text-cyber-amber font-mono">
                {member.points} XP
              </span>

            </div>
          {/each}
        {/if}
      </div>

    </div>
  </div>

  <!-- ОГНЕННЫЙ ТАББАР -->
  <BottomNav />

</div>