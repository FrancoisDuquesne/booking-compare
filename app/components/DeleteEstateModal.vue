<template>
  <UModal :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-red-600">Confirm Deletion</h3>
        </template>

        <div class="space-y-4">
          <p class="text-sm">
            Are you sure you want to remove this property? This will also delete
            all votes and notes for this property.
          </p>

          <div v-if="estate" class="bg-muted rounded-lg p-3">
            <p class="text-sm font-medium">{{ estate.name }}</p>
            <p class="text-muted-foreground text-xs">{{ estate.location }}</p>
          </div>

          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              label="Cancel"
              @click="$emit('update:modelValue', false)"
            />
            <UButton
              color="error"
              icon="i-mdi-trash-can"
              label="Delete Property"
              @click="$emit('confirm')"
            />
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Estate } from "~/types/estate";

defineProps<{
  modelValue: boolean;
  estate: Estate | null;
}>();

defineEmits<{
  "update:modelValue": [boolean];
  confirm: [];
}>();
</script>
