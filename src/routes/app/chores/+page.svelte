<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import AddChoreModal from '$lib/components/chores/AddChoreModal.svelte';

  // Временный реактивный стейт списка обязанностей
  let chores = [
    { id: 1, title: 'Clean the Kitchen 🍳', points: 15, assignee: 'You', due: 'Before 10 PM', done: false },
    { id: 2, title: 'Take out the Trash 🦝', points: 5, assignee: 'Bob', due: 'Today', done: false },
    { id: 3, title: 'Vacuum Living Room 🧹', points: 10, assignee: 'Alice', due: 'In 2 days', done: true },
    { id: 4, title: 'Deep Clean Bathroom 🧼', points: 25, assignee: 'You', due: 'Sunday', done: false }
  ];

  let userPoints = 32;
  let isModalOpen = false; // Переключатель видимости модалки

  // Логика переключения статуса задачи
  function toggleChore(id) {
    chores = chores.map(chore => {
      if (chore.id === id) {
        const updatedStatus = !chore.done;
        if (chore.assignee === 'You') {
          userPoints = updatedStatus ? userPoints + chore.points : userPoints - chore.points;
        }
        return { ...chore, done: updatedStatus };
      }
      return chore;
    });
  }

  // Функция добавления новой задачи из модалки
  function handleAddChore(newChore) {
    chores = [newChore, ...chores];
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24">
  
  <header class="max-w-3xl mx-auto mb-8 flex justify-between items-end">
    <div>
      <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Gamified Routine</span>
      <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">House Chores 🧼</h1>
    </div>
    <div class="px-4 py-2 bg-cyber-card/60 border border-white/[0.08] backdrop-blur-xl rounded-2xl flex items-center gap-2 shadow-neon-amber">
      <span class="text-xs font-bold text-zinc-400">Your Score:</span>
      <span class="text-sm font-black text-cyber-amber">{userPoints} pts</span>
    </div>
  </header>

  <div class="max-w-3xl mx-auto space-y-4">
    
    <div class="flex justify-between items-center px-2">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Duties</h2>
      
      <button 
        on:click={() => isModalOpen = true}
        class="text-xs font-black text-cyber-orange hover:text-cyber-amber transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none"
      >
        <span>+</span> Add Chore
      </button>
    </div>

    <div class="space-y-3">
      {#each chores as chore}
        <div 
          on:click={() => toggleChore(chore.id)}
          class="flex justify-between items-center p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer select-none
            {chore.done 
              ? 'bg-zinc-950/20 border-cyber-green/20 opacity-60' 
              : 'bg-cyber-card/40 border-white/[0.06] hover:border-white/20 hover:scale-[1.01]'}"
        >
          <div class="flex items-center gap-4">
            
            <div class="w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300
              {chore.done 
                ? 'bg-cyber-green border-transparent shadow-neon-green text-black scale-95' 
                : 'border-white/20 bg-zinc-900/50'}"
            >
              {#if chore.done}
                <svg class="w-3 h-3 stroke-[4.5] stroke-current" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              {/if}
            </div>

            <div>
              <h3 class="text-sm font-bold transition-all
                {chore.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}"
              >
                {chore.title}
              </h3>
              <div class="flex items-center gap-2 mt-0.5 text-[10px] font-medium text-zinc-500">
                <span class={chore.done ? 'text-zinc-600' : 'text-cyber-orange'}>{chore.due}</span>
                <span>•</span>
                <span>Assignee: <strong class={chore.assignee === 'You' ? 'text-white' : 'text-zinc-400'}>{chore.assignee}</strong></span>
              </div>
            </div>

          </div>

          <div class="text-right">
            <span class="text-xs font-black tracking-tight px-2.5 py-1 rounded-xl border
              {chore.done 
                ? 'bg-zinc-900/50 border-white/5 text-zinc-600' 
                : 'bg-zinc-950/50 border-white/[0.03] text-cyber-green'}"
            >
              +{chore.points} XP
            </span>
          </div>

        </div>
      {/each}
    </div>

  </div>

  <AddChoreModal 
    isOpen={isModalOpen} 
    onClose={() => isModalOpen = false} 
    onAdd={handleAddChore} 
  />

  <BottomNav />

</div>