<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { invalidateAll } from '$app/navigation';

  export let data;
  $: ({ expenses, profile, roommates, isPremium } = data);

  // Стейт формы
  let description = '';
  let amount = '';
  let category = 'Groceries';
  let splitMode = 'equal'; // 'equal' или 'custom'
  let customPercentage = 50; // Процент для создателя транзакции, остальное сожителю
  let isSubmitting = false;

  // Рассчет долей для превью
  $: currentAmount = Number(amount) || 0;
  $: myShare = splitMode === 'equal' ? (currentAmount / 2) : (currentAmount * (customPercentage / 100));
  $: theirShare = currentAmount - myShare;

  async function handleAddExpense(e) {
    e.preventDefault();
    if (!description || !amount || isSubmitting) return;

    isSubmitting = true;

    // Вычисляем финальную сумму, которую сожители должны создателю
    // Если делим поровну — они должны половину. Если кастомно — они должны их долю (theirShare)
    const finalOwedAmount = splitMode === 'equal' ? (Number(amount) / 2) : theirShare;

    const { error } = await supabase.from('expenses').insert([{
      description,
      amount: Number(amount),
      category,
      payer_id: profile.id,
      household_id: profile.household_id,
      owed_amount: finalOwedAmount
    }]);

    if (!error) {
      description = '';
      amount = '';
      splitMode = 'equal';
      await invalidateAll();
    } else {
      alert('Error adding expense: ' + error.message);
    }
    isSubmitting = false;
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 relative overflow-hidden">
  
  <!-- ДИНАМИЧЕСКИЙ ЭМБИЕНТ-БЭКГРАУНД -->
  <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-zinc-800/10 rounded-full blur-[130px] animate-ambient-glow pointer-events-none z-0"></div>
  <div class="absolute bottom-[-10%] left-[-10%] w-96 h-96 {#if isPremium}bg-cyber-amber/10{:else}bg-cyber-orange/5{/if} rounded-full blur-[140px] animate-ambient-glow pointer-events-none z-0" style="animation-delay: -1s;"></div>

  <div class="relative z-10 max-w-xl mx-auto space-y-6">
    
    <!-- ХЕДЕР -->
    <header class="mb-4">
      <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Financial Core</span>
      <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Ledger Grid 💳</h1>
    </header>

    <!-- ФОРМА ДОБАВЛЕНИЯ ТРАТ -->
    <div class="p-5 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl">
      <h3 class="text-xs font-mono font-black text-zinc-400 uppercase tracking-wider mb-4">Log New Shared Expense</h3>
      
      <form on:submit={handleAddExpense} class="space-y-4">
        <div class="grid grid-cols-3 gap-3">
          <input 
            type="number" 
            step="0.01"
            placeholder="0.00" 
            bind:value={amount}
            required
            class="col-span-1 bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-cyber-orange/40 text-cyber-amber font-black placeholder-zinc-700 transition-all"
          />
          <input 
            type="text" 
            placeholder="What was bought? (e.g., Wifi Bill)" 
            bind:value={description}
            required
            class="col-span-2 bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-orange/40 text-white placeholder-zinc-600 transition-all"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <select 
            bind:value={category}
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-cyber-orange/40 text-zinc-300 transition-all"
          >
            <option value="Groceries">🛒 Groceries</option>
            <option value="Utilities">⚡ Utilities</option>
            <option value="Rent">🏠 Rent & Living</option>
            <option value="Household">🧼 Supplies</option>
          </select>

          <!-- ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМА ДЕЛЕНИЯ (Взамен платному Splitwise) -->
          <select 
            bind:value={splitMode}
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-cyber-orange/40 text-zinc-300 transition-all"
          >
            <option value="equal">Split Equally (50/50)</option>
            <option value="custom">Custom Proportions</option>
          </select>
        </div>

        <!-- ДИНАМИЧЕСКИЙ СЛАЙДЕР ДЛЯ КАСТОМНОГО ДЕЛЕНИЯ -->
        {#if splitMode === 'custom'}
          <div class="p-3.5 bg-zinc-950/40 border border-white/[0.03] rounded-xl space-y-2">
            <div class="flex justify-between text-[11px] font-mono text-zinc-400">
              <span>Your Share: <strong class="text-white">{customPercentage}%</strong></span>
              <span>Roommates Share: <strong class="text-cyber-orange">{100 - customPercentage}%</strong></span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="90" 
              step="5"
              bind:value={customPercentage}
              class="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyber-orange"
            />
          </div>
        {/if}

        <!-- ЖИВОЕ ПРЕВЬЮ РАСЧЕТА (ЛОСК) -->
        {#if currentAmount > 0}
          <div class="p-3 bg-cyber-orange/5 border border-cyber-orange/10 rounded-xl flex justify-between items-center text-xs font-mono">
            <span class="text-zinc-400">You pay: <strong class="text-white">${myShare.toFixed(2)}</strong></span>
            <span class="text-zinc-400">They owe you: <strong class="text-cyber-amber">${theirShare.toFixed(2)}</strong></span>
          </div>
        {/if}

        <button 
          type="submit" 
          disabled={isSubmitting}
          class="w-full py-3 bg-cyber-orange hover:opacity-90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none disabled:opacity-40"
        >
          {isSubmitting ? 'Recording...' : 'Broadcast to Ledger'}
        </button>
      </form>
    </div>

    <!-- ИСТОРИЯ ТРАТ -->
    <div class="space-y-3">
      <h3 class="text-xs font-mono font-black text-zinc-400 uppercase tracking-wider px-1">Transaction History Stream</h3>
      
      {#if expenses.length === 0}
        <div class="p-8 text-center bg-cyber-card/20 border border-white/[0.04] rounded-3xl text-zinc-600 text-xs font-mono">
          No transactions logged in this sector.
        </div>
      {:else}
        <div class="space-y-2.5">
          {#each expenses as exp}
            <div class="p-4 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-2xl flex items-center justify-between">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white tracking-tight">{exp.description}</h4>
                <div class="flex items-center gap-2.5 text-[10px] font-mono text-zinc-500">
                  <span class="px-1.5 py-0.5 bg-zinc-950 rounded text-zinc-400">{exp.category}</span>
                  <span>Paid by: <strong class="text-zinc-300">{exp.profiles?.username || 'Unknown'}</strong></span>
                </div>
              </div>

              <div class="text-right font-mono">
                <div class="text-sm font-black text-white">${exp.amount.toFixed(2)}</div>
                <div class="text-[9px] text-zinc-500 mt-0.5">
                  {#if exp.payer_id === profile.id}
                    <span class="text-cyber-green">You collect ${exp.owed_amount?.toFixed(2)}</span>
                  {:else}
                    <span class="text-cyber-orange">You owe ${exp.owed_amount?.toFixed(2)}</span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

  </div>

  <BottomNav />
</div>