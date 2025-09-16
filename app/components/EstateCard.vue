<template>
  <UCard
    :ui="{
      root: 'h-full flex flex-col overflow-hidden transition-shadow shadow-lg hover:shadow-2xl',
      header: '!p-0',
      body: 'grow',
      footer: 'space-y-2',
    }"
  >
    <template #header>
      <div class="relative">
        <img
          :src="estate.image"
          :alt="estate.name"
          class="h-48 w-full object-cover"
          loading="lazy"
        />
        <div
          class="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 backdrop-blur-sm"
        >
          <Icon name="i-mdi-star" class="h-4 w-4 text-yellow-500" />
          <span class="text-sm font-medium">{{ estate.rating }}</span>
        </div>
        <div
          class="bg-primary/90 absolute top-2 left-2 flex items-center gap-1 rounded-full px-3 py-1 text-white backdrop-blur-sm"
        >
          <Icon name="i-mdi-thumb-up" class="h-4 w-4" />
          <span class="text-sm font-bold">{{ votes.length }}</span>
        </div>
      </div>
    </template>

    <div class="grow space-y-4">
      <div>
        <h3 class="mb-2 line-clamp-2 text-lg font-semibold">
          {{ estate.name }}
        </h3>
        <p class="text-muted-foreground line-clamp-2 text-sm">
          {{ estate.location }}
        </p>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-primary text-lg font-bold">{{ estate.price }}</span>
      </div>
    </div>

    <template #footer>
      <!-- Voters list -->
      <div v-if="votes.length > 0">
        <p class="text-muted-foreground mb-2 text-xs">Voted by:</p>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="vote in votes"
            :key="vote.voterName"
            :class="[
              'rounded-full px-2 py-1 text-xs',
              vote.voterName === currentUser
                ? 'bg-primary text-white'
                : 'bg-primary/10 text-primary',
            ]"
          >
            {{ vote.voterName }}
          </span>
        </div>
      </div>

      <!-- Notes preview -->
      <div v-if="notes.length > 0">
        <p class="text-muted-foreground mb-1 text-xs">Notes:</p>
        <p class="text-muted line-clamp-2 text-xs">
          {{
            notes
              .map((note) => `${note.voterName}: ${note.content}`)
              .join(" • ")
          }}
        </p>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2 pt-2">
        <UButton
          v-if="currentUser"
          @click="$emit('vote')"
          :color="hasUserVoted ? 'neutral' : 'success'"
          variant="soft"
          size="sm"
          :icon="hasUserVoted ? 'i-mdi-check' : 'i-mdi-thumb-up'"
          :label="hasUserVoted ? 'Voted' : 'Vote'"
          class="flex-1"
        />
        <UButton
          v-else
          @click="$emit('vote')"
          color="success"
          variant="soft"
          size="sm"
          icon="i-mdi-account-plus"
          label="Identify to Vote"
          class="flex-1"
        />
        <UButton
          @click="$emit('view-notes')"
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-mdi-note-text"
          label="Notes"
          class="flex-1"
        />
        <UButton
          :to="estate.url"
          target="_blank"
          color="primary"
          variant="outline"
          size="sm"
          icon="i-mdi-external-link"
          label="View"
          class="flex-1"
        />
        <UButton
          @click="$emit('delete')"
          color="error"
          variant="ghost"
          size="sm"
          icon="i-mdi-trash-can"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface Estate {
  url: string;
  name: string;
  price: string;
  rating: string;
  location: string;
  image?: string;
}

interface Vote {
  estateUrl: string;
  voterName: string;
}

interface Note {
  estateUrl: string;
  voterName: string;
  content: string;
  timestamp: number;
}

defineProps<{
  estate: Estate;
  currentUser: string;
  hasUserVoted: boolean;
  votes: Vote[];
  notes: Note[];
}>();

defineEmits<{
  vote: [];
  delete: [];
  "view-notes": [];
}>();
</script>
