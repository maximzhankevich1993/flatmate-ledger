<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { invalidateAll } from '$app/navigation';

  export let data;
  $: ({ chores, roommates, profile, isPremium } = data);

  // Стейт формы создания задачи
  let title = '';
  let points = 10;
  let dueDate = '';
  let assigneeId = '';
  let isRecurring = false; // Стейт для нашей новой Премиум-фичи
  let isSubmitting = false;

  // Функция создания нового квеста
  async function handleCreateChore(e) {
    e.preventDefault();
    if (!title || !assigneeId || isSubmitting) return;

    // Защита: если обычный юзер как-то обошел фронтенд и пытается пропихнуть рекурсию
    if (isRecurring && !isPremium) {
      alert('Auto-recurring tasks are only available for Premium Grids!');
      return;
    }

    isSubmitting = true;

    const { error } = await supabase.from('chores').insert([{
      title,
      points: Number(points),
      due_date: dueDate || null,
      assignee_id: assigneeId,
      household_id: profile.household_id,
      is_done: false
    }]);

    if (!error) {
      // Очищаем поля формы при успешном создании
      title = '';
      points = 10;
      dueDate = '';
      assigneeId = '';
      isRecurring = false;
      await invalidateAll(); // Реактивно обновляем списки на сервере
    } else {
      alert('Error creating chore: ' + error.message);
    }
    isSubmitting = false;
  }

  // Функция закрытия квеста (выполнение таски с начислением XP)
  async function handleCompleteChore(choreId, pointsReward, assigneeUuid) {
    // 1. Помечаем задачу в базе как выполненную
    const { error: choreError } = await supabase
      .from('chores')
      .update({ is_done: true })
      .eq('id', choreId);

    if (choreError) {
      alert('Error updating chore status: ' + choreError.message);
      return;
    }

    // 2. Вытаскиваем текущий баланс XP того сожителя, на кого был выписан квест
    const { data: userProfile, error: profileGetError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', assigneeUuid)
      .single();

    if (profileGetError) return;

    // 3. Начисляем ему заслуженную награду в общую таблицу
    const newPoints = (userProfile.points || 0) + pointsReward;
    await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', assigneeUuid);

    await invalidateAll(); // Обновляем экран, чтобы лидерборд пересчитался
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 relative overflow-hidden">
  
  <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-zinc-800/10 rounded-full blur-[130px] animate-ambient-glow pointer-events-none z-0"></div>
  <div class="absolute bottom-[-10%] left-[-10%] w-96 h-96 {#if isPremium}bg-cyber-amber/10{:else}bg-cyber-orange/5{/if} rounded-full blur-[140px] animate-ambient-glow pointer-events-none z-0" style="animation-delay: -3s;"></div>

  <div class="relative z-10 max-w-xl mx-auto space-y-6">
    
    <header class="mb-4">
      <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Quest Deployer</span>
      <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Chores Grid ⚔️</h1>
    </header>

    <div class="p-5 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-3xl">
      <h3 class="text-xs font-mono font-black text-zinc-400 uppercase tracking-wider mb-4">Deploy New Household Quest</h3>
      
      <form on:submit={handleCreateChore} class="space-y-3.5">
        <input 
          type="text" 
          placeholder="Quest Title (e.g., Clean the kitchen counter)" 
          bind:value={title}
          required
          class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-orange/40 text-white placeholder-zinc-600 transition-all"
        />

        <div class="grid grid-cols-2 gap-3">
          <select 
            bind:value={assigneeId} 
            required
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-cyber-orange/40 text-zinc-300 transition-all"
          >
            <option value="" disabled selected>Assign Operator</option>
            {#each roommates as rm}
              <option value={rm.id}>{rm.username}</option>
            {/each}
          </select>

          <input 
            type="date" 
            bind:value={dueDate}
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-cyber-orange/40 text-zinc-300 transition-all font-mono"
          />
        </div>

        <div class="flex items-center justify-between p-3 bg-zinc-950/30 border border-white/[0.03] rounded-xl">
          <label class="flex items-center gap-3 cursor-pointer select-none text-xs font-mono text-zinc-400">
            <input 
              type="checkbox" 
              bind:checked={isRecurring} 
              disabled={!isPremium}
              class="w-4 h-4 rounded border-white/10 bg-zinc-900 text-cyber-amber focus:ring-0 focus:ring-offset-0 disabled:opacity-30 cursor-pointer"
            />
            <span>Auto-Repeat Every Week</span>
          </label>
          
          {#if !isPremium}
            <span class="text-[8px] font-black font-mono bg-cyber-amber/10 border border-cyber-amber/30 text-cyber-amber px-1.5 py-0.5 rounded uppercase tracking-wider">
              Premium Only
            </span>
          {/if}
        </div>

        <div class="flex items-center gap-4 pt-1">
          <div class="flex items-center gap-2 bg-zinc-950/60 border border-white/5 px-4 py-2.5 rounded-xl min-w-[120px] justify-center">
            <span class="text-[10px] font-mono text-zinc-500 uppercase font-bold">Reward:</span>
            <input 
              type="number" 
              min="5" 
              max="200" 
              bind:value={points}
              class="bg-transparent border-none text-sm font-mono font-black text-cyber-amber w-10 p-0 text-center focus:ring-0"
            />
            <span class="text-[10px] font-mono text-cyber-amber font-bold">XP</span>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            class="flex-1 py-3 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-40"
          >
            {isSubmitting ? 'Deploying...' : 'Deploy Quest'}
          </button>
        </div>
      </form>
    </div>

    <div class="space-y-3">
      <h3 class="text-xs font-mono font-black text-zinc-400 uppercase tracking-wider px-1">Active Operations Ledger</h3>
      
      {#if chores.length === 0}
        <div class="p-8 text-center bg-cyber-card/20 border border-white/[0.04] rounded-3xl text-zinc-600 text-xs font-mono">
          No active quests in this sector.
        </div>
      {:else}
        <div class="space-y-2.5">
          {#each chores as chore}
            <div class="p-4 bg-cyber-card/40 border {chore.is_done ? 'border-zinc-800/40 opacity-50' : 'border-white/[0.06]'} backdrop-blur-xl rounded-2xl flex items-center justify-between transition-all">
              <div class="space-y-1 max-w-[70%]">
                <h4 class="text-sm font-bold tracking-tight {chore.is_done ? 'line-through text-zinc-500' : 'text-white'}">
                  {chore.title}
                </h4>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-zinc-500">
                  <span>Operator: <strong class="text-zinc-300">{chore.profiles?.username || 'Unassigned'}</strong></span>
                  {#if chore.due_date}
                    <span>Due: <strong class="text-zinc-400">{chore.due_date}</strong></span>
                  {/if}
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="font-mono text-xs font-black text-cyber-amber bg-zinc-950/60 border border-white/5 px-2 py-1 rounded-xl">
                  +{chore.points} XP
                </span>

                {#if !chore.is_done}
                  <button 
                    on:click={() => handleCompleteChore(chore.id, chore.points, chore.assignee_id)}
                    type="button"
                    class="p-2 bg-cyber-green/10 hover:bg-cyber-green text-cyber-green hover:text-black border border-cyber-green/20 rounded-xl transition-all cursor-pointer text-xs font-bold"
                  >
                    ✔
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

  </div>

  <BottomNav />

</div>