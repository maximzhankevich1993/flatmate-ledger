<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { invalidateAll } from '$app/navigation';

  // Принимаем данные (expenses пришли от текущего load, а profile унаследован от лейаута)
  export let data;
  $: ({ expenses, profile } = data);

  // Состояние формы нового расхода
  let description = '';
  let amount = '';
  let tag = 'Grocery';
  let loading = false;

  // Посчитаем общую сумму пула на лету
  $: totalPool = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  // Функция отправки чека в Supabase
  async function handleAddExpense() {
    if (!description.trim() || !amount || loading) return;

    loading = true;

    const { error } = await supabase
      .from('expenses')
      .insert([{
        household_id: profile.household_id, // Берем из живого профиля
        paid_by: profile.id,               // Твой ID авторизации
        description: description.trim(),
        amount: parseFloat(amount),
        tag: tag
      }]);

    if (!error) {
      // Очищаем форму
      description = '';
      amount = '';
      // Заставляем SvelteKit перезапустить load() и обновить список на экране
      await invalidateAll();
    } else {
      alert('Database error: ' + error.message);
    }
    loading = false;
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24">
  
  <header class="max-w-4xl mx-auto mb-8 flex justify-between items-end">
    <div>
      <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Shared Ledger</span>
      <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Expenses 💳</h1>
    </div>
    <div class="px-4 py-2 bg-cyber-card/60 border border-white/[0.08] backdrop-blur-xl rounded-2xl flex items-center gap-2 shadow-neon-green/5">
      <span class="text-xs font-bold text-zinc-400">Total Pool:</span>
      <span class="text-sm font-black text-cyber-green">${totalPool.toFixed(2)}</span>
    </div>
  </header>

  <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    
    <form on:submit|preventDefault={handleAddExpense} class="lg:col-span-5 p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl space-y-4">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Log New Bill</h2>

      <div>
        <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="exp-desc">Description</label>
        <input 
          id="exp-desc"
          type="text" 
          bind:value={description}
          placeholder="E.g., Products from Costco" 
          required
          class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-green/40 transition-colors placeholder-zinc-700"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="exp-amount">Amount ($)</label>
          <input 
            id="exp-amount"
            type="number" 
            step="0.01"
            bind:value={amount}
            placeholder="0.00" 
            required
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono font-bold text-cyber-green focus:outline-none focus:border-cyber-green/40 transition-colors placeholder-zinc-700"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="exp-tag">Category</label>
          <select 
            id="exp-tag"
            bind:value={tag}
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-green/40 transition-colors"
          >
            <option value="Grocery">Grocery 🍏</option>
            <option value="Bills">Rent & Bills ⚡</option>
            <option value="Household">Household 🧼</option>
            <option value="Entertainment">Fun 🎮</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        class="w-full py-3 bg-cyber-green text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer border-none shadow-neon-green/15"
      >
        {loading ? 'Uploading...' : 'Submit Transaction'}
      </button>
    </form>

    <div class="lg:col-span-7 space-y-3 w-full">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">Transaction History</h2>

      <div class="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {#if expenses.length === 0}
          <p class="text-xs text-zinc-600 py-8 text-center font-medium bg-cyber-card/10 rounded-2xl border border-white/[0.02]">No transactions logged yet.</p>
        {:else}
          {#each expenses as item}
            <div class="flex justify-between items-center p-4 bg-cyber-card/30 border border-white/[0.05] rounded-2xl hover:border-white/10 transition-colors">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-center text-xs">
                  {item.tag === 'Grocery' ? '🍏' : item.tag === 'Bills' ? '⚡' : item.tag === 'Household' ? '🧼' : '🎮'}
                </div>
                <div>
                  <h3 class="text-sm font-bold text-zinc-200">{item.description}</h3>
                  <p class="text-[10px] text-zinc-500 font-medium mt-0.5">
                    Paid by <strong class="text-zinc-400">{item.profiles?.username || 'Unknown'}</strong> • {new Date(item.created_at).toLocaleDateString([], {day: 'numeric', month: 'short'})}
                  </p>
                </div>
              </div>
              
              <span class="text-sm font-black font-mono text-white">
                -${Number(item.amount).toFixed(2)}
              </span>
            </div>
          {/each}
        {/if}
      </div>
    </div>

  </div>

  <BottomNav />

</div>