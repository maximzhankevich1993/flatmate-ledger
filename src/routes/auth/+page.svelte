<script>
  import { supabase } from '$lib/supabaseClient';

  let email = '';
  let password = '';
  let username = '';
  let isLogin = true; 
  let loading = false;
  let errorMessage = '';
  let successMessage = '';

  async function handleAuth() {
    loading = true;
    errorMessage = '';
    successMessage = '';

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        errorMessage = error.message;
      } else {
        successMessage = 'Access granted. Entering the Citadel...';
        setTimeout(() => { window.location.href = '/'; }, 1000);
      }
    } else {
      if (!username.trim()) {
        errorMessage = 'Username is required';
        loading = false;
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username } }
      });

      if (error) {
        errorMessage = error.message;
      } else {
        successMessage = 'Success! Check your email for confirmation.';
      }
    }
    loading = false;
  }
</script>

<div class="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-5 relative overflow-hidden select-none">
  
  <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyber-orange/10 rounded-full blur-[120px] pointer-events-none"></div>
  <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyber-amber/10 rounded-full blur-[120px] pointer-events-none"></div>

  <div class="w-full max-w-[400px] bg-cyber-card/30 border border-white/[0.06] backdrop-blur-3xl rounded-[32px] p-8 shadow-2xl relative z-10 transition-all duration-500">
    
    <div class="relative w-full h-12 bg-zinc-950/80 border border-white/[0.04] rounded-2xl p-1 flex items-center mb-8 overflow-hidden">
      <div 
        class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-gradient-to-r from-cyber-orange to-cyber-amber rounded-xl transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-neon-orange/20"
        style="transform: translateX({isLogin ? '0%' : '100%'});"
      ></div>
      
      <button 
        type="button"
        on:click={() => { isLogin = true; errorMessage = ''; successMessage = ''; }}
        class="relative z-10 flex-1 h-full text-xs font-black uppercase tracking-wider text-center transition-colors duration-300 bg-transparent border-none cursor-pointer
          {isLogin ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'}"
      >
        Login
      </button>
      <button 
        type="button"
        on:click={() => { isLogin = false; errorMessage = ''; successMessage = ''; }}
        class="relative z-10 flex-1 h-full text-xs font-black uppercase tracking-wider text-center transition-colors duration-300 bg-transparent border-none cursor-pointer
          {!isLogin ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'}"
      >
        Register
      </button>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-black tracking-tight text-white">
        {isLogin ? 'Sign in to Citadel' : 'Create operational profile'}
      </h2>
      <p class="text-[11px] text-zinc-500 mt-1 font-medium">
        {isLogin ? 'Please enter your system access keys.' : 'Set up your credentials for the shared grid.'}
      </p>
    </div>

    {#if errorMessage}
      <div class="p-3.5 mb-5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] font-semibold text-rose-400 text-center animate-fade-in">
        {errorMessage}
      </div>
    {/if}

    {#if successMessage}
      <div class="p-3.5 mb-5 bg-cyber-green/10 border border-cyber-green/20 rounded-xl text-[11px] font-semibold text-cyber-green text-center animate-fade-in">
        {successMessage}
      </div>
    {/if}

    <form on:submit|preventDefault={handleAuth} class="space-y-6">
      
      {#if !isLogin}
        <div class="relative w-full group">
          <input 
            id="username"
            type="text" 
            bind:value={username}
            placeholder=" "
            required
            class="peer w-full bg-transparent border-0 border-b-2 border-zinc-800 py-2 text-sm font-bold text-white focus:outline-none focus:ring-0 focus:border-cyber-orange transition-colors placeholder-transparent"
          />
          <label 
            for="username"
            class="absolute left-0 top-2 text-xs font-bold text-zinc-600 uppercase tracking-wider pointer-events-none transition-all duration-300 origin-[0]
              peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-medium
              peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-cyber-orange peer-focus:font-bold
              [:not(:placeholder-shown)]:top-[-16px] [:not(:placeholder-shown)]:text-xs [:not(:placeholder-shown)]:text-cyber-orange"
          >
            Username
          </label>
          <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-cyber-orange transition-all duration-300 group-focus-within:w-full"></span>
        </div>
      {/if}

      <div class="relative w-full group">
        <input 
          id="email"
          type="email" 
          bind:value={email}
          placeholder=" "
          required
          class="peer w-full bg-transparent border-0 border-b-2 border-zinc-800 py-2 text-sm font-bold text-white focus:outline-none focus:ring-0 focus:border-cyber-amber transition-colors placeholder-transparent"
        />
        <label 
          for="email"
          class="absolute left-0 top-2 text-xs font-bold text-zinc-600 uppercase tracking-wider pointer-events-none transition-all duration-300 origin-[0]
            peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-medium
            peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-cyber-amber peer-focus:font-bold
            [:not(:placeholder-shown)]:top-[-16px] [:not(:placeholder-shown)]:text-xs [:not(:placeholder-shown)]:text-cyber-amber"
        >
          Email Address
        </label>
        <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-cyber-amber transition-all duration-300 group-focus-within:w-full"></span>
      </div>

      <div class="relative w-full group">
        <input 
          id="password"
          type="password" 
          bind:value={password}
          placeholder=" "
          required
          class="peer w-full bg-transparent border-0 border-b-2 border-zinc-800 py-2 text-sm font-bold text-white focus:outline-none focus:ring-0 focus:border-cyber-orange transition-colors placeholder-transparent"
        />
        <label 
          for="password"
          class="absolute left-0 top-2 text-xs font-bold text-zinc-600 uppercase tracking-wider pointer-events-none transition-all duration-300 origin-[0]
            peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:top-2 peer-placeholder-shown:font-medium
            peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-cyber-orange peer-focus:font-bold
            [:not(:placeholder-shown)]:top-[-16px] [:not(:placeholder-shown)]:text-xs [:not(:placeholder-shown)]:text-cyber-orange"
        >
          Password
        </label>
        <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-cyber-orange transition-all duration-300 group-focus-within:w-full"></span>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        class="w-full h-12 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer border-none mt-4 shadow-xl flex items-center justify-center gap-2"
      >
        {#if loading}
          <span class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          <span>Syncing...</span>
        {:else}
          <span>Execute →</span>
        {/if}
      </button>

    </form>

  </div>
</div>

<style>
  /* Кастомный фикс для селекторов Tailwind, обрабатывающий заполненные поля */
  input:-webkit-autofill {
    -webkit-text-fill-color: #fff !important;
    transition: background-color 5000s ease-in-out 0s;
  }
</style>