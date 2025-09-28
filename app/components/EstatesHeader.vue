<template>
  <div
    class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
  >
    <h1 class="text-2xl font-bold">{{ title }}</h1>

    <div class="flex items-center gap-2">
      <UButton
        color="primary"
        variant="outline"
        size="sm"
        icon="i-mdi-share-variant"
        label="Share"
        @click="$emit('share')"
      />

      <UFieldGroup size="sm" orientation="horizontal">
        <UButton
          :color="viewMode === 'grid' ? 'primary' : 'primary'"
          :variant="viewMode === 'grid' ? 'solid' : 'outline'"
          icon="i-mdi-view-grid"
          @click="$emit('update:viewMode', 'grid')"
        />
        <UButton
          :color="viewMode === 'table' ? 'primary' : 'primary'"
          :variant="viewMode === 'table' ? 'solid' : 'outline'"
          icon="i-mdi-table"
          @click="$emit('update:viewMode', 'table')"
        />
      </UFieldGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    viewMode: "grid" | "table";
    title?: string;
  }>(),
  {
    title: "Booking.com & Airbnb Comparison",
  },
);

defineEmits<{ share: []; "update:viewMode": ["grid" | "table"] }>();
</script>
