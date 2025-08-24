<template>
  <Game-counter ref="gameCounterRef" @click="requestFullscreen">hi</Game-counter>
</template>

<script setup lang="ts">
import { useMessageStore } from "../stores/messageStore";
import { useGameStore } from "../stores/gameStore";
import GameCounter from "../components/GameCounter.vue";
import { watch, onMounted, ref } from "vue";

const msgstore = useMessageStore();

const gameCounterRef = ref<InstanceType<typeof GameCounter> | null>(null);

msgstore.setRole("display");

const requestFullscreen = () => {
  // Try to find the DOM element to request fullscreen
  const el = gameCounterRef.value?.$el as HTMLElement | undefined;
  if (el && el.requestFullscreen) {
    el.requestFullscreen().catch((err) => {
      console.error(`Error enabling fullscreen: ${err.message}`);
    });
  }
};

watch(
  () => msgstore.lastMessage,
  (newValue) => {
    if (newValue) {
      console.log("New message received:", JSON.stringify(newValue));
      if (newValue.type === "update" && newValue.payload.action === "setGameState") {
        console.log("Updating game state with:", newValue.payload.data);
        useGameStore().setGameState(newValue.payload.data);
      }
    }
  },
  { immediate: true }
);
</script>
<style scoped></style>
