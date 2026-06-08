<script>
  import GlassCard from '$lib/components/ui/GlassCard.svelte';
  import BottomNav from '$lib/components/ui/BottomNav.svelte';

  // Имитация данных из Supabase (для MVP)
  let username = "Mike";
  let householdName = "Our Cozy Pigsty 🏠";
  
  let weeklyProgress = 75; // % выполненных задач дома
  
  let leaderboard = [
    { name: "Alice", points: 45, rank: 1, isLeader: true, avatar: "👑" },
    { name: "Mike", points: 32, rank: 2, isLeader: false, avatar: "🔥" },
    { name: "Bob", points: 12, rank: 3, isLeader: false, avatar: "💤" }
  ];
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 flex flex-col justify-between">
  
  <div>
    <header class="flex justify-between items-center mb-8 max-w-4xl mx-auto">
      <div>
        <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Welcome back</span>
        <h1 class="text-2xl font-black tracking-tight text-white mt-0.5">Hi, {username}! 👋</h1>
        <p class="text-xs text-cyber-amber font-medium mt-0.5">{householdName}</p>
      </div>
      <div class="w-11 h-11 rounded-full border border-white/10 bg-cyber-card flex items-center justify-center text-sm font-black shadow-neon-orange text-cyber-orange">
        M
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
      
      <div class="w-full flex justify-center">
        <GlassCard 
          title="Current Balance" 
          amount="+$23.50" 
          subtitle="Charlie owes you $12.00 • You owe Alice $6.00. Everything is optimized."
        />
      </div>

      <div class="w-full space-y-6">
        
        <div class="p-6 rounded-3xl bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl">
          <div class="flex justify-between items-center mb-3">
            <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Weekly Chores Done</span>
            <span class="text-sm font-black text-cyber-green drop-shadow-[0_0_10px_rgba(0,255,135,0.3)]">{weeklyProgress}%</span>
          </div>
          <div class="w-full h-2 bg-zinc-950/80 rounded-full overflow-hidden border border-white/[0.02]">
            <div 
              class="h-full bg-gradient-to-r from-cyber-orange to-cyber-amber rounded-full shadow-neon-orange transition-all duration-500" 
              style="width: {weeklyProgress}%"
            ></div>
          </div>
          <p class="text-[11px] text-zinc-500 mt-3 font-medium">3 more tasks remaining today to keep the house clean.</p>
        </div>

        <div class="p-6 rounded-3xl bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl">
          <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-4">House Leaderboard</span>
          
          <div class="space-y-3">
            {#each leaderboard as user}
              <div class="flex justify-between items-center p-3 bg-zinc-950/30 rounded-2xl border border-white/[0.02] transition-all hover:border-white/[0.08]">
                <div class="flex items-center gap-3">
                  <span class="text-lg w-6 text-center font-bold text-zinc-500">{user.rank}</span>
                  <div class="w-8 h-8 rounded-xl bg-cyber-card border flex items-center justify-center text-sm
                    {user.isLeader ? 'border-cyber-orange shadow-neon-orange' : 'border-white/5'}">
                    {user.avatar}
                  </div>
                  <span class="text-sm font-bold {user.name === username ? 'text-cyber-orange' : 'text-zinc-300'}">
                    {user.name}
                  </span>
                </div>
                <span class="text-xs font-black text-zinc-400">{user.points} pts</span>
              </div>
            {/each}
          </div>
        </div>

      </div>
    </div>
  </div>

  <BottomNav />

</div>