<script setup lang="ts">
defineProps<{ data: object }>();
const open = ref<string[]>([]);
const open2 = ref<string[]>([]);
function toggleStringInList(stringsList: string[], string: string) {
  const index = stringsList.indexOf(string);
  if (index === -1) {
    stringsList.push(string);
  } else {
    stringsList.splice(index, 1);
  }
}
</script>

<template>
  <table v-if="Object.keys(data).length !== 0" class="text-sm">
    <tr v-for="(value, key) in data" :key="key">
      <td class="flex self-start pr-2 text-gray-400 dark:text-gray-500">
        {{ key }}:
      </td>
      <td v-if="(value && value !== null) || value === 0">
        <div v-if="Array.isArray(value) && typeof value[0] === 'object'">
          <UButton
            color="gray"
            size="2xs"
            :icon="
              open.includes(key) ? 'mdi:chevron-down' : 'mdi:chevron-right'
            "
            label="..."
            @click.stop="toggleStringInList(open, key)"
          />
          <Transition name="slide-fade">
            <div
              v-if="open.includes(key)"
              class="ml-3 border-l border-gray-300 dark:border-gray-700"
            >
              <UTable
                :rows="value as object[]"
                :columns="
                  Object.keys(value[0]).map((k) => {
                    return {
                      key: k,
                      label: k,
                      sortable: false,
                    };
                  })
                "
              />
            </div>
          </Transition>
        </div>

        <span v-else-if="value instanceof Date" class="font-semibold">{{
          value.toUTCString()
        }}</span>
        <div v-else-if="typeof value === 'object'">
          <UButton
            color="gray"
            size="2xs"
            :icon="`mdi:chevron-${open2.includes(key) ? 'down' : 'right'}`"
            label="..."
            @click="toggleStringInList(open2, key)"
          />
          <Transition name="slide-fade">
            <div
              v-if="open2.includes(key)"
              class="ml-3 border-l border-gray-300 pl-1 dark:border-gray-700"
            >
              <DictTable :data="value as object" class="ml-2" />
            </div>
          </Transition>
        </div>
        <span v-else class="font-semibold">{{ value }}</span>
      </td>
      <td v-else class="text-gray-400 dark:text-gray-500">null</td>
    </tr>
  </table>
  <div v-else class="text-center">
    <span class="text-gray-400 dark:text-gray-500">No data</span>
  </div>
</template>
