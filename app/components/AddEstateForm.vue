<template>
  <UCard>
    <div class="flex gap-2">
      <UInput
        :model-value="modelValue"
        placeholder="Enter Booking.com or Airbnb URL"
        clearable
        class="flex-1"
        :disabled="loading"
        @update:model-value="$emit('update:modelValue', $event)"
        @keyup.enter="$emit('submit')"
      />
      <UButton
        color="primary"
        :loading="loading"
        :disabled="loading"
        icon="i-mdi-plus"
        @click="$emit('submit')"
      >
        {{ loading ? 'Adding...' : 'Add' }}
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  loading: boolean;
}>();

defineEmits<{
  'update:modelValue': [string];
  submit: [];
}>();
</script>
