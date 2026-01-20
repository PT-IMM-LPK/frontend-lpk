<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="w-screen h-screen min-h-screen">
    <RouterView />
  </div>
</template>

<style scoped>
:global(html),
:global(body) {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>