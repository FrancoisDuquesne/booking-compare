<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Saved searches</h2>
        <UBadge color="primary" variant="soft">{{ searches.length }}</UBadge>
      </div>
    </template>

    <ul class="space-y-4">
      <li
        v-for="search in searches"
        :key="search.id"
        class="border-default rounded-lg border p-4"
      >
        <p class="font-medium">{{ search.title }}</p>
        <div class="mt-2 flex flex-wrap gap-2 text-xs">
          <UBadge
            v-for="filter in search.filters"
            :key="filter"
            color="neutral"
            variant="soft"
          >
            {{ filter }}
          </UBadge>
        </div>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
import type { UserSavedSearch } from "~/types/user";

defineProps<{ searches: UserSavedSearch[] }>();
</script>
