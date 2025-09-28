<template>
  <UContainer class="space-y-8 py-10">
    <div class="text-muted flex items-center gap-2 text-sm">
      <NuxtLink to="/" class="hover:text-primary font-medium"
        >Dashboard</NuxtLink
      >
      <Icon name="i-mdi-chevron-right" class="h-4 w-4" />
      <span class="text-foreground font-medium">Profile</span>
    </div>

    <ProfileUserProfileHeader :user="user" />

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <ProfileUserActivityTimeline :activities="user.recentActivity" />
        <ProfileUserTripsCard :trips="user.upcomingTrips" />
      </div>

      <div class="space-y-6">
        <ProfileUserStatsCard :stats="user.stats" />
        <ProfileUserSavedSearches :searches="user.savedSearches" />
        <ProfileUserCommunicationPreferences
          :preferences="user.communicationPreferences"
        />
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { useHead } from "#imports";
import { mockUser } from "~/data/mockUser";

const user = mockUser;

useHead({
  title: `${user.name} · Profile`,
  meta: [
    {
      name: "description",
      content:
        "Review the profile, preferences, and recent activity for the current travel organizer.",
    },
  ],
});
</script>
