<template>
  <UCard>
    <div
      class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex flex-1 items-center gap-4">
        <img
          :src="user.avatarUrl"
          :alt="`${user.name} avatar`"
          class="h-20 w-20 rounded-full object-cover shadow-sm"
        />
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl leading-tight font-semibold">
              {{ user.name }}
            </h1>
            <UBadge color="primary" variant="subtle">
              {{ user.preferredCurrency }}
            </UBadge>
          </div>
          <p class="text-muted max-w-2xl text-sm">
            {{ user.bio }}
          </p>
          <div class="text-muted flex flex-wrap items-center gap-3 text-sm">
            <span class="flex items-center gap-1">
              <Icon name="i-mdi-map-marker" class="h-4 w-4" />
              {{ user.location }}
            </span>
            <span class="flex items-center gap-1">
              <Icon name="i-mdi-calendar" class="h-4 w-4" />
              Joined {{ formattedJoinDate }}
            </span>
            <span class="flex items-center gap-1">
              <Icon name="i-mdi-clock-outline" class="h-4 w-4" />
              {{ user.timezone }}
            </span>
          </div>
        </div>
      </div>

      <div class="w-full max-w-xs space-y-3">
        <div class="text-muted flex items-center gap-2 text-sm">
          <Icon name="i-mdi-email" class="h-4 w-4" />
          <span>{{ user.email }}</span>
        </div>
        <div class="text-muted flex items-center gap-2 text-sm">
          <Icon name="i-mdi-phone" class="h-4 w-4" />
          <span>{{ user.phoneNumber }}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="platform in user.preferredPlatforms"
            :key="platform"
            color="neutral"
            variant="soft"
          >
            {{ platform }}
          </UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from "#imports";
import type { UserProfile } from "~/types/user";

const props = defineProps<{ user: UserProfile }>();

const formattedJoinDate = computed(() => {
  const date = new Date(props.user.joinDate);
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
});
</script>
