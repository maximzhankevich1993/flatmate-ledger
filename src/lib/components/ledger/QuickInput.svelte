<script>
  let displayAmount = '0';
  let selectedCategory = '';
  let note = '';

  const categories = [
    { id: 'milk', label: 'Milk 🥛' },
    { id: 'paper', label: 'Paper 🧻' },
    { id: 'utilities', label: 'Utilities ⚡' },
    { id: 'wifi', label: 'Internet 🌐' },
    { id: 'groceries', label: 'Food 🍏' },
    { id: 'rent', label: 'Rent 🔑' }
  ];

  // Логика нажатия на цифровые клавиши калькулятора
  function pressKey(key) {
    if (key === 'C') {
      displayAmount = '0';
      return;
    }
    if (key === '.') {
      if (!displayAmount.includes('.')) {
        displayAmount += '.';
      }
      return;
    }
    if (displayAmount === '0') {
      displayAmount = key.toString();
    } else {
      displayAmount += key.toString();
    }
  }

  function submitExpense() {
    if (parseFloat(displayAmount) <= 0) return;
    
    // Эмит события или прямая отправка в Supabase пойдет тут
    console.log({
      amount: parseFloat(displayAmount),
      category: selectedCategory,
      note: note || `Bought ${selectedCategory}`
    });

    // Сброс формы
    displayAmount = '0';
    selectedCategory = '';
    note = '';
    alert('Expense added inside the Liquid Glass ledger!');
  }
</script>

<div class="w-full max-w-sm p-6 bg-cyber-card/60 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-neon-orange mx-auto">
  
  <span class="text-[10px] font-bold tracking-widest text-cyber-orange uppercase block mb-3">Quick Bill Splitter</span>
  
  <div class="w-full bg-zinc-950/60 border border-white/[0.03] rounded-2xl p-4 mb-5 flex items-center justify-between">
    <span class="text-xs font-bold text-zinc-500 uppercase">Amount</span>
    <span class="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
      ${displayAmount}
    </span>
  </div>

  <div class="mb-5">
    <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Quick Tags</span>
    <div class="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x">
      {#each categories as cat}
        <button 
          on:click={() => selectedCategory = cat.id}
          class="snap-start shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer
            {selectedCategory === cat.id 
              ? 'bg-gradient-to-r from-cyber-orange to-cyber-amber text-white border-transparent shadow-neon-orange scale-105' 
              : 'bg-zinc-900/40 border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/20'}"
        >
          {cat.label}
        </button>
      {/each}
    </div>
  </div>

  <input 
    type="text" 
    bind:value={note}
    placeholder="What did you buy? (Optional)"
    class="w-full bg-zinc-950/40 border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyber-orange/50 transition-colors mb-5"
  />

  <div class="grid grid-cols-3 gap-3 mb-6">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'C'] as key}
      <button 
        on:click={() => pressKey(key)}
        class="h-14 bg-zinc-900/30 border border-white/[0.03] hover:border-white/10 active:bg-cyber-orange/10 rounded-2xl text-base font-black text-white transition-all duration-150 flex items-center justify-center cursor-pointer select-none"
      >
        {key}
      </button>
    {/each}
  </div>

  <button 
    on:click={submitExpense}
    class="w-full py-4 bg-gradient-to-b from-cyber-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-sm rounded-2xl shadow-neon-orange active:scale-98 transition-all duration-200 cursor-pointer uppercase tracking-wider"
  >
    Split with Roommates ⚡
  </button>

</div>