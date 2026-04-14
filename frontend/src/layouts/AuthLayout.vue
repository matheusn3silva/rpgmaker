<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 transition-colors duration-200"
    style="background-color: var(--bg-page);"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1
          class="text-3xl font-bold tracking-widest uppercase"
          style="color: #f59e0b;"
        >
          RPG Maker
        </h1>
        <p class="text-sm mt-1" style="color: var(--text-faint);">Forje sua lenda</p>
      </div>
      <slot />
    </div>
  </div>
</template>