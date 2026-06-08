<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { tilt } from '$lib/actions/tilt';
  import { fade } from 'svelte/transition';

  // Получаем данные от сервера (+page.server.js и глобального layout)
  export let data;
  $: ({ profile, stats, leaderboard, isPremium } = data);

  // Подсчет процентов для аналитики (Premium-фича)
  $: totalExpenses = stats?.expensesSum || 0;
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 relative overflow-hidden">
  
  <!-- ДИНАМИЧЕСКИЙ ЭМБИЕНТ-БЭКГРАУНД -->
  <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-zinc-800/10 rounded-full blur-[130px] animate-ambient-glow pointer-events-none z-0"></div>
  <div class="absolute bottom-[-10%] left-[-10%] w-96 h-96 {#if isPremium}bg-cyber-amber/10{:else}bg-cyber-orange/5{/if} rounded-full blur-[140px] animate-ambient-glow pointer-events-none z-0" style="animation-delay: -6s;"></div>

  <div class="relative z-10 max-w-xl mx-auto space-y-6">
    
    <!-- ХЕДЕР -->
    <header class="flex items-center justify-between mb-2">
      <div>
        <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Operational Hub</span>
        <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Citadel Grid 🪐</h1>
      </div>
      <div class="text-right">
        <span class="text-[9px] font-mono font-black text-cyber-orange uppercase tracking-wider block">Operator</span>
        <span class="text-sm font-bold text-zinc-300">{profile?.username || 'Unknown'}</span>
      </div>
    </header>

    <!-- ИНТЕРАКТИВНАЯ КАРТОЧКА БАЛАНСА С 3D-TILT -->
    <div 
      use:tilt={{ max: 12, speed: 400 }}
      class="p-6 bg-gradient-to-br {#if isPremium}from-zinc-900 via-zinc-900 to-cyber-amber/20 border-cyber-amber/30 shadow-neon-amber/10{:else}from-cyber-card/60 to-cyber-card/20 border-white/[0.06]{/if} border backdrop-blur-xl rounded-3xl relative overflow-hidden group transition-all duration-300"
    >
      <div class="absolute -right-6 -bottom-6 text-9xl opacity-5 font-black select-none pointer-events-none">CORE</div>
      
      <div class="flex justify-between items-start">
        <div>
          <p class="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">Monthly House Ledger</p>
          <h2 class="text-4xl font-black text-white mt-2 tracking-tight">
            ${totalExpenses.toFixed(2)}
          </h2>
        </div>
        <div class="bg-zinc-950/60 border border-white/5 px-3 py-1.5 rounded-xl text-center">
          <span class="text-[9px] font-mono text-zinc-500 uppercase block">Active Chores</span>
          <span class="text-sm font-black text-cyber-orange">{stats?.activeChoresCount || 0}</span>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-white/[0.04] flex justify-between text-xs text-zinc-400 font-mono">
        <span>System Status: <strong class="text-cyber-green">ONLINE</strong></span>
        {#if isPremium}
          <span class="text-cyber-amber font-bold">💎 PREMIUM PROTOCOL</span>
        {:else}
          <span>Standard Access</span>
        {/if}
      </div>
    </div>

    <!-- PREMIUM ФИЧА: ВИЗУАЛЬНАЯ АНАЛИТИКА ТРАТ -->
    <div class="p-5 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-xs font-mono font-black text-zinc-400 uppercase tracking-wider">Sector Budget Analytics</h3>
        {#if !isPremium}
          <span class="text-[9px] font-bold bg-cyber-amber/10 border border-cyber-amber/30 text-cyber-amber px-2 py-0.5 rounded uppercase font-mono">Premium</span>
        {/if}
      </div>

      {#if isPremium}
        <!-- Лоск: Красивые прогресс-бары для Премиум пользователей -->
        <div class="space-y-3 font-mono text-xs" in:fade>
          <div>
            <div class="flex justify-between text-zinc-400 mb-1">
              <span>Groceries & Food</span>
              <span class="text-white font-bold">55%</span>
            </div>
            <div class="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
              <div class="h-full bg-cyber-orange rounded-full" style="width: 55%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-zinc-400 mb-1">
              <span>Utilities & Rent</span>
              <span class="text-white font-bold">30%</span>
            </div>
            <div class="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
              <div class="h-full bg-cyber-amber rounded-full" style="width: 30%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-zinc-400 mb-1">
              <span>Household Supplies</span>
              <span class="text-white font-bold">15%</span>
            </div>
            <div class="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
              <div class="h-full bg-zinc-600 rounded-full" style="width: 15%"></div>
            </div>
          </div>
        </div>
      {:else}
        <!-- Завлекалочка: Размытый демо-блок для обычных юзеров -->
        <div class="relative py-4 text-center">
          <div class="filter blur-sm select-none opacity-20 space-y-2 pointer-events-none">
            <div class="h-3 bg-white rounded w-full"></div>
            <div class="h-3 bg-white rounded w-3/4"></div>
          </div>
          <div class="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <p class="text-xs text-zinc-300 font-bold">Unlock smart expense categorization</p>
            <p class="text-[10px] text-zinc-500">Upgrade to Premium to visualize your house spending habits.</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- ЛИДЕРБОРД (РЕЙТИНГ СОЖИТЕЛЕЙ) -->
    <div class="p-5 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl space-y-4">
      <h3 class="text-xs font-mono font-black text-zinc-400 uppercase tracking-wider">Household Leaderboard (XP)</h3>
      
      <div class="space-y-2.5">
        {#each leaderboard as user, index}
          <div class="flex items-center justify-between p-3.5 bg-zinc-950/40 border border-white/[0.03] rounded-2xl relative group">
            <div class="flex items-center gap-3.5">
              <!-- Позиция в топе -->
              <span class="font-mono text-xs font-black w-4 text-center
                {index === 0 ? 'text-cyber-amber' : index === 1 ? 'text-zinc-400' : 'text-zinc-600'}">
                #{index + 1}
              </span>
              
              <!-- Аватарка (С неоновым свечением, если сектор премиумный) -->
              <div class="w-9 h-9 rounded-xl bg-zinc-900 border flex items-center justify-center text-sm shadow-inner transition-all
                {isPremium ? 'border-cyber-amber/50 shadow-neon-amber/20 animate-pulse' : 'border-white/5'}">
                {index === 0 ? '👑' : '🤖'}
              </div>
              
              <!-- Имя -->
              <span class="text-sm font-black {user.id === profile?.id ? 'text-cyber-orange' : 'text-zinc-200'}">
                {user.username}
                {#if user.id === profile?.id}
                  <span class="text-[9px] font-mono font-bold text-zinc-600 ml-1">(You)</span>
                {/if}
              </span>
            </div>

            <!-- Кол-во XP -->
            <div class="font-mono text-xs font-black text-zinc-400 bg-zinc-950/80 px-2.5 py-1 rounded-xl border border-white/[0.02]">
              {user.points} <span class="text-[9px] text-zinc-600 font-bold">XP</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

  </div>

  <!-- МЕНЮ НАВИГАЦИИ -->
  <BottomNav />

</div>