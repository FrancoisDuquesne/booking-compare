<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Recent activity</h2>
        <UBadge color="neutral" variant="soft">Last 30 days</UBadge>
      </div>
    </template>

    <ul class="space-y-4">
      <li
        v-for="activity in activities"
        :key="activity.id"
        class="border-default flex gap-3 rounded-lg border p-4"
      >
        <div class="mt-1">
          <span
            class="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full"
          >
            <Icon :name="activity.icon" class="h-5 w-5" />
          </span>
        </div>
        <div class="space-y-2">
          <div>
            <p class="font-medium">{{ activity.title }}</p>
            <p class="text-muted text-sm">
              {{ activity.description }}
            </p>
          </div>
          <div class="text-muted flex flex-wrap items-center gap-3 text-xs">
            <span class="flex items-center gap-1">
              <Icon name="i-mdi-calendar-clock" class="h-3.5 w-3.5" />
              {{ formatDateTime(activity.timestamp) }}
            </span>
            <span v-if="activity.context" class="flex items-center gap-1">
              <Icon name="i-mdi-tag" class="h-3.5 w-3.5" />
              {{ activity.context }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
import type { UserActivity } from "~/types/user";

defineProps<{ activities: UserActivity[] }>();

function formatDateTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
