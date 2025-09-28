<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold">Upcoming trips</h2>
        <UBadge color="success" variant="soft">
          {{ confirmedTrips }} confirmed
        </UBadge>
      </div>
    </template>

    <div class="space-y-4">
      <div
        v-for="trip in trips"
        :key="trip.id"
        class="border-default rounded-lg border p-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-lg font-medium">{{ trip.destination }}</p>
            <p class="text-muted text-sm">
              {{ trip.accommodation }} · {{ trip.platform }}
            </p>
          </div>
          <UBadge
            :color="trip.status === 'Confirmed' ? 'success' : 'neutral'"
            variant="subtle"
          >
            {{ trip.status }}
          </UBadge>
        </div>
        <div class="text-muted mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span class="flex items-center gap-1">
            <Icon name="i-mdi-calendar-start" class="h-4 w-4" />
            {{ formatDate(trip.checkIn) }}
          </span>
          <span class="flex items-center gap-1">
            <Icon name="i-mdi-calendar-end" class="h-4 w-4" />
            {{ formatDate(trip.checkOut) }}
          </span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from "#imports";
import type { UserTrip } from "~/types/user";

const props = defineProps<{ trips: UserTrip[] }>();

const confirmedTrips = computed(
  () => props.trips.filter((trip) => trip.status === "Confirmed").length,
);

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
