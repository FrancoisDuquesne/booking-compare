<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Communication preferences</h2>
        <UBadge color="neutral" variant="soft">Updated weekly</UBadge>
      </div>
    </template>

    <ul class="space-y-3">
      <li
        v-for="preference in preferences"
        :key="preference.id"
        class="border-default flex items-start gap-3 rounded-lg border p-4"
      >
        <span
          class="bg-muted flex h-9 w-9 items-center justify-center rounded-full"
        >
          <Icon
            :name="preference.icon ?? 'i-mdi-email-outline'"
            class="h-4 w-4"
          />
        </span>
        <div>
          <p class="font-medium">{{ preference.label }}</p>
          <p class="text-muted text-sm">{{ preference.value }}</p>
        </div>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
import type { CommunicationPreference } from "~/types/user";

defineProps<{ preferences: CommunicationPreference[] }>();
</script>
