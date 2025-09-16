<script setup lang="ts">
const { url = "/placeholder.png" } = defineProps<{
  url: string;
}>();
</script>

<template>
  <div class="flex">
    <div v-if="url">
      <img :src="url" alt="Estate Image" class="rounded object-cover" />
    </div>
    <div v-else class="text-muted text-center text-xs">No Image</div>
  </div>
</template>
