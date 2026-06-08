<script>
  import QuickInput from '$lib/components/ledger/QuickInput.svelte';
  import BottomNav from '$lib/components/ui/BottomNav.svelte';

  // Имитируем лог транзакций в доме
  let history = [
    { id: 1, user: 'Alice', desc: 'Netflix Subscription', amount: 15.99, tag: 'Internet 🌐', date: 'Today' },
    { id: 2, user: 'You', desc: 'Toilet paper & Detergent', amount: 24.50, tag: 'Paper 🧻', date: 'Yesterday' },
    { id: 3, user: 'Bob', desc: 'Organic Almond Milk x3', amount: 12.00, tag: 'Milk 🥛', date: '3 days ago' }
  ];
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24">
  
  <header class="max-w-5xl mx-auto mb-8">
    <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Shared Finances</span>
    <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">House Ledger 💳</h1>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
    
    <div class="lg:col-span-5 w-full">
      <QuickInput />
    </div>

    <div class="lg:col-span-7 w-full p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl">
      <div class="flex justify-between items-center mb-5">
        <div>
          <h2 class="text-sm font-bold text-white uppercase tracking-wider">Recent Shared Expenses</h2>
          <p class="text-[11px] text-zinc-500 mt-0.5">Everything splits equally inside your household</p>
        </div>
        <span class="text-[10px] bg-cyber-orange/10 border border-cyber-orange/20 text-cyber-orange font-bold px-2.5 py-1 rounded-lg shadow-neon-orange">
          Real-time
        </span>
      </div>

      <div class="space-y-3">
        {#each history as item}
          <div class="flex justify-between items-center p-4 bg-zinc-950/40 border border-white/[0.02] rounded-2xl transition-all hover:border-white/[0.08] group">
            
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col items-center justify-center">
                <span class="text-[10px] font-black text-zinc-400 uppercase">{item.user.slice(0,2)}</span>
              </div>
              
              <div>
                <h4 class="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{item.desc}</h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[10px] font-medium text-cyber-amber">{item.tag}</span>
                  <span class="text-[10px] text-zinc-600">• Paid by {item.user}</span>
                </div>
              </div>
            </div>

            <div class="text-right">
              <span class="text-sm font-black text-white">${item.amount.toFixed(2)}</span>
              <span class="block text-[9px] text-zinc-500 font-medium mt-0.5">{item.date}</span>
            </div>

          </div>
        {/each}
      </div>

    </div>
  </div>

  <BottomNav />

</div>