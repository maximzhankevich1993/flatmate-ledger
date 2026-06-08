<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import GlassCard from '$lib/components/ui/GlassCard.svelte';
  import StatusBento from '$lib/components/ui/StatusBento.svelte';

  // Получаем данные от сервера (+page.server.js)
  export let data;
  $: ({ leaderboard, totalSpent, activeChoresCount, profile } = data);
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 relative overflow-hidden">
  
  <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyber-orange/10 rounded-full blur-[120px] animate-ambient-glow pointer-events-none z-0"></div>
  <div class="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-cyber-amber/10 rounded-full blur-[120px] animate-ambient-glow pointer-events-none z-0" style="animation-delay: -4s;"></div>
  <div class="relative z-10 max-w-4xl mx-auto space-y-8">
    
    <header class="flex justify-between items-center">
      <div>
        <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Welcome back, operative</span>
        <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">
          Ready, <span class="text-cyber-orange">{profile?.username || 'User'}</span>? ⚡
        </h1>
      </div>
      
      <div class="text-right bg-zinc-950/50 border border-white/5 px-4 py-2 rounded-2xl">
        <span class="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Your Power</span>
        <span class="text-sm font-black font-mono text-cyber-amber">{profile?.points || 0} XP</span>
      </div>
    </header>

    <section class="w-full flex justify-center sm:justify-start">
      <GlassCard 
        title="Household Shared Pool"
        amount="${totalSpent.toFixed(2)}"
        subtitle="This month's accumulated expenses for your entire living sector. Keep it synchronized."
      />
    </section>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
      
      <div class="md:col-span-5 flex">
        <StatusBento />
      </div>

      <div class="md:col-span-7 p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-[32px] flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Citadel Leaderboard</h3>
            <span class="text-[10px] font-bold px-2 py-0.5 bg-cyber-orange/10 border border-cyber-orange/20 rounded text-cyber-orange uppercase font-mono">
              {activeChoresCount} active duties
            </span>
          </div>

          <div class="space-y-2.5">
            {#if leaderboard.length === 0}
              <p class="text-xs text-zinc-600 py-4 text-center font-medium">No agents found in this perimeter.</p>
            {:else}
              {#each leaderboard as user, index}
                <div class="flex justify-between items-center p-3.5 bg-zinc-950/40 border border-white/[0.03] rounded-xl hover:border-white/5 transition-colors">
                  <div class="flex items-center gap-3">
                    <span class="w-5 font-mono text-xs font-bold text-center
                      {index === 0 ? 'text-cyber-amber' : index === 1 ? 'text-zinc-400' : 'text-zinc-600'}">
                      #{index + 1}
                    </span>
                    <span class="text-sm font-bold text-zinc-200">{user.username}</span>
                  </div>
                  <span class="text-xs font-bold font-mono text-cyber-amber">{user.points || 0} XP</span>
                </div>
              {/each}
            {/if}
          </div>
        </div>
        
        <a 
          href="/app/chores" 
          class="w-full text-center mt-6 py-3 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all text-decoration-none block"
        >
          Open Operational Grid →
        </a>
      </div>

    </div>

  </div>

  <BottomNav />

</div>