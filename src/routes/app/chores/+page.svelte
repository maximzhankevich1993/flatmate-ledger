<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { invalidateAll } from '$app/navigation';

  // Данные от сервера
  export let data;
  $: ({ chores, roommates, profile } = data);

  // Состояние формы создания задачи
  let title = '';
  let points = 25;
  let assigneeId = '';
  let dueDate = 'Today';
  let loading = false;

  // Функция создания новой задачи
  async function handleAddChore() {
    if (!title.trim() || !assigneeId || loading) return;
    loading = true;

    const { error } = await supabase
      .from('chores')
      .insert([{
        household_id: profile.household_id,
        title: title.trim(),
        points: Number(points),
        assignee_id: assigneeId,
        due_date: dueDate,
        is_done: false
      }]);

    if (!error) {
      title = '';
      await invalidateAll(); // Обновляем списки
    } else {
      alert('Error creating chore: ' + error.message);
    }
    loading = false;
  }

  // Функция закрытия задачи с начислением XP игроку
  async function completeChore(choreId, targetAssigneeId, chorePoints) {
    // 1. Меняем статус задачи в базе данных
    const { error: choreError } = await supabase
      .from('chores')
      .update({ is_done: true })
      .eq('id', choreId);

    if (choreError) {
      alert('Error updating chore: ' + choreError.message);
      return;
    }

    // 2. Вытаскиваем текущие очки исполнителя и прибавляем награду
    const { data: targetProfile } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', targetAssigneeId)
      .single();

    if (targetProfile) {
      const currentPoints = targetProfile.points || 0;
      await supabase
        .from('profiles')
        .update({ points: currentPoints + chorePoints })
        .eq('id', targetAssigneeId);
    }

    // Перезагружаем данные на экране, чтобы обновить XP и списки
    await invalidateAll();
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24">
  
  <header class="max-w-4xl mx-auto mb-8">
    <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Citadel Operations</span>
    <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Chores Grid 🧹</h1>
  </header>

  <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    
    <form on:submit|preventDefault={handleAddChore} class="lg:col-span-5 p-6 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl space-y-4">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deploy New Duty</h2>

      <div>
        <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="chore-title">Task Title</label>
        <input 
          id="chore-title"
          type="text" 
          bind:value={title}
          placeholder="E.g., Clean the exhaust hood" 
          required
          class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-orange/40 transition-colors placeholder-zinc-700"
        />
      </div>

      <div>
        <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="chore-assignee">Assign Agent</label>
        <select 
          id="chore-assignee"
          bind:value={assigneeId}
          required
          class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-orange/40 transition-colors"
        >
          <option value="" disabled selected>Select roommate</option>
          {#each roommates as mate}
            <option value={mate.id}>{mate.username}</option>
          {/each}
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="chore-xp">Reward (XP)</label>
          <input 
            id="chore-xp"
            type="number" 
            bind:value={points}
            min="5"
            max="500"
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono font-bold text-cyber-amber focus:outline-none focus:border-cyber-orange/40 transition-colors"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="chore-due">Timeline</label>
          <select 
            id="chore-due"
            bind:value={dueDate}
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-orange/40 transition-colors"
          >
            <option value="Today">Today 🚨</option>
            <option value="Tomorrow">Tomorrow ⏳</option>
            <option value="This Week">This Week 📅</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        class="w-full py-3 bg-cyber-orange text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer border-none shadow-neon-orange/15"
      >
        {loading ? 'Deploying...' : 'Inject into Matrix'}
      </button>
    </form>

    <div class="lg:col-span-7 space-y-3 w-full">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">Active Operational Directives</h2>

      <div class="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {#if chores.length === 0}
          <p class="text-xs text-zinc-600 py-8 text-center font-medium bg-cyber-card/10 rounded-2xl border border-white/[0.02]">Grid clear. No duties assigned.</p>
        {:else}
          {#each chores as chore}
            <div class="flex justify-between items-center p-4 rounded-2xl border transition-all
              {chore.is_done 
                ? 'bg-zinc-950/20 border-white/[0.02] opacity-40' 
                : 'bg-cyber-card/30 border-white/[0.05] hover:border-white/10'}"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-5 h-5 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold
                  {chore.is_done 
                    ? 'border-cyber-green text-cyber-green bg-cyber-green/10' 
                    : 'border-zinc-700 text-transparent'}"
                >
                  ✓
                </div>

                <div>
                  <h3 class="text-sm font-bold {chore.is_done ? 'line-through text-zinc-500' : 'text-zinc-200'}">
                    {chore.title}
                  </h3>
                  <p class="text-[10px] text-zinc-500 font-medium mt-0.5">
                    Agent: <strong class="text-zinc-400">{chore.profiles?.username || 'Unassigned'}</strong> • 
                    <span class="{chore.due_date === 'Today' && !chore.is_done ? 'text-cyber-orange font-bold' : ''}">{chore.due_date}</span>
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="text-xs font-black font-mono px-2 py-1 bg-zinc-900/80 rounded-lg border border-white/5 text-cyber-amber">
                  +{chore.points} XP
                </span>

                {#if !chore.is_done}
                  <button 
                    on:click={() => completeChore(chore.id, chore.assignee_id, chore.points)}
                    class="px-3 py-1.5 bg-white text-black font-black text-[10px] uppercase tracking-wider rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer border-none"
                  >
                    Complete
                  </button>
                {/if}
              </div>

            </div>
          {/each}
        {/if}
      </div>
    </div>

  </div>

  <BottomNav />

</div>