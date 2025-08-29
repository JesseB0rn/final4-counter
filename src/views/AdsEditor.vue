<template>
  <header class="w-full py-8 px-4 bg-stone-200 text-4xl font-bold mb-4">
    <h1>Sponsoren</h1>
    <div class="flex flex-row justify-start gap-4">
      <router-link v-if="route.name != 'Admin'" to="/" class="text-2xl text-stone-600 hover:text-stone-800">
        <span>Back</span>
      </router-link>

      <!-- <button>▶️</button>
      <button>⏹️</button> -->
    </div>
  </header>

  <button class="rounded-2xl bg-stone-600 text-white m-2 mr-0 p-4 font-bold" @click="addAd">+</button>
  <div class="flex flex-row flex-wrap">
    <div v-for="ad in currentConfig?.ads || []" :key="ad.id">
      <div class="flex-1">
        <img :src="imageDataURIs[ad.filename] || ''" alt="" class="w-full h-full max-w-96" />
      </div>
      <div class="flex flex-col">
        <button class="rounded-2xl bg-red-600 text-white m-2 mr-0 p-4 grow font-bold" @click="deleteAd(ad)">CLS</button>
        <input type="number" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" placeholder="Dauer" v-model="ad.durationSec" />
        <input type="text" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" placeholder="base64" v-model="ad.filename" />
        <input type="file" class="rounded-2xl bg-stone-200 m-2 mr-0 p-4 grow font-bold" @change="onFileChange(ad, $event)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";
import { useOPFS } from "../composables/useOPFS";
import { type adsConfiguration } from "../interfaces/adsConfiguration";
import { useRoute } from "vue-router";
import { useMessageStore } from "../stores/messageStore";
import { uuidv4 } from "../helpers/uuid";

const imageDataURIs = ref<Record<string, string>>({});
const msgstore = useMessageStore();
msgstore.setRole("admin");
const route = useRoute();

const currentConfig = useLocalStorage<adsConfiguration>("adsConfig", {
  ads: [
    {
      id: "1",
      durationSec: 3,
      filename: "",
    },
  ],
});

const addAd = () => {
  currentConfig.value = {
    ads: [
      ...(currentConfig.value?.ads || []),
      {
        id: uuidv4(),
        durationSec: 3,
        filename: "", // empty image
      },
    ],
  };
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

const onFileChange = (ad: { id: string; durationSec: number; filename: string }, event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const filename = uuidv4();
    useOPFS()
      .saveFile(new File([file], filename))
      .then((savedFilename) => {
        ad.filename = savedFilename;
      });
  }
};

const deleteAd = (ad: { id: string; durationSec: number; filename: string }) => {
  currentConfig.value = {
    ads: currentConfig.value?.ads.filter((a) => a.id !== ad.id) || [],
  };
};

watch(
  currentConfig,
  (newConfig) => {
    // Update imageDataURIs when the config changes
    newConfig?.ads.forEach((ad) => {
      if (ad.filename) {
        opfsFileToDataURI(ad.filename).then((dataURI) => {
          if (dataURI) {
            imageDataURIs.value[ad.filename] = dataURI;
          }
        });
      }
    });

    msgstore.sendMessage({
      type: "update",
      payload: {
        action: "updateAds",
        data: JSON.stringify(newConfig?.ads || []),
      },
    });
  },
  { deep: true, immediate: true }
);
</script>
