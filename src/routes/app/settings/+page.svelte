<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';

  // Принимаем живые данные с сервера
  export let data;
  $: ({ household, roommates } = data);

  let copied = false;

  // Функция для красивого копирования инвайт-кода на мобилке
  function copyInviteCode() {
    if (!household.invite_code) return;
    navigator.clipboard.writeText(household.invite_code);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24">
  
  <!-- ХЕДЕР СТРАНИЦЫ -->
  <header class="max-w-3xl mx-auto mb-8">
    <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">System Control</span>
    <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Settings ⚙️</h1>
  </header>

  <div class="max-w-3xl mx-auto space-y-6">
    
    <!-- КАРТОЧКА НАСТРОЕК ДОМА -->
    <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Household Profile</h2>
      
      <div class="space-y-4">
        <!-- Поле имени дома -->
        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="house-name">House Name</label>
          <input 
            id="house-name"
            type="text" 
            bind:value={household.name}
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-orange/40 transition-colors"
          />
        </div>

        <!-- Поле инвайт-кода с кнопкой копирования -->
        <div>
          <span class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Roommate Invite Code</span>
          <div class="flex gap-2">
            <div class="flex-1 bg-zinc-950/80 border border-white/[0.02] rounded-xl px-4 py-3 text-sm font-mono font-bold text-cyber-amber flex items-center">
              {household.invite_code}
            </div>
            <button 
              on:click={copyInviteCode}
              class="px-4 bg-white text-black font-black text-xs rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer border-none"
            >
              {copied ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- УПРАВЛЕНИЕ СОЖИТЕЛЯМИ -->
    <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Roommates Management ({roommates.length})</h2>
      
      <div class="space-y-2">
        {#each roommates as mate}
          <div class="flex justify-between items-center p-3.5 bg-zinc-950/40 border border-white/[0.02] rounded-xl">
            <div>
              <span class="text-sm font-bold text-zinc-200">{mate.username}</span>
              <span class="block text-[9px] text-zinc-600 font-medium mt-0.5">
                Joined {new Date(mate.created_at).toLocaleDateString([], { month: 'short', year: 'numeric' })}
              </span>
            </div>
            
            <!-- Кнопка исключения (скрытая фича администратора) -->
            <button class="text-[10px] font-bold text-zinc-600 hover:text-rose-500 transition-colors bg-transparent border-none cursor-pointer">
              Kick
            </button>
          </div>
        {/each}
      </div>
    </div>

    <!-- PREMIUM WEB3 BLOCK -->
    <div class="p-6 bg-gradient-to-br from-cyber-card/80 to-zinc-950/20 border border-cyber-amber/20 rounded-3xl relative overflow-hidden group shadow-neon-amber/5">
      <div class="absolute -top-12 -right-12 w-32 h-32 bg-cyber-amber/5 rounded-full blur-2xl group-hover:bg-cyber-amber/10 transition-all"></div>
      
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="text-[9px] font-black text-cyber-amber bg-cyber-amber/10 border border-cyber-amber/20 px-2 py-0.5 rounded-md uppercase tracking-widest">
            PRO FEATURE
          </span>
          <h3 class="text-base font-black text-white mt-2.5">Web3 Smart Invoice Split</h3>
          <p class="text-xs text-zinc-400 mt-1 max-w-md">
            Pay rent, utility checks, and grocery bills directly with crypto. Automatic smart contract deployment for your household ledger.
          </p>
        </div>
        <div class="text-right">
          <span class="block text-lg font-black font-mono text-white">$4.99</span>
          <span class="text-[9px] text-zinc-500 font-bold uppercase">per month</span>
        </div>
      </div>
      
      <button class="w-full mt-5 py-3 bg-gradient-to-r from-cyber-amber to-cyber-orange text-black font-black text-xs rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none shadow-neon-orange/20">
        Unlock Premium Nodes
      </button>
    </div>

  </div>

  <!-- ТАББАР -->
  <BottomNav />

</div>