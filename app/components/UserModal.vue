<template>
  <UModal
    :open="modelValue"
    :prevent-close="preventClose"
    @update:open="$emit('update:modelValue', $event)"
  >
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Who are you?</h3>
        </template>

        <div class="space-y-4">
          <p class="text-muted-foreground text-sm">
            {{
              participants.length > 0
                ? 'Choose your name from the list or add yourself:'
                : 'Enter your name to start voting on properties:'
            }}
          </p>

          <div v-if="participants.length > 0" class="space-y-2">
            <p class="text-sm font-medium">Existing participants:</p>
            <div class="grid grid-cols-2 gap-2">
              <UButton
                v-for="participant in participants"
                :key="participant"
                color="primary"
                variant="outline"
                size="sm"
                class="justify-start"
                @click="$emit('select-participant', participant)"
              >
                {{ participant }}
              </UButton>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-sm font-medium">
              {{ participants.length > 0 ? 'Or add yourself:' : 'Your name:' }}
            </p>
            <UInput
              :model-value="name"
              placeholder="Enter your name"
              @update:model-value="$emit('update:name', $event)"
              @keyup.enter="$emit('confirm')"
            />
          </div>

          <div class="flex justify-end gap-2">
            <UButton
              v-if="name && participants.length > 0"
              color="neutral"
              variant="ghost"
              label="Cancel"
              @click="$emit('update:modelValue', false)"
            />
            <UButton
              color="primary"
              :disabled="!name.trim()"
              label="Continue"
              @click="$emit('confirm')"
            />
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  participants: string[];
  name: string;
  preventClose?: boolean;
}>();

defineEmits<{
  'update:modelValue': [boolean];
  'update:name': [string];
  'select-participant': [string];
  confirm: [];
}>();
</script>
