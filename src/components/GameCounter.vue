<template>
  <div class="flex flex-col w-full font-bold bg-white" :class="{ 'h-screen': !!$slots.default }">
    <div class="flex justify-between mx-8 my-8 text-8xl">
      <div class="text-red-500">{{ gameStore.setsWonA }}</div>
      <div class="text-6xl text-red-500">{{ gameStore.currentSetShow }}</div>

      <div class="text-red-500">{{ gameStore.setsWonB }}</div>
    </div>

    <div class="relative flex justify-center mx-8 my-8 items-baseline text-[10em]">
      <div class="w-64 text-right">{{ gameStore.pointsWonA }}</div>
      <div class="mx-4">–</div>
      <div class="w-64">{{ gameStore.pointsWonB }}</div>
      <div class="absolute inset-0 flex items-center justify-between pointer-events-none w-full text-6xl">
        <!-- Overlay content here -->
        <span class="">{{ gameStore.nameA }}</span>
        <span class="">{{ gameStore.nameB }}</span>
      </div>
    </div>
    <template v-if="$slots.default">
      <div class="ads bg-gray-100 w-full h-full grow"><slot></slot></div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue";
import { useGameStore } from "../stores/gameStore";

const gameStore = toRefs(useGameStore());
</script>
