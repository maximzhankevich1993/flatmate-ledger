<script>
  // Пропсы для управления видимостью модалки снаружи
  export let isOpen = false;
  export let onClose = () => {};
  export let onAdd = (newChore) => {};

  let title = '';
  let points = 10;
  let assignee = 'Everyone (Rotate)';
  let due = 'Today';

  const roommates = ['Everyone (Rotate)', 'You', 'Alice', 'Bob'];

  function handleSubmit() {
    if (!title.trim()) return;

    onAdd({
      id: Date.now(), // Временный ID, пока нет Supabase
      title: title,
      points: Number(points),
      assignee: assignee === 'Everyone (Rotate)' ? 'Bob' : assignee, // Имитируем ротацию
      due: due,
      done: false
    });

    // Сброс полей
    title = '';
    points = 10;
    assignee = 'Everyone (Rotate)';
    due = 'Today';
    onClose();
  }
</script>

{#if isOpen}
  <div 
    on:click={onClose}
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
  >
    <div 
      on:click|stopPropagation
      class="relative w-full max-w-sm p-6 bg-cyber-card border border-white/[0.08] rounded-3xl shadow-neon-orange flex flex-col gap-4"
    >
      <div class="flex justify-between items-center mb-1">
        <h3 class="text-base font-black uppercase tracking-wider text-white">New House Chore</h3>
        <button on:click={onClose} class="text-zinc-500 hover:text-white text-sm cursor-pointer">✕</button>
      </div>

      <div>
        <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5" for="chore-title">Chore Title</label>
        <input 
          id="chore-title"
          type="text" 
          bind:value={title}
          placeholder="e.g., Clean the fridge 🧊"
          class="w-full bg-zinc-950/50 border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyber-orange/50 transition-colors"
        />
      </div>

      <div>
        <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5" for="chore-assignee">Assignee</label>
        <select 
          id="chore-assignee"
          bind:value={assignee}
          class="w-full bg-zinc-950/50 border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-orange/50 transition-colors cursor-pointer"
        >
          {#each roommates as name}
            <option value={name} class="bg-cyber-card text-white">{name}</option>
          {/each}
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5" for="chore-points">XP Reward</label>
          <input 
            id="chore-points"
            type="number" 
            bind:value={points}
            min="5"
            max="100"
            step="5"
            class="w-full bg-zinc-950/50 border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-orange/50 transition-colors"
          />
        </div>
        <div>
          <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5" for="chore-due">Due Date</label>
          <input 
            id="chore-due"
            type="text" 
            bind:value={due}
            placeholder="e.g., Tomorrow"
            class="w-full bg-zinc-950/50 border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyber-orange/50 transition-colors"
          />
        </div>
      </div>

      <button 
        on:click={handleSubmit}
        class="w-full mt-2 py-3.5 bg-gradient-to-b from-cyber-orange to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-xs rounded-2xl shadow-neon-orange active:scale-98 transition-all uppercase tracking-wider cursor-pointer"
      >
        Create Task ⚡
      </button>
    </div>
  </div>
{/if}