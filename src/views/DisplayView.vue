<template>
  <Game-counter ref="gameCounterRef" @click="requestFullscreen">
    <Ad-Banner></Ad-Banner>
  </Game-counter>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import AdBanner from "../components/AdBanner.vue";
import GameCounter from "../components/GameCounter.vue";
import { useLocalStorage } from "../composables/useLocalStorage";
import type { ITeam } from "../interfaces/team";
import { useGameStore } from "../stores/gameStore";
import { useMessageStore } from "../stores/messageStore";

const msgstore = useMessageStore();

const gameCounterRef = ref<InstanceType<typeof GameCounter> | null>(null);
const teams = useLocalStorage<ITeam[]>("teams", []);

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
      if (newValue.type === "update" && newValue.payload.action === "updateTeams") {
        console.log("Updating teams with:", newValue.payload.data);
        teams.value = JSON.parse(newValue.payload.data);
      }
    }
  },
  { immediate: true },
);
</script>
<style scoped></style>
