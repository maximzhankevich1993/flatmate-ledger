<script>
  import QuickInput from '$lib/components/ledger/QuickInput.svelte';
  import BottomNav from '$lib/components/ui/BottomNav.svelte';

  // Принимаем реальные данные, прилетевшие из +page.server.js
  export let data;

  // Деструктуризируем реактивные переменные из дата-пакета
  $: ({ balances, expenses, optimizedTransfers } = data);
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24">
  
  <!-- ЗАГОЛОВОК СТРАНИЦЫ -->
  <header class="max-w-5xl mx-auto mb-8">
    <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Shared Finances</span>
    <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">House Ledger 💳</h1>
  </header>

  <!-- КРОСС-ПЛАТФОРМЕННЫЙ ИНТЕРФЕЙС -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
    
    <!-- ЛЕВАЯ ЧАСТЬ: Калькулятор + Карта оптимизации долгов -->
    <div class="lg:col-span-5 w-full space-y-6">
      <QuickInput />

      <!-- БЛОК УМНОГО СХЛОПЫВАНИЯ ДОЛГОВ (AI Smart Settlement) -->
      <div class="p-6 bg-gradient-to-b from-cyber-card/80 to-zinc-950/40 border border-cyber-orange/20 rounded-3xl backdrop-blur-xl shadow-neon-orange/10">
        <h3 class="text-xs font-bold text-cyber-orange uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <span class="animate-pulse">⚡</span> Smart Debt Settlement
        </h3>

        {#if optimizedTransfers.length === 0}
          <p class="text-xs text-zinc-500 font-medium">All settled up! No transactions needed right now.</p>
        {:else}
          <div class="space-y-2.5">
            {#each optimizedTransfers as transfer}
              <div class="p-3 bg-zinc-950/60 border border-white/[0.02] rounded-xl text-xs flex justify-between items-center">
                <div class="text-zinc-300">
                  <span class="font-black text-white">{transfer.from_name}</span>
                  <span class="text-zinc-500"> owes </span>
                  <span class="font-black text-cyber-amber">{transfer.to_name}</span>
                </div>
                <span class="font-mono font-black text-cyber-green bg-cyber-green/5 px-2.5 py-1 rounded-lg border border-cyber-green/10">
                  ${transfer.amount}
                </span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- ПРАВАЯ ЧАСТЬ: Реальная история транзакций из Supabase -->
    <div class="lg:col-span-7 w-full p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl">
      <div class="flex justify-between items-center mb-5">
        <div>
          <h2 class="text-sm font-bold text-white uppercase tracking-wider">Recent Shared Expenses</h2>
          <p class="text-[11px] text-zinc-500 mt-0.5">Real-time data synced directly from Supabase</p>
        </div>
      </div>

      <!-- СПИСОК ТРАНЗАКЦИЙ -->
      <div class="space-y-3">
        {#if expenses.length === 0}
          <p class="text-xs text-zinc-600 text-center py-10 font-medium">No expenses recorded yet. Open the ledger above!</p>
        {:else}
          {#each expenses as item}
            <div class="flex justify-between items-center p-4 bg-zinc-950/40 border border-white/[0.02] rounded-2xl transition-all hover:border-white/[0.08] group">
              
              <div class="flex items-center gap-3.5">
                <!-- Аватар на основе первой буквы имени из связанного профиля -->
                <div class="w-10 h-10 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col items-center justify-center">
                  <span class="text-[10px] font-black text-zinc-400 uppercase">
                    {item.profiles?.username?.slice(0,2) || '??'}
                  </span>
                </div>
                
                <div>
                  <h4 class="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{item.description}</h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[10px] font-medium text-cyber-amber">{item.tag}</span>
                    <span class="text-[10px] text-zinc-600">• Paid by {item.profiles?.username || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <span class="text-sm font-black text-white">${Number(item.amount).toFixed(2)}</span>
                <span class="block text-[9px] text-zinc-500 font-medium mt-0.5">
                  {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>

            </div>
          {/each}
        fi}
      </div>

    </div>
  </div>

  <!-- МЕНЮ НАВИГАЦИИ -->
  <BottomNav />

</div>