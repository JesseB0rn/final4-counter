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

      <!-- <button>▶️</button>
      <button>⏹️</button> -->
    </div>
  </header>

  <button class="rounded-2xl bg-stone-600 text-white m-2 mr-0 p-4 font-bold" @click="addTeam">+</button>
  <div class="flex flex-row flex-wrap">
    <div v-for="team in teams || []" :key="team.name">
      <div class="flex-1">
        <img :src="imageDataURIs[team.filename] || ''" alt="" class="w-full h-full max-w-96" />
      </div>
      <div class="flex flex-col">
        <button class="rounded-2xl bg-red-600 text-white m-2 mr-0 p-4 grow font-bold" @click="deleteTeam(team)">CLS</button>
        <input type="text" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" placeholder="base64" v-model="team.filename" />
        <input type="file" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" @change="onFileChange(team, $event)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useLocalStorage } from "../composables/useLocalStorage";
import type { ITeam } from "../interfaces/team";
import { useOPFS } from "../composables/useOPFS";
import { uuidv4 } from "../helpers/uuid";
import { ref, watch } from "vue";
import { useMessageStore } from "../stores/messageStore";
const route = useRoute();

const teams = useLocalStorage<ITeam[]>("teams", []);
const imageDataURIs = ref<Record<string, string>>({});

const msgstore = useMessageStore();
msgstore.setRole("admin");

const addTeam = () => {
  teams.value = [
    ...(teams.value || []),
    {
      name: "Team Name",
      filename: "",
    },
  ];
};
const deleteTeam = (team: ITeam) => {
  teams.value = (teams.value || []).filter((t) => t !== team);
};

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

const onFileChange = (team: ITeam, event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const filename = uuidv4();
    useOPFS()
      .saveFile(new File([file], filename))
      .then((savedFilename) => {
        team.filename = savedFilename;
      });
  }
};

watch(
  teams,
  (newTeams) => {
    // Update imageDataURIs when the config changes
    newTeams?.forEach((team) => {
      if (team.filename) {
        opfsFileToDataURI(team.filename).then((dataURI) => {
          if (dataURI) {
            imageDataURIs.value[team.filename] = dataURI;
          }
        });
      }
    });

    msgstore.sendMessage({
      type: "update",
      payload: {
        action: "updateTeams",
        data: JSON.stringify(newTeams || []),
      },
    });
  },
  { deep: true, immediate: true }
);
</script>
