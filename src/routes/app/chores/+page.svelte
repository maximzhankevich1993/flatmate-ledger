<script>
  import BottomNav from '$lib/components/ui/BottomNav.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { invalidateAll } from '$app/navigation';

  export let data;
  $: ({ chores, roommates, profile, isPremium } = data);

  let title = '';
  let points = 10;
  let dueDate = '';
  let assigneeId = '';
  let isRecurring = false;
  let isSubmitting = false;

  // Константа штрафа за просрочку
  const OVERDUE_PENALTY = 20;

  // Функция для проверки, просрочен ли квест
  function isChoreOverdue(due_date, is_done) {
    if (!due_date || is_done) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(due_date);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  }

  async function handleCreateChore(e) {
    e.preventDefault();
    if (!title || !assigneeId || isSubmitting) return;

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
      title = '';
      points = 10;
      dueDate = '';
      assigneeId = '';
      isRecurring = false;
      await invalidateAll();
    } else {
      alert('Error creating chore: ' + error.message);
    }
    isSubmitting = false;
  }

  async function handleCompleteChore(choreId, pointsReward, assigneeUuid, isOverdue) {
    // 1. Помечаем задачу как выполненную
    const { error: choreError } = await supabase
      .from('chores')
      .update({ is_done: true })
      .eq('id', choreId);

    if (choreError) {
      alert('Error updating chore status: ' + choreError.message);
      return;
    }

    // 2. Вытаскиваем текущие очки пользователя
    const { data: userProfile, error: profileGetError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', assigneeUuid)
      .single();

    if (profileGetError) return;

    // 3. Считаем итоговую награду с учетом штрафа Habitica-style
    // Если задача просрочена, вычитаем штраф (очки могут уйти в минус!)
    const finalReward = isOverdue ? (pointsReward - OVERDUE_PENALTY) : pointsReward;
    const newPoints = (userProfile.points || 0) + finalReward;

    await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', assigneeUuid);

    // Показываем сочное киберпанк-уведомление
    if (isOverdue) {
      alert(`Quest completed, but system detected inefficiency! Overdue penalty applied: ${finalReward} XP adjusted.`);
    }

    await invalidateAll();
  }
</script>

<div class="w-full min-h-screen text-white p-5 pb-32 md:p-10 md:pb-24 relative overflow-hidden">
  
  <!-- ДИНАМИЧЕСКИЙ ЭМБИЕНТ-БЭКГРАУНД -->
  <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-zinc-800/10 rounded-full blur-[130px] animate-ambient-glow pointer-events-none z-0"></div>
  <div class="absolute bottom-[-10%] left-[-10%] w-96 h-96 {#if isPremium}bg-cyber-amber/10{:else}bg-cyber-orange/5{/if} rounded-full blur-[140px] animate-ambient-glow pointer-events-none z-0" style="animation-delay: -3s;"></div>

  <div class="relative z-10 max-w-xl mx-auto space-y-6">
    
    <!-- ХЕДЕР -->
    <header class="mb-4">
      <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Quest Deployer</span>
      <h1 class="text-3xl font-black tracking-tight text-white mt-0.5">Chores Grid ⚔️</h1>
    </header>

    <!-- ФОРМА СОЗДАНИЯ ЗАДАЧИ -->
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

        <!-- МОДУЛЬ РЕКУРСИИ ДЛЯ ПРЕМИУМА -->
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

    <!-- СПИСОК ЗАДАЧ С СИСТЕМОЙ ШТРАФОВ -->
    <div class="space-y-3">
      <h3 class="text-xs font-mono font-black text-zinc-400 uppercase tracking-wider px-1">Active Operations Ledger</h3>
      
      {#if chores.length === 0}
        <div class="p-8 text-center bg-cyber-card/20 border border-white/[0.04] rounded-3xl text-zinc-600 text-xs font-mono">
          No active quests in this sector.
        </div>
      {:else}
        <div class="space-y-2.5">
          {#each chores as chore}
            {@const overdue = isChoreOverdue(chore.due_date, chore.is_done)}
            
            <!-- Динамический лоск: Красный неон и пульсация для просроченных квестов -->
            <div class="p-4 bg-cyber-card/40 border backdrop-blur-xl rounded-2xl flex items-center justify-between transition-all duration-300
              {chore.is_done ? 'border-zinc-800/40 opacity-50' : overdue ? 'border-red-500/40 bg-red-950/5 shadow-neon-red/10 animate-pulse' : 'border-white/[0.06]'}"
            >
              <div class="space-y-1 max-w-[65%]">
                <h4 class="text-sm font-bold tracking-tight 
                  {chore.is_done ? 'line-through text-zinc-500' : overdue ? 'text-red-400 font-extrabold' : 'text-white'}"
                >
                  {chore.title}
                </h4>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-zinc-500">
                  <span>Operator: <strong class="{overdue ? 'text-red-300/80' : 'text-zinc-300'}">{chore.profiles?.username || 'Unassigned'}</strong></span>
                  {#if chore.due_date}
                    <span class="{overdue ? 'text-red-400 font-bold' : 'text-zinc-500'}">
                      {overdue ? '⚠️ EXPIRED:' : 'Due:'} <strong>{chore.due_date}</strong>
                    </span>
                  {/if}
                </div>
              </div>

              <div class="flex items-center gap-3">
                <!-- Динамический подсчет награды/штрафа на плашке -->
                {#if overdue}
                  <span class="font-mono text-[11px] font-black text-red-400 bg-zinc-950/80 border border-red-500/20 px-2 py-1 rounded-xl">
                    {chore.points - OVERDUE_PENALTY} XP
                  </span>
                {:else}
                  <span class="font-mono text-xs font-black text-cyber-amber bg-zinc-950/60 border border-white/5 px-2 py-1 rounded-xl">
                    +{chore.points} XP
                  </span>
                {/if}

                {#if !chore.is_done}
                  <button 
                    on:click={() => handleCompleteChore(chore.id, chore.points, chore.assignee_id, overdue)}
                    type="button"
                    class="p-2 border rounded-xl transition-all cursor-pointer text-xs font-bold
                      {overdue ? 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black border-red-500/20' : 'bg-cyber-green/10 hover:bg-cyber-green text-cyber-green hover:text-black border-cyber-green/20'}"
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