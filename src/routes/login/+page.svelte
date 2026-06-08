<script>
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  // Состояние экрана
  let isSignUp = false; // Переключатель: false = Вход, true = Регистрация
  let email = '';
  let password = '';
  let username = '';
  let inviteCode = '';
  let loading = false;
  let errorMessage = '';

  // Основная функция аутентификации
  async function handleAuth() {
    if (loading) return;
    loading = true;
    errorMessage = '';

    if (isSignUp) {
      // --- ЛОГИКА РЕГИСТРАЦИИ НОВОГО ПОЛЬЗОВАТЕЛЯ ---
      if (!username.trim()) {
        errorMessage = 'Agent name (username) is required.';
        loading = false;
        return;
      }

      // 1. Создаем аккаунт в Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        errorMessage = authError.message;
        loading = false;
        return;
      }

      const user = authData?.user;
      if (user) {
        // 2. Обрабатываем инвайт-код для определения household_id
        let targetHouseholdId = null;

        if (inviteCode.trim()) {
          // Если код введен, ищем существующий дом
          const { data: household } = await supabase
            .from('households')
            .select('id')
            .eq('invite_code', inviteCode.trim())
            .single();

          if (household) {
            targetHouseholdId = household.id;
          } else {
            // Если код неверный, создаем новый дом с этим кодом
            const { data: newHousehold } = await supabase
              .from('households')
              .insert([{ invite_code: inviteCode.trim() }])
              .select('id')
              .single();
            if (newHousehold) targetHouseholdId = newHousehold.id;
          }
        } else {
          // Если инвайт-код пустой, генерируем случайный уникальный сектор
          const randomCode = 'SEC-' + Math.random().toString(36).substring(2, 9).toUpperCase();
          const { data: newHousehold } = await supabase
            .from('households')
            .insert([{ invite_code: randomCode }])
            .select('id')
            .single();
          if (newHousehold) targetHouseholdId = newHousehold.id;
        }

        // 3. Создаем публичный профиль пользователя в таблице profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              username: username.trim(),
              household_id: targetHouseholdId,
              points: 100, // Стартовый капитал энергии/XP
            },
          ]);

        if (profileError) {
          errorMessage = profileError.message;
        } else {
          // Успешно зарегистрирован, отправляем в хаб
          goto('/');
        }
      }
    } else {
      // --- ЛОГИКА АВТОРИЗАЦИИ (ВХОД) ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        errorMessage = error.message;
      } else {
        goto('/');
      }
    }
    loading = false;
  }
</script>

<div class="w-full min-h-screen bg-[#0A0A0E] text-white flex items-center justify-center p-4 relative overflow-hidden">
  
  <!-- ДИНАМИЧЕСКИЙ ЭМБИЕНТ-БЭКГРАУНД -->
  <div class="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-cyber-orange/10 rounded-full blur-[140px] animate-ambient-glow pointer-events-none z-0"></div>
  <div class="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-cyber-amber/5 rounded-full blur-[140px] animate-ambient-glow pointer-events-none z-0" style="animation-delay: -4s;"></div>

  <!-- КАРТОЧКА ИНТЕРФЕЙСА -->
  <div class="relative z-10 w-full max-w-md p-8 bg-cyber-card/40 border border-white/[0.06] backdrop-blur-xl rounded-[32px] shadow-2xl space-y-6">
    
    <!-- ЗАГОЛОВОК СИСТЕМЫ -->
    <div class="text-center">
      <div class="inline-block px-3 py-1 bg-cyber-orange/10 border border-cyber-orange/20 rounded-full text-[9px] font-mono tracking-widest text-cyber-orange uppercase mb-3">
        System Gateway v1.0.4
      </div>
      <h1 class="text-2xl font-black tracking-tight">
        {#if isSignUp}Access Registration{:else}Identity Verification{/if}
      </h1>
      <p class="text-xs text-zinc-500 mt-1 font-medium">
        {#if isSignUp}Create a secure encryption key to access the perimeter{:else}Scan your clearance protocols to synchronize data stream{/if}
      </p>
    </div>

    <!-- ВЫВОД ОШИБОК -->
    {#if errorMessage}
      <div class="p-3.5 bg-cyber-orange/10 border border-cyber-orange/30 rounded-xl text-xs font-semibold text-cyber-orange text-center">
        ⚠ {errorMessage}
      </div>
    {/if}

    <!-- ФОРМА ВВОДА -->
    <form on:submit|preventDefault={handleAuth} class="space-y-4">
      
      {#if isSignUp}
        <!-- Поле Имя (только при регистрации) -->
        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="username">Agent Pseudonym</label>
          <input 
            id="username"
            type="text" 
            bind:value={username}
            placeholder="E.g., NeonRider" 
            required
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-orange/40 transition-colors placeholder-zinc-700"
          />
        </div>
      {/if}

      <!-- Поле Email -->
      <div>
        <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="email">E-Mail Address</label>
        <input 
          id="email"
          type="email" 
          bind:value={email}
          placeholder="name@domain.com" 
          required
          class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-orange/40 transition-colors placeholder-zinc-700"
        />
      </div>

      <!-- Поле Пароль -->
      <div>
        <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="password">Security Password</label>
        <input 
          id="password"
          type="password" 
          bind:value={password}
          placeholder="••••••••" 
          required
          class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-orange/40 transition-colors placeholder-zinc-800"
        />
      </div>

      {#if isSignUp}
        <!-- Поле Инвайт-код (только при регистрации) -->
        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5" for="invite">Sector Invite Code <span class="text-zinc-600 font-normal">(Optional)</span></label>
          <input 
            id="invite"
            type="text" 
            bind:value={inviteCode}
            placeholder="Leave blank to deploy a new sector" 
            class="w-full bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-cyber-orange/40 transition-colors placeholder-zinc-700"
          />
        </div>
      {/if}

      <!-- Кнопка подтверждения -->
      <button 
        type="submit" 
        disabled={loading}
        class="w-full py-3.5 bg-cyber-orange text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer border-none mt-2 shadow-neon-orange/15"
      >
        {#if loading}
          Establishing Connection...
        {:else if isSignUp}
          Initialize Master Profile
        {:else}
          Unlock Terminal Access
        {/if}
      </button>
    </form>

    <!-- ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ -->
    <div class="text-center pt-2 border-t border-white/[0.04]">
      <button 
        type="button"
        on:click={() => { isSignUp = !isSignUp; errorMessage = ''; }}
        class="text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
      >
        {#if isSignUp}
          Already registered? <span class="text-cyber-orange">Verify Identity</span>
        {:else}
          New operator? <span class="text-cyber-orange">Create Master Profile</span>
        {/if}
      </button>
    </div>

  </div>
</div>