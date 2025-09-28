<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Performance</h2>
        <Icon name="i-mdi-chart-areaspline" class="text-primary h-5 w-5" />
      </div>
    </template>

    <div class="grid gap-4 sm:grid-cols-2">
      <div
        v-for="stat in statsList"
        :key="stat.label"
        class="border-default rounded-lg border p-4"
      >
        <div class="text-muted flex items-center justify-between text-sm">
          <span class="font-medium">{{ stat.label }}</span>
          <Icon :name="stat.icon" class="h-4 w-4" />
        </div>
        <p class="mt-2 text-2xl font-semibold">{{ stat.value }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from "#imports";
import type { UserStats } from "~/types/user";

const props = defineProps<{ stats: UserStats }>();

const statsList = computed(() => [
  {
    label: "Votes cast",
    value: props.stats.votesCast,
    icon: "i-mdi-thumb-up",
  },
  {
    label: "Notes written",
    value: props.stats.notesWritten,
    icon: "i-mdi-note-text",
  },
  {
    label: "Trips completed",
    value: props.stats.tripsCompleted,
    icon: "i-mdi-briefcase-check",
  },
  {
    label: "Groups joined",
    value: props.stats.groupsJoined,
    icon: "i-mdi-account-group",
  },
]);
</script>
