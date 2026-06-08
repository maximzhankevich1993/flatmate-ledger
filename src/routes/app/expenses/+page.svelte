<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { invalidateAll } from '$app/navigation';

  // Принимаем данные с сервера
  export let data;
  $: ({ expenses, profile } = data);

  // Состояние формы новой траты
  let description = '';
  let amount = '';
  let category = 'Groceries';
  let loading = false;

  // Функция отправки новой траты в базу данных
  async function handleAddExpense() {
    if (!description.trim() || !amount || loading) return;
    loading = true;

    const { error } = await supabase
      .from('expenses')
      .insert([{
        household_id: profile.household_id,
        user_id: profile.id,
        description: description.trim(),
        amount: Number(amount),
        category: category
      }]);

    if (!error) {
      description = '';
      amount = '';
      await invalidateAll(); // Реактивно обновляем списки без перезагрузки страницы
    } else {
      alert('Error adding expense: ' + error.message);
    }
    loading = false;
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 relative overflow-hidden">
  
  <div class="absolute top-[-5%] right-[-10%] w-96 h-96 bg-cyber-green/10 rounded-full blur-[130px] animate-ambient-glow pointer-events-none z-0"></div>
  <div class="absolute bottom-[15%] left-[-10%] w-96 h-96 bg-zinc-800/20 rounded-full blur-[120px] animate-ambient-glow pointer-events-none z-0" style="animation-delay: -3s;"></div>

  <div class="relative z-10 max-w-4xl mx-auto">
    
    <header class="mb-8">
      <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Financial Protocol</span>
      <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Shared Ledger 💳</h1>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <form on:submit|preventDefault={handleAddExpense} class="lg:col-span-5 p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl space-y-4">
        <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Log New Transaction</h2>

        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="exp-desc">Item or Service</label>
          <input 
            id="exp-desc"
            type="text" 
            bind:value={description}
            placeholder="E.g., WiFi Subscription" 
            required
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-green/40 transition-colors placeholder-zinc-700"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="exp-amount">Cost (USD)</label>
          <input 
            id="exp-amount"
            type="number" 
            step="0.01"
            min="0.01"
            bind:value={amount}
            placeholder="0.00" 
            required
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono font-bold text-cyber-green focus:outline-none focus:border-cyber-green/40 transition-colors placeholder-zinc-800"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="exp-cat">Classification Cluster</label>
          <select 
            id="exp-cat"
            bind:value={category}
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-green/40 transition-colors"
          >
            <option value="Groceries">Groceries 🍏</option>
            <option value="Rent & Bills">Rent & Bills 🏠</option>
            <option value="Subscribed Services">Subscriptions 📺</option>
            <option value="Household Goods">Household Goods 🧼</option>
            <option value="Other">Other ⚡</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          class="w-full py-3 bg-cyber-green text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer border-none shadow-neon-green/20"
        >
          {loading ? 'Processing...' : 'Broadcast to Ledger'}
        </button>
      </form>

      <div class="lg:col-span-7 space-y-3 w-full">
        <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">Operational Live Stream</h2>

        <div class="space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {#if expenses.length === 0}
            <p class="text-xs text-zinc-600 py-8 text-center font-medium bg-cyber-card/10 rounded-2xl border border-white/[0.02]">Ledger stream is completely blank. No payments recorded.</p>
          {:else}
            {#each expenses as exp}
              <div class="flex justify-between items-center p-4 bg-cyber-card/30 border border-white/[0.05] hover:border-white/10 rounded-2xl transition-all">
                <div>
                  <h3 class="text-sm font-bold text-zinc-200">{exp.description}</h3>
                  <p class="text-[10px] text-zinc-500 font-medium mt-0.5">
                    Paid by <strong class="text-zinc-400">{exp.profiles?.username || 'Unknown Agent'}</strong> • 
                    <span class="px-1.5 py-0.5 rounded bg-white/5 border border-white/[0.03] text-zinc-400">{exp.category}</span>
                  </p>
                </div>
                
                <span class="text-sm font-black font-mono text-cyber-green bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-white/5">
                  ${Number(exp.amount).toFixed(2)}
                </span>
              </div>
            {/each}
          {/if}
        </div>
      </div>

    </div>
  </div>

  <BottomNav />

</div>