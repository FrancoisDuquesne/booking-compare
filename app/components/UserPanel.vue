<template>
  <UCard class="mb-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="bg-primary flex h-8 w-8 items-center justify-center rounded-full"
        >
          <Icon name="i-mdi-account" class="h-4 w-4 text-white" />
        </div>
        <div>
          <p class="font-medium">{{ currentUser }}</p>
          <p class="text-muted-foreground text-xs">
            You've voted for {{ userVotesCount }} properties
          </p>
        </div>
      </div>

      <div class="flex items-center gap-8">
        <div v-if="allParticipants.length > 1" class="text-right">
          <p class="text-sm font-medium">
            {{ allParticipants.length }} participants
          </p>
          <div class="flex gap-1">
            <span
              v-for="participant in allParticipants.slice(0, 3)"
              :key="participant"
              :class="[
                'rounded-full px-2 py-1 text-xs',
                participant === currentUser
                  ? 'bg-primary text-white'
                  : 'bg-muted',
              ]"
            >
              {{ participant }}
            </span>
            <span
              v-if="allParticipants.length > 3"
              class="bg-muted rounded-full px-2 py-1 text-xs"
            >
              +{{ allParticipants.length - 3 }}
            </span>
          </div>
        </div>

        <UButton
          @click="$emit('edit-user')"
          color="neutral"
          variant="subtle"
          size="lg"
          icon="i-mdi-account-edit"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  currentUser: string;
  userVotesCount: number;
  allParticipants: string[];
}>();

defineEmits<{
  "edit-user": [];
}>();
</script>
