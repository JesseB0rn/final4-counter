<script setup lang="ts">
import { useOldServerBridge } from "./composables/useOldServerBridge";

useOldServerBridge();
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style scoped></style>
