<template>
  <UModal :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Notes</h3>
          <p v-if="estate" class="text-muted text-sm">
            {{ estate.name }}
          </p>
        </template>

        <div class="max-h-96 space-y-4 overflow-y-auto">
          <div class="space-y-3">
            <div
              v-for="note in notes"
              :key="`${note.voterName}-${note.timestamp}`"
              class="rounded-lg border p-3"
              :class="
                note.voterName === currentUser
                  ? 'border-blue-200 bg-blue-50'
                  : 'bg-white'
              "
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <div class="mb-1 flex items-center gap-2">
                    <span class="text-sm font-medium">{{
                      note.voterName
                    }}</span>
                    <span class="text-muted text-xs">
                      {{ new Date(note.timestamp).toLocaleDateString() }}
                    </span>
                  </div>
                  <p class="text-sm">{{ note.content }}</p>
                </div>
                <UButton
                  v-if="note.voterName === currentUser"
                  color="error"
                  variant="ghost"
                  size="xs"
                  icon="i-mdi-trash-can"
                  @click="$emit('remove-note', note)"
                />
              </div>
            </div>

            <div v-if="notes.length === 0" class="text-muted py-4 text-center">
              <Icon
                name="i-mdi-note-off"
                class="mx-auto mb-2 h-8 w-8 opacity-50"
              />
              <p class="text-sm">No notes yet</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div
            v-if="currentUser"
            class="bg-muted mb-4 space-y-2 rounded-lg p-3"
          >
            <UTextarea
              :model-value="newNote"
              placeholder="Add a note about this property..."
              :maxlength="maxLength"
              :rows="3"
              class="w-full"
              @update:model-value="$emit('update:newNote', $event)"
              @keyup.ctrl.enter="$emit('add-note')"
            />
            <div class="flex items-center justify-between">
              <span class="text-muted text-xs">
                {{ newNote.length }}/{{ maxLength }} characters
              </span>
              <UButton
                color="primary"
                size="sm"
                :disabled="!newNote.trim()"
                icon="i-mdi-plus"
                label="Add Note"
                @click="$emit('add-note')"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              label="Close"
              @click="$emit('update:modelValue', false)"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Estate, Note } from "~/types/estate";

withDefaults(
  defineProps<{
    modelValue: boolean;
    estate: Estate | null;
    notes: Note[];
    currentUser: string;
    newNote: string;
    maxLength?: number;
  }>(),
  {
    maxLength: 150,
  },
);

defineEmits<{
  "update:modelValue": [boolean];
  "update:newNote": [string];
  "add-note": [];
  "remove-note": [Note];
}>();
</script>
