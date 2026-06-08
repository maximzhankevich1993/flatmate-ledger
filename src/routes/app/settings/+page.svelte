<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  // Получаем данные от сервера (включая флаг isPremium, который мы настроили на Шаге 1)
  export let data;
  $: ({ profile, inviteCode, isPremium } = data);

  let copied = false;
  let loadingInvoice = false;

  // Функция для копирования инвайт-кода
  async function copyInviteCode() {
    if (!inviteCode || inviteCode === 'NOT_ASSIGNED') return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      copied = true;
      setTimeout(() => copied = false, 3000);
    } catch (err) {
      alert('Failed to copy code: ' + err);
    }
  }

  // Функция генерации счёта через CryptoCloud API
  async function handleBuyPremium() {
    if (loadingInvoice) return;
    loadingInvoice = true;

    try {
      // Твой API Токен от CryptoCloud и ID Мерчанта (подставь свои в кавычки)
      const API_TOKEN = 'YOUR_CRYPTOCLOUD_API_TOKEN'; 
      const SHOP_ID = 'YOUR_CRYPTOCLOUD_SHOP_ID'; 

      if (API_TOKEN === 'YOUR_CRYPTOCLOUD_API_TOKEN') {
        alert('Пожалуйста, укажи свой реальный API_TOKEN и SHOP_ID от CryptoCloud в коде файла settings/+page.svelte!');
        loadingInvoice = false;
        return;
      }

      // Формируем запрос на создание инвойса согласно документации CryptoCloud
      const response = await fetch('https://api.cryptocloud.plus/v1/invoice/create', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shop_id: SHOP_ID,
          amount: 4.99, // Стоимость подписки в USD
          currency: 'USD',
          order_id: profile.household_id, // Передаем ID дома, чтобы вебхук знал, кого активировать
        })
      });

      const resData = await response.json();

      if (resData.status === 'success' && resData.result && resData.result.link) {
        // Редиректим пользователя на страницу оплаты CryptoCloud
        window.location.href = resData.result.link;
      } else {
        alert('CryptoCloud Error: ' + (resData.message || 'Failed to generate invoice link'));
      }
    } catch (error) {
      console.error('Invoice generation failed:', error);
      alert('Failed to reach CryptoCloud API. Check console.');
    } finally {
      loadingInvoice = false;
    }
  }

  // Выход из системы
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      goto('/login');
    } else {
      alert('Error signing out: ' + error.message);
    }
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 relative overflow-hidden">
  
  <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-zinc-800/10 rounded-full blur-[130px] animate-ambient-glow pointer-events-none z-0"></div>
  <div class="absolute bottom-[-10%] left-[-10%] w-96 h-96 {#if isPremium}bg-cyber-amber/10{:else}bg-cyber-orange/5{/if} rounded-full blur-[140px] animate-ambient-glow pointer-events-none z-0" style="animation-delay: -6s;"></div>

  <div class="relative z-10 max-w-xl mx-auto space-y-6">
    
    <header class="mb-8 flex items-center justify-between">
      <div>
        <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">System Core</span>
        <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Control Panel ⚙️</h1>
      </div>
      
      {#if isPremium}
        <div class="px-3 py-1 bg-cyber-amber/10 border border-cyber-amber/30 rounded-full text-[9px] font-mono tracking-widest text-cyber-amber uppercase animate-pulse shadow-neon-amber/10">
          💎 Premium Sector
        </div>
      {:else}
        <div class="px-3 py-1 bg-zinc-900 border border-white/5 rounded-full text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
          Standard Grid
        </div>
      {/if}
    </header>

    <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
          👤
        </div>
        <div>
          <span class="text-[9px] font-mono font-black text-cyber-orange uppercase tracking-wider">Active Operator</span>
          <h2 class="text-xl font-black text-white mt-0.5">{profile?.username || 'Unknown User'}</h2>
        </div>
      </div>
      
      <div class="bg-zinc-950/50 border border-white/5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-cyber-amber">
        {profile?.points || 0} XP
      </div>
    </div>

    {#if !isPremium}
      <div class="p-6 bg-gradient-to-br from-cyber-amber/10 to-transparent border border-cyber-amber/20 backdrop-blur-xl rounded-3xl space-y-4 relative overflow-hidden group">
        <div class="absolute -right-10 -top-10 text-7xl opacity-10 filter grayscale group-hover:grayscale-0 transition-all duration-500">💎</div>
        <div>
          <h3 class="text-sm font-black text-cyber-amber uppercase tracking-wider">Upgrade to Premium Grid</h3>
          <p class="text-xs text-zinc-400 mt-1 leading-relaxed">
            Unlock global synchronization analytics, recursive tasks, and advanced automation for your co-living ecosystem. Pay securely with Crypto.
          </p>
        </div>
        
        <button 
          on:click={handleBuyPremium}
          disabled={loadingInvoice}
          type="button"
          class="w-full py-3 bg-cyber-amber hover:opacity-90 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none shadow-neon-amber/15 disabled:opacity-40"
        >
          {#if loadingInvoice}
            Generating Web3 Invoice...
          {:else}
            Activate Premium — $4.99 / mo
          {/if}
        </button>
      </div>
    {/if}

    <div class="p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl space-y-4">
      <div>
        <h3 class="text-sm font-bold text-zinc-200">Sector Synchronization</h3>
        <p class="text-xs text-zinc-500 mt-1 leading-relaxed">
          Share this encrypted authorization key with your roommates. Entering this code during registration links their grid with your finances and chores.
        </p>
      </div>

      <div class="flex gap-2">
        <div class="flex-1 bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 font-mono text-sm font-black text-center tracking-widest text-zinc-300 flex items-center justify-center select-all">
          {inviteCode}
        </div>

        <button 
          on:click={copyInviteCode}
          type="button"
          class="px-5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer min-w-[110px]"
        >
          {#if copied}
            <span class="text-cyber-green">Copied!</span>
          {:else}
            Copy
          {/if}
        </button>
      </div>
    </div>

    <div class="pt-4">
      <button 
        on:click={handleLogout}
        type="button"
        class="w-full py-3.5 bg-zinc-950/80 hover:bg-red-950/20 border border-white/5 hover:border-red-900/30 text-zinc-400 hover:text-red-500 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
      >
        Terminate Session (Log Out)
      </button>
    </div>

  </div>

  <BottomNav />

</div>