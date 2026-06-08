<script>
  import '../app.css';
  
  // Здесь позже развернем подписку на Supabase Auth
  export let data;
</script>

<div class="relative min-h-screen bg-cyber-bg overflow-hidden flex flex-col selection:bg-cyber-orange/30 selection:text-white">
  
  <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyber-orange to-cyber-amber rounded-full blur-[120px] opacity-25 animate-ambient-glow"></div>
    
    <div class="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-gradient-to-tr from-red-900 to-cyber-orange rounded-full blur-[150px] opacity-20 animate-ambient-glow" style="animation-delay: -4s;"></div>
  </div>

  <main class="relative z-10 flex-1 flex flex-col w-full max-w-[1440px] mx-auto">
    <slot />
  </main>

</div>