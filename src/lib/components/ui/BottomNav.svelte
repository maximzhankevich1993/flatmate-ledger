<script>
  // Текущая активная вкладка
  let activeTab = 'dashboard';

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'chores', label: 'Chores', icon: '🧼' },
    { id: 'ledger', label: 'Ledger', icon: '💳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  function setTab(id) {
    activeTab = id;
  }
</script>

<!-- SVG-фильтр для эффекта "жидкого склеивания" (Gooey effect) -->
<svg class="hidden" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="gooey">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooey" />
      <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
    </filter>
  </defs>
</svg>

<!-- Контейнер навигации -->
<div class="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 bg-transparent pb-6 md:pb-4">
  
  <!-- Меню с примененным жидким фильтром -->
  <nav class="relative flex justify-around items-center w-full max-w-md h-16 bg-cyber-card/80 border border-white/[0.06] backdrop-blur-xl rounded-2xl px-4 style-gooey">
    
    {#each tabs as tab}
      <button 
        class="relative flex flex-col items-center justify-center w-12 h-12 rounded-full border-none bg-transparent cursor-pointer transition-all duration-300 group"
        on:click={() => setTab(tab.id)}
      >
        <!-- Индикатор активного элемента (капля, которая выжимается вверх) -->
        <div class="absolute -top-3 w-10 h-10 bg-gradient-to-b from-cyber-orange to-cyber-amber rounded-full opacity-0 scale-50 transition-all duration-300 ease-out shadow-neon-orange
          {activeTab === tab.id ? 'opacity-100 scale-100 -translate-y-2' : 'group-hover:scale-75 group-hover:opacity-40'}">
        </div>

        <!-- Иконка -->
        <span class="relative z-10 text-xl transition-all duration-300 
          {activeTab === tab.id ? 'text-white scale-110 -translate-y-2' : 'text-zinc-500 group-hover:text-zinc-300'}">
          {tab.icon}
        </span>

        <!-- Текст (появляется под активной иконкой) -->
        <span class="absolute bottom-1 text-[9px] font-bold uppercase tracking-wider transition-all duration-300
          {activeTab === tab.id ? 'text-cyber-amber opacity-100' : 'opacity-0 translate-y-2'}">
          {tab.label}
        </span>
      </button>
    {/each}

  </nav>
</div>

<style>
  /* Применяем SVG-фильтр к контейнеру, чтобы капли плавно сливались */
  .style-gooey {
    filter: url('#gooey');
  }
</svg>
<script>
  // Простая утилита для проверки активного роута, чтобы подсвечивать нужную кнопку
  import { page } from '$app/stores';
  
  $: currentPath = $page.url.pathname;
</script>

<nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-lg h-16 bg-cyber-card/60 border border-white/[0.08] backdrop-blur-2xl rounded-2xl flex items-center justify-around px-4 shadow-2xl z-50">
  
  <!-- Кнопка: Главная (Дашборд) -->
  <a 
    href="/" 
    class="flex flex-col items-center justify-center gap-1 text-decoration-none transition-all duration-200 group
      {currentPath === '/' ? 'text-cyber-orange scale-105' : 'text-zinc-500 hover:text-zinc-300'}"
  >
    <span class="text-lg">🌌</span>
    <span class="text-[9px] font-black uppercase tracking-wider">Citadel</span>
  </a>

  <!-- Кнопка: Финансы -->
  <a 
    href="/app/expenses" 
    class="flex flex-col items-center justify-center gap-1 text-decoration-none transition-all duration-200 group
      {currentPath === '/app/expenses' ? 'text-cyber-green scale-105' : 'text-zinc-500 hover:text-zinc-300'}"
  >
    <span class="text-lg">💳</span>
    <span class="text-[9px] font-black uppercase tracking-wider">Ledger</span>
  </a>

  <!-- Кнопка: Задачи -->
  <a 
    href="/app/chores" 
    class="flex flex-col items-center justify-center gap-1 text-decoration-none transition-all duration-200 group
      {currentPath === '/app/chores' ? 'text-cyber-amber scale-105' : 'text-zinc-500 hover:text-zinc-300'}"
  >
    <span class="text-lg">🧹</span>
    <span class="text-[9px] font-black uppercase tracking-wider">Chores</span>
  </a>

  <!-- Кнопка: Настройки -->
  <a 
    href="/app/settings" 
    class="flex flex-col items-center justify-center gap-1 text-decoration-none transition-all duration-200 group
      {currentPath === '/app/settings' ? 'text-white scale-105' : 'text-zinc-500 hover:text-zinc-300'}"
  >
    <span class="text-lg">⚙️</span>
    <span class="text-[9px] font-black uppercase tracking-wider">System</span>
  </a>

</nav>
