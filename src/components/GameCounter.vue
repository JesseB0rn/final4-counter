<template>
  <div class="flex flex-col w-full font-bold bg-white" :class="{ 'h-screen': !!$slots.default }">
    <div class="flex justify-between mx-10 my-4 mt-8 text-6xl">
      <div class="text-red-500">{{ gameStore.setsWonA }}</div>
      <div class="text-6xl text-red-500">{{ gameStore.currentSetShow }}</div>

      <div class="text-red-500">{{ gameStore.setsWonB }}</div>
    </div>

    <div class="relative flex justify-center mx-10 my-4 items-center text-[8em]">
      <div class="flex flex-col flex-1">
        <span class="text-4xl text-nowrap shrink min-w-0 flex-1">{{ gameStore.nameA }}</span>
        <div class="flex justify-center" v-if="imageDataURIs[teams?.find((team) => team.id === gameStore.idA.value)?.filename ?? '']">
          <img :src="imageDataURIs[teams?.find((team) => team.id === gameStore.idA.value)?.filename ?? '']" alt="Team A Logo" class="w-72 h-32 object-contain mt-4" />
        </div>
      </div>
      <div class="w-32 text-right">{{ gameStore.pointsWonA }}</div>
      <div class="mx-4">–</div>
      <div class="w-32">{{ gameStore.pointsWonB }}</div>
      <div class="flex flex-col flex-1">
        <span class="text-4xl text-nowrap shrink min-w-0 text-right flex-1">{{ gameStore.nameB }}</span>
        <div class="flex justify-center" v-if="imageDataURIs[teams?.find((team) => team.id === gameStore.idB.value)?.filename ?? '']">
          <img :src="imageDataURIs[teams?.find((team) => team.id === gameStore.idB.value)?.filename ?? '']" alt="Team B Logo" class="w-72 h-32 object-contain mt-4" />
        </div>
      </div>
    </div>
    <template v-if="$slots.default">
      <div class="ads bg-gray-100 w-full h-full grow"><slot></slot></div>
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
