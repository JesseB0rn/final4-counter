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

  <div class="flex flex-col m-4 items-center">
    <div class="flex flex-row items-center">
      <select class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" v-model="nameAInput">
        <option value="">Select Team A</option>
        <option v-for="team in teams" :key="team.id" :value="[team.name, team.id]">{{ team.name }}</option>
      </select>
      <select class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" v-model="nameBInput">
        <option value="">Select Team B</option>
        <option v-for="team in teams" :key="team.id" :value="[team.name, team.id]">{{ team.name }}</option>
      </select>
    </div>
    <div class="flex flex-row items-center m-4">
      <label for="shownSet" class="mr-4">Set</label>
      <div class="flex flex-row items-center rounded-2xl bg-stone-800">
        <button class="p-4 text-white w-12" @click="shownSet++">+</button>
        <input type="number" class="rounded-2xl bg-stone-200 mr-0 p-4 grow font-bold w-16" placeholder="B" v-model="shownSet" />
        <button class="p-4 text-white w-12" @click="shownSet--">-</button>
      </div>
    </div>
    <div class="flex flex-row m-4">
      <div class="flex flex-row items-center rounded-2xl bg-stone-800">
        <button class="p-4 text-white min-w-12" @click="scoreA++">+</button>
        <input type="number" class="rounded-2xl bg-stone-200 mr-0 p-4 grow font-bold w-16" placeholder="B" v-model="scoreA" />
        <button class="p-4 text-white min-w-12" @click="scoreA--">-</button>
      </div>
      <span class="mx-4 text-bold text-2xl">:</span>
      <div class="flex flex-row items-center rounded-2xl bg-stone-800">
        <button class="p-4 text-white min-w-12" @click="scoreB++">+</button>
        <input type="number" class="rounded-2xl bg-stone-200 mr-0 p-4 grow font-bold w-16" placeholder="B" v-model="scoreB" />
        <button class="p-4 text-white min-w-12" @click="scoreB--">-</button>
      </div>
    </div>
    <div class="m-4">
      <label class="mr-4">
        <input type="checkbox" v-model="showGame" />
        Show Game
      </label>
    </div>
  </div>

  <!-- <set-input></set-input> -->
</template>

<script setup lang="ts">
import GameCounter from "../components/GameCounter.vue";

import { useRoute } from "vue-router";
const route = useRoute();

const host = window.location.host;

import { computed, watch } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";
import type { ITeam } from "../interfaces/team";
import { useGameStore } from "../stores/gameStore";
import { useMessageStore } from "../stores/messageStore";
const msgStore = useMessageStore();
msgStore.setRole("admin");
const gameStore = useGameStore();

const teams = useLocalStorage<ITeam[]>("teams", []);

const nameAInput = computed({
  get: () => [gameStore.nameA, gameStore.idA],
  set: (value) => {
    gameStore.setNameA(value[0]);
    gameStore.setIdA(value[1]);
  },
});
const nameBInput = computed({
  get: () => [gameStore.nameB, gameStore.idB],
  set: (value) => {
    gameStore.setNameB(value[0]);
    gameStore.setIdB(value[1]);
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

const showGame = computed({
  get: () => gameStore.shouldShowGame,
  set: (value) => {
    gameStore.gameData.showGame = value;
  },
});

gameStore.setGameState({
  AName: "STV Oberentfelden",
  BName: "STV Affeltrangen",
  AId: undefined,
  BId: undefined,
  ALogo: undefined,
  BLogo: undefined,
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
  currentSetShow: 1,
  showGame: false,
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
  { immediate: true, deep: true },
);
</script>
<style scoped></style>
