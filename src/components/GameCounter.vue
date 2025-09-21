<template>
  <div class="flex flex-col w-full font-bold bg-white mb-12" :class="{ 'h-screen': !!$slots.default }">
    <template v-if="gameStore.shouldShowGame.value" name="game">
      <div class="flex justify-between mx-10 my-4 mt-8 text-6xl">
        <div class="text-red-500 text-[9rem]">{{ gameStore.setsWonA }}</div>
        <div class="text-8xl text-red-500">{{ gameStore.currentSetShow }}</div>

        <div class="text-red-500 text-[9rem]">{{ gameStore.setsWonB }}</div>
      </div>

      <div class="relative flex justify-center mx-10 my-4 items-center text-[12rem]">
        <div class="flex flex-col flex-1">
          <span class="text-7xl text-nowrap min-w-0 flex-1 mb-8">{{ gameStore.nameA }}</span>
          <div class="flex justify-center mb-8" v-if="imageDataURIs[teams?.find((team) => team.id === gameStore.idA.value)?.filename ?? '']">
            <img :src="imageDataURIs[teams?.find((team) => team.id === gameStore.idA.value)?.filename ?? '']" alt="Team A Logo" class="w-[700px] h-64 object-contain mt-4" />
          </div>
        </div>
        <div class="w-64 text-right">{{ gameStore.pointsWonA }}</div>
        <div class="mx-4">–</div>
        <div class="w-64">{{ gameStore.pointsWonB }}</div>
        <div class="flex flex-col flex-1">
          <span class="text-7xl text-nowrap min-w-0 text-right flex-1 mb-8">{{ gameStore.nameB }}</span>
          <div class="flex justify-center mb-8" v-if="imageDataURIs[teams?.find((team) => team.id === gameStore.idB.value)?.filename ?? '']">
            <img :src="imageDataURIs[teams?.find((team) => team.id === gameStore.idB.value)?.filename ?? '']" alt="Team B Logo" class="w-[700px] h-64 object-contain mt-4" />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-center items-center mt-32">
        <img src="../assets/FBC_Logo_farbig.png" alt="" class="w-[1200px] object-contain" />
      </div>
    </template>

    <template v-if="$slots.default">
      <div class="ads bg-gray-100 w-full absolute bottom-0"><slot></slot></div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { useGameStore } from "../stores/gameStore";
import { useLocalStorage } from "../composables/useLocalStorage";
import type { ITeam } from "../interfaces/team";
import { useOPFS } from "../composables/useOPFS";

const gameStore = toRefs(useGameStore());
const teams = useLocalStorage<ITeam[]>("teams", []);
const imageDataURIs = ref<Record<string, string>>({});

const opfsFileToDataURI = async (filename: string): Promise<string | null> => {
  const file = await useOPFS().readFile(filename);
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve) => {
      reader.onload = () => {
        const dataURI = reader.result as string;

        resolve(dataURI);
      };
    });
  }
  return null;
};

watch(
  teams,
  (newTeams) => {
    // Update imageDataURIs when the config changes
    newTeams?.forEach((team) => {
      if (team.filename) {
        opfsFileToDataURI(team.filename).then((dataURI) => {
          console.log("Loaded image for team:", team.name);
          if (dataURI) {
            imageDataURIs.value[team.filename] = dataURI;
          }
        });
      }
    });
  },
  { immediate: true }
);
</script>
