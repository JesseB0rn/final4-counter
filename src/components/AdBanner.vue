<template>
  <div class="flex-1">
    <template v-if="ad">
      <Transition name="slide" mode="out-in">
        <img :key="ad.filename" :src="imageDataURIs[ad.filename] || ''" alt="" class="w-full h-full" />
      </Transition>
    </template>
  </div>
  <div class="flex flex-col"></div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";
import { useOPFS } from "../composables/useOPFS";
import { type adsConfiguration } from "../interfaces/adsConfiguration";
import { useMessageStore } from "../stores/messageStore";

const imageDataURIs = ref<Record<string, string>>({});

const msgstore = useMessageStore();
msgstore.setRole("display");

var timeouts = [] as number[];

const ad = ref<
  | {
      id: string;
      durationSec: number;
      filename: string;
    }
  | undefined
>();

const currentConfig = useLocalStorage<adsConfiguration>("adsConfig", {
  ads: [
    {
      id: "1",
      durationSec: 3,
      filename: "",
    },
  ],
});

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

const nextAd = () => {
  const ads = currentConfig.value?.ads || [];
  const currentAdIndex = ads.findIndex((a) => a.id === ad.value?.id);
  const nextAdIndex = (currentAdIndex + 1) % ads.length;
  ad.value = ads[nextAdIndex];
  timeouts.push(setTimeout(nextAd, ads[nextAdIndex].durationSec * 1000));
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
    nextAd();
  },
  { deep: true, immediate: true }
);
watch(
  () => msgstore.lastMessage,
  (newValue) => {
    if (newValue) {
      console.log("New message received:", JSON.stringify(newValue));
      if (newValue.type === "update" && newValue.payload.action === "updateAds") {
        console.log("Updating ads with:", newValue.payload.data);
        currentConfig.value = {
          ads: JSON.parse(newValue.payload.data),
        };
        timeouts.forEach(clearTimeout);
        timeouts = [];
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
