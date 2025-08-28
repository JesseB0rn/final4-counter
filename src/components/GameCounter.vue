<template>
  <div class="flex flex-col w-full font-bold bg-white" :class="{ 'h-screen': !!$slots.default }">
    <div class="flex justify-between mx-10 my-4 mt-8 text-6xl">
      <div class="text-red-500">{{ gameStore.setsWonA }}</div>
      <div class="text-6xl text-red-500">{{ gameStore.currentSetShow }}</div>

      <div class="text-red-500">{{ gameStore.setsWonB }}</div>
    </div>

    <div class="relative flex justify-center mx-10 my-4 items-center text-[8em]">
      <span class="text-4xl text-nowrap shrink min-w-0 flex-1">{{ gameStore.nameA }}</span>
      <div class="w-32 text-right">{{ gameStore.pointsWonA }}</div>
      <div class="mx-4">–</div>
      <div class="w-32">{{ gameStore.pointsWonB }}</div>
      <span class="text-4xl text-nowrap shrink min-w-0 text-right flex-1">{{ gameStore.nameB }}</span>
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
