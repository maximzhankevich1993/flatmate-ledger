<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { supabase } from '$lib/supabaseClient';

  export let data;
  $: ({ profile, household } = data);

  let copied = false;

  // Функция копирования инвайт-кода в буфер обмена
  function copyInviteCode() {
    if (!household?.invite_code) return;
    navigator.clipboard.writeText(household.invite_code);
    copied = true;
    setTimeout(() => { copied = false; }, 2000);
  }

  // Функция выхода из аккаунта
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Наш hooks.server.js мгновенно перехватит очистку сессии и редиректнет на /auth
      window.location.href = '/auth';
    } else {
      alert('Error signing out: ' + error.message);
    }
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 flex flex-col justify-between">
  
  <div class="max-w-2xl mx-auto w-full">
    <header class="mb-8">
      <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">System Preferences</span>
      <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Settings ⚙️</h1>
    </header>

    <div class="space-y-6">
      
      <section class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-orange to-cyber-amber flex items-center justify-center text-black font-black text-sm shadow-neon-orange/10">
            {profile?.username ? profile.username.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 class="text-base font-black text-white">{profile?.username || 'Active User'}</h2>
            <p class="text-xs text-zinc-500 font-medium mt-0.5">Authorized Agent</p>
          </div>
        </div>
        
        <div class="text-right">
          <span class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Score</span>
          <span class="text-lg font-black font-mono text-cyber-amber">{profile?.points || 0} XP</span>
        </div>
      </section>

      <section class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl space-y-4">
        <div>
          <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Household Perimeter</h3>
          <p class="text-2xl font-black text-white mt-1">{household?.name || 'Grid Sector'}</p>
        </div>

        <hr class="border-white/[0.04] my-2" />

        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Enlist Roommates (Invite Code)</label>
          <div class="flex gap-2">
            <div class="flex-1 bg-zinc-950/80 border border-white/5 rounded-xl px-4 py-3 font-mono text-sm font-bold text-cyber-orange flex items-center justify-between select-all">
              {household?.invite_code || 'NO-CODE-FOUND'}
            </div>
            
            <button 
              on:click={copyInviteCode}
              type="button"
              class="px-5 bg-white text-black font-black text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer border-none"
            >
              {copied ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>
          <p class="text-[10px] text-zinc-500 mt-2 font-medium">Share this operational key with your roommates so they can sync with your budget and task matrices.</p>
        </div>
      </section>

      <section class="p-6 bg-cyber-card/20 border border-white/[0.04] rounded-3xl flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-zinc-400">Terminate Session</h3>
          <p class="text-[11px] text-zinc-500 mt-0.5">Disconnect this node from the local household network.</p>
        </div>
        
        <button 
          on:click={handleSignOut}
          type="button"
          class="px-5 py-3 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </section>

    </div>
  </div>

  <BottomNav />

</div>