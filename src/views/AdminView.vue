<template>
  <header class="w-full py-8 px-4 bg-stone-200 text-4xl font-bold mb-4">
    <h1>Admin Panel</h1>
    <div class="flex flex-row justify-start gap-4">
      <router-link v-if="route.name != 'Admin'" to="/" class="text-2xl text-stone-600 hover:text-stone-800">
        <span>Back</span>
      </router-link>
      <router-link v-if="route.name != 'Sponsors'" to="/ads" class="text-2xl text-stone-600 hover:text-stone-800">
        <span>Sponsoren</span>
      </router-link>
      <router-link v-if="route.name != 'Teams'" to="/teams" class="text-2xl text-stone-600 hover:text-stone-800">
        <span>Teams</span>
      </router-link>

      <a :href="`//${host}/dsp`" target="_blank" rel="noopener noreferrer">🖥️</a>

      <!-- <button>▶️</button>
      <button>⏹️</button> -->
    </div>
  </header>

  <div class="border-2 border-stone-400 m-4">
    <Game-counter></Game-counter>
  </div>
  <input type="text" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" placeholder="A" v-model="nameAInput" />
  <input type="text" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" placeholder="B" v-model="nameBInput" />
  <input type="number" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" placeholder="B" v-model="shownSet" />
  <input type="number" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" placeholder="B" v-model="scoreA" />
  <input type="number" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" placeholder="B" v-model="scoreB" />

  <!-- <set-input></set-input> -->
</template>

<script setup lang="ts">
import GameCounter from "../components/GameCounter.vue";

import { useRoute } from "vue-router";
const route = useRoute();

const host = window.location.host;

import { useMessageStore } from "../stores/messageStore";
import { useGameStore } from "../stores/gameStore";
import { watch } from "vue";
import { computed } from "vue";
const msgStore = useMessageStore();
msgStore.setRole("admin");
const gameStore = useGameStore();

const nameAInput = computed({
  get: () => gameStore.nameA,
  set: (value) => {
    gameStore.setNameA(value);
  },
});
const nameBInput = computed({
  get: () => gameStore.nameB,
  set: (value) => {
    gameStore.setNameB(value);
  },
});
const shownSet = computed({
  get: () => gameStore.currentSetShow,
  set: (value) => {
    gameStore.gameData.currentSetShow = value;
  },
});

const scoreA = computed({
  get: () => gameStore.gameData.sets[gameStore.currentSetShow - 1].scoreA,
  set: (value) => {
    gameStore.gameData.sets[gameStore.currentSetShow - 1].scoreA = value;
  },
});
const scoreB = computed({
  get: () => gameStore.gameData.sets[gameStore.currentSetShow - 1].scoreB,
  set: (value) => {
    gameStore.gameData.sets[gameStore.currentSetShow - 1].scoreB = value;
  },
});

gameStore.setGameState({
  AName: "STV Oberentfelden",
  BName: "STV Affeltrangen",
  sets: [
    { setNumber: 1, scoreA: 0, scoreB: 0 },
    { setNumber: 2, scoreA: 0, scoreB: 0 },
    { setNumber: 3, scoreA: 0, scoreB: 0 },
    { setNumber: 4, scoreA: 0, scoreB: 0 },
    { setNumber: 5, scoreA: 0, scoreB: 0 },
    { setNumber: 6, scoreA: 0, scoreB: 0 },
    { setNumber: 7, scoreA: 0, scoreB: 0 },
    { setNumber: 8, scoreA: 0, scoreB: 0 },
    { setNumber: 9, scoreA: 0, scoreB: 0 },
  ],
});

watch(
  gameStore.fullGameState,
  (newValue) => {
    console.log("New game state:", JSON.stringify(newValue));
    msgStore.sendMessage({
      type: "update",
      payload: {
        action: "setGameState",
        data: JSON.parse(JSON.stringify(newValue)),
      },
    });
  },
  { immediate: true }
);
</script>
<style scoped></style>
