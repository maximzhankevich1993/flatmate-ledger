<script>
  import { onMount } from 'svelte';

  // Пропсы для гибкости (можно менять заголовок, сумму и т.д.)
  export let title = "Current Balance";
  export let amount = "$23.50";
  export let subtitle = "Alice paid for Netflix. Your share is due.";

  let cardElement;
  let glowElement;

  // Математика 3D-наклона (Tilt) из твоего референса
  function handleMouseMove(e) {
    if (!cardElement || !glowElement) return;

    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left; // координата X внутри карточки
    const y = e.clientY - rect.top;  // координата Y внутри карточки

    // Вычисляем углы наклона (макс 15 градусов)
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 10;
    const angleY = (x - xc) / 10;

    // Применяем 3D трансформацию к карточке
    cardElement.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Перемещаем глянцевый блик за курсором
    glowElement.style.left = `${x}px`;
    glowElement.style.top = `${y}px`;
    glowElement.style.opacity = '1';
  }

  // Сброс карточки в исходное состояние, когда мышь уходит
  function handleMouseLeave() {
    if (!cardElement || !glowElement) return;
    cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    glowElement.style.opacity = '0';
  }
</script>

<div 
  bind:this={cardElement}
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  class="relative w-full max-w-sm p-6 bg-cyber-card/40 border border-white/[0.08] backdrop-blur-xl rounded-3xl transition-transform duration-100 ease-out shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden cursor-pointer group select-none select-none"
  style="transform-style: preserve-3d;"
>
  <div 
    bind:this={glowElement}
    class="absolute w-56 h-56 bg-gradient-to-r from-white/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-overlay opacity-0 blur-xl transition-opacity duration-300"
  ></div>

  <div class="absolute -inset-20 bg-cyber-orange/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

  <div class="relative z-10 flex flex-col justify-between h-full" style="transform: translateZ(40px);">
    
    <div class="flex justify-between items-start">
      <div>
        <span class="text-[10px] font-bold tracking-widest text-cyber-orange uppercase">{title}</span>
        <h3 class="text-4xl font-black text-white mt-1 tracking-tight drop-shadow-md">{amount}</h3>
      </div>
      <div class="w-11 h-11 rounded-2xl bg-cyber-orange/10 border border-cyber-orange/30 flex items-center justify-center text-xl shadow-neon-orange text-cyber-orange">
        💳
      </div>
    </div>

    <p class="text-xs text-zinc-400 mt-6 font-medium leading-relaxed">
      {subtitle}
    </p>

    <button class="w-full mt-6 py-3.5 bg-gradient-to-b from-cyber-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-sm rounded-2xl shadow-neon-orange active:scale-95 transition-all duration-200 cursor-pointer">
      Settle Up via Revolut
    </button>
  </div>
</div>

<style>
  /* Включаем аппаратное ускорение для плавности 3D */
  div {
    will-change: transform;
  }
</style>