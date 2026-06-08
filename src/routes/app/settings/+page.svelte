<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';

  let householdCode = "LDGR-77X9-PWA";
  let copied = false;

  let roommates = [
    { name: "You (Mike)", role: "Admin", active: true },
    { name: "Alice", role: "Roommate", active: true },
    { name: "Bob", role: "Roommate", active: true }
  ];

  function copyInviteCode() {
    // В реальном браузере это запишет в буфер обмена
    navigator.clipboard?.writeText(householdCode);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function handleCryptoPay(currency) {
    alert(`Generating lightning invoice for ${currency}... Transfer $49.99 to upgrade your house.`);
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24">
  
  <header class="max-w-3xl mx-auto mb-8">
    <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Management</span>
    <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">House Settings ⚙️</h1>
  </header>

  <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
    
    <div class="md:col-span-7 space-y-6">
      
      <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl">
        <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Invite Roommates</h3>
        <p class="text-xs text-zinc-500 mb-4">Share this code with your flatmates so they can join this digital household ledger.</p>
        
        <div class="flex gap-2">
          <div class="flex-1 bg-zinc-950/60 border border-white/[0.03] rounded-2xl px-4 py-3.5 font-mono text-sm font-bold text-cyber-amber tracking-wider flex items-center">
            {householdCode}
          </div>
          <button 
            on:click={copyInviteCode}
            class="px-5 bg-zinc-900/40 border border-white/[0.06] hover:border-white/20 active:scale-95 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            {copied ? 'Copied! ✅' : 'Copy'}
          </button>
        </div>
      </div>

      <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl">
        <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Household Members</h3>
        
        <div class="space-y-3">
          {#each roommates as member}
            <div class="flex justify-between items-center p-3 bg-zinc-950/20 border border-white/[0.02] rounded-2xl">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-cyber-green shadow-[0_0_10px_rgba(0,255,135,0.5)]"></div>
                <span class="text-sm font-bold text-zinc-200">{member.name}</span>
              </div>
              <span class="text-[10px] font-medium text-zinc-500 px-2 py-0.5 bg-zinc-900/60 rounded-md border border-white/5">
                {member.role}
              </span>
            </div>
          {/each}
        </div>
      </div>

    </div>

    <div class="md:col-span-5 w-full">
      <div class="relative group overflow-hidden p-6 bg-gradient-to-b from-[#16121e]/80 to-cyber-card/90 border border-cyber-orange/30 rounded-3xl shadow-neon-orange">
        
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-cyber-orange/20 rounded-full blur-2xl"></div>

        <span class="text-[9px] font-black tracking-widest text-white px-2 py-0.5 bg-cyber-orange rounded-md uppercase inline-block mb-3 shadow-neon-orange animate-pulse">
          Lifetime Deal
        </span>
        
        <h3 class="text-xl font-black text-white tracking-tight">Infinite House PRO 🚀</h3>
        <div class="flex items-baseline gap-1 mt-1.5 mb-4">
          <span class="text-3xl font-black text-white">$49.99</span>
          <span class="text-[11px] text-zinc-500 font-medium">one-time payment</span>
        </div>

        <ul class="space-y-2.5 text-xs text-zinc-400 font-medium mb-6">
          <li class="flex items-center gap-2">
            <span class="text-cyber-orange">✦</span> Unlimited roommates & bills
          </li>
          <li class="flex items-center gap-2">
            <span class="text-cyber-orange">✦</span> AI Smart Debt Simplification
          </li>
          <li class="flex items-center gap-2">
            <span class="text-cyber-orange">✦</span> Advanced Chore Rotations & History
          </li>
          <li class="flex items-center gap-2">
            <span class="text-cyber-orange">✦</span> Export ledger to CSV / PDF
          </li>
        </ul>

        <div class="space-y-2">
          <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Pay Securely via Web3 Crypto</span>
          
          <div class="grid grid-cols-2 gap-2">
            <button 
              on:click={() => handleCryptoPay('USDT')}
              class="py-2.5 bg-zinc-950/60 hover:bg-zinc-900 border border-white/[0.04] hover:border-cyber-green/30 rounded-xl text-xs font-bold text-zinc-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span class="text-emerald-500 font-black">₮</span> USDT (TRC-20)
            </button>
            <button 
              on:click={() => handleCryptoPay('BTC')}
              class="py-2.5 bg-zinc-950/60 hover:bg-zinc-900 border border-white/[0.04] hover:border-cyber-amber/30 rounded-xl text-xs font-bold text-zinc-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span class="text-amber-500 font-black">₿</span> Bitcoin (LN)
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>

  <BottomNav />

</div>