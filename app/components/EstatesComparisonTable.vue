<template>
  <div class="px-2 py-3 sm:px-6">
    <div class="overflow-x-auto">
      <UTable
        :data="tableRows"
        :columns="columns"
        sticky
        :ui="tableUi"
        class="min-w-[720px]"
      >
        <template #caption>
          <span class="sr-only">Comparison table for shortlisted estates</span>
        </template>

        <template #criteria-header>
          <span
            class="text-muted text-[11px] font-semibold tracking-[0.175em] uppercase"
          >
            Criteria
          </span>
        </template>

        <template #criteria-cell="{ row }">
          <span class="text-foreground text-sm font-semibold">
            {{ row.original.label }}
          </span>
        </template>

        <template
          v-for="column in estateColumns"
          :key="column.id"
          #[`${column.id}-header`]="{ column: headerColumn }"
        >
          <div v-if="headerColumn.columnDef.meta?.estate" class="space-y-1">
            <p class="text-sm leading-tight font-semibold">
              {{ headerColumn.columnDef.meta.estate.name }}
            </p>
            <p class="text-muted text-xs">
              {{ headerColumn.columnDef.meta.estate.location }}
            </p>
          </div>
        </template>

        <template
          v-for="column in estateColumns"
          :key="`${column.id}-cell`"
          #[`${column.id}-cell`]="{ row, column: cellColumn }"
        >
          <div v-if="cellColumn.columnDef.meta?.estate" class="h-full">
            <UCard :ui="row.original.key === 'image' ? imageCardUi : cardUi">
              <template #default>
                <template v-if="row.original.key === 'image'">
                  <img
                    v-if="cellColumn.columnDef.meta.estate.image"
                    :src="cellColumn.columnDef.meta.estate.image"
                    :alt="cellColumn.columnDef.meta.estate.name"
                    class="h-36 w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="bg-muted text-muted flex h-36 items-center justify-center rounded-xl text-xs"
                  >
                    No image
                  </div>
                </template>

                <template v-else-if="row.original.key === 'name'">
                  <p
                    class="text-foreground truncate text-sm leading-tight font-semibold"
                  >
                    {{ cellColumn.columnDef.meta.estate.name }}
                  </p>
                  <p class="text-muted text-xs">
                    {{ cellColumn.columnDef.meta.estate.location }}
                  </p>
                </template>

                <template v-else-if="row.original.key === 'price'">
                  <span class="text-primary text-lg font-semibold">
                    {{ cellColumn.columnDef.meta.estate.price }}
                  </span>
                </template>

                <template v-else-if="row.original.key === 'rating'">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-mdi-star" class="text-warning h-5 w-5" />
                    <span class="text-foreground text-sm font-medium">
                      {{ cellColumn.columnDef.meta.estate.rating }}
                    </span>
                  </div>
                </template>

                <template v-else-if="row.original.key === 'location'">
                  <p class="text-muted truncate text-sm">
                    {{ cellColumn.columnDef.meta.estate.location }}
                  </p>
                </template>

                <template v-else-if="row.original.key === 'votes'">
                  <div class="space-y-2">
                    <div class="flex items-baseline gap-2">
                      <span class="text-primary text-xl font-semibold">
                        {{
                          votesByEstate(cellColumn.columnDef.meta.estate.url)
                            .length
                        }}
                      </span>
                      <span
                        class="text-muted text-[11px] tracking-[0.18em] uppercase"
                      >
                        votes
                      </span>
                    </div>
                    <div
                      v-if="
                        votesByEstate(cellColumn.columnDef.meta.estate.url)
                          .length
                      "
                      class="flex flex-wrap gap-1"
                    >
                      <UBadge
                        v-for="vote in votesByEstate(
                          cellColumn.columnDef.meta.estate.url,
                        )"
                        :key="vote.voterName"
                        :label="vote.voterName"
                        :color="
                          vote.voterName === currentUser ? 'primary' : 'primary'
                        "
                        :variant="
                          vote.voterName === currentUser ? 'solid' : 'soft'
                        "
                        size="xs"
                        :ui="{
                          base: 'rounded-full px-2 py-0.5 text-[11px] font-medium',
                          label: 'leading-none',
                        }"
                      />
                    </div>
                  </div>
                </template>

                <template v-else-if="row.original.key === 'notes'">
                  <div class="space-y-2">
                    <div class="flex items-baseline gap-2">
                      <span class="text-xl font-semibold text-blue-600">
                        {{
                          notesByEstate(cellColumn.columnDef.meta.estate.url)
                            .length
                        }}
                      </span>
                      <span
                        class="text-muted text-[11px] tracking-[0.18em] uppercase"
                      >
                        notes
                      </span>
                    </div>
                    <p
                      v-if="
                        notesByEstate(cellColumn.columnDef.meta.estate.url)
                          .length
                      "
                      class="text-muted line-clamp-2 text-xs"
                    >
                      {{
                        notesByEstate(cellColumn.columnDef.meta.estate.url)
                          .map((note) => `${note.voterName}: ${note.content}`)
                          .join(" • ")
                      }}
                    </p>
                  </div>
                </template>

                <template v-else-if="row.original.key === 'actions'">
                  <div class="flex flex-wrap gap-2">
                    <UButton
                      v-if="currentUser"
                      size="sm"
                      :color="
                        hasUserVoted(cellColumn.columnDef.meta.estate.url)
                          ? 'neutral'
                          : 'success'
                      "
                      :variant="
                        hasUserVoted(cellColumn.columnDef.meta.estate.url)
                          ? 'solid'
                          : 'soft'
                      "
                      :icon="
                        hasUserVoted(cellColumn.columnDef.meta.estate.url)
                          ? 'i-mdi-check'
                          : 'i-mdi-thumb-up'
                      "
                      :label="
                        hasUserVoted(cellColumn.columnDef.meta.estate.url)
                          ? 'Voted'
                          : 'Vote'
                      "
                      @click="
                        emit('vote', cellColumn.columnDef.meta.estate.url)
                      "
                    />
                    <UButton
                      v-else
                      size="sm"
                      color="success"
                      variant="soft"
                      icon="i-mdi-account-plus"
                      label="Identify to Vote"
                      @click="
                        emit('vote', cellColumn.columnDef.meta.estate.url)
                      "
                    />
                    <UButton
                      size="sm"
                      color="neutral"
                      variant="outline"
                      icon="i-mdi-note-text"
                      label="Notes"
                      @click="
                        emit('view-notes', cellColumn.columnDef.meta.estate)
                      "
                    />
                    <UButton
                      :to="cellColumn.columnDef.meta.estate.url"
                      target="_blank"
                      size="sm"
                      color="primary"
                      variant="outline"
                      icon="i-mdi-link-variant"
                      label="View"
                    />
                    <UButton
                      size="sm"
                      color="error"
                      variant="ghost"
                      icon="i-mdi-trash-can"
                      @click="emit('delete', cellColumn.columnDef.meta.estate)"
                    />
                  </div>
                </template>
              </template>
            </UCard>
          </div>
        </template>

        <template #empty>
          <div class="text-muted flex h-24 items-center justify-center text-sm">
            No estates to compare yet.
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import type { Estate, Note, Vote } from "~/types/estate";

const props = defineProps<{
  estates: Estate[];
  currentUser: string;
  getVotesForEstate: (estateUrl: string) => Vote[];
  getNotesForEstate: (estateUrl: string) => Note[];
  hasUserVotedForEstate: (estateUrl: string) => boolean;
}>();

const emit = defineEmits<{
  (event: "vote", estateUrl: string): void;
  (event: "view-notes", estate: Estate): void;
  (event: "delete", estate: Estate): void;
}>();

const comparisonRows = [
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "rating", label: "Rating" },
  { key: "location", label: "Location" },
  { key: "votes", label: "Votes" },
  { key: "notes", label: "Notes" },
  { key: "actions", label: "Actions" },
] as const;

type ComparisonRowKey = (typeof comparisonRows)[number]["key"];

interface ComparisonRow {
  key: ComparisonRowKey;
  label: string;
}

interface EstateColumnMeta {
  estate: Estate;
  class: {
    th: string;
    td: string;
  };
}

const tableRows = computed<ComparisonRow[]>(() =>
  comparisonRows.map((row) => ({
    key: row.key,
    label: row.label,
  })),
);

const estateColumns = computed<ColumnDef<ComparisonRow, ComparisonRow>[]>(() =>
  props.estates.map((estate, index) => ({
    id: `estate-${index}`,
    accessorFn: (row) => row,
    header: estate.name,
    enableSorting: false,
    meta: {
      estate,
      class: {
        th: "sticky top-0 z-20 bg-background/95 px-4 py-4 text-left text-sm font-semibold leading-5 backdrop-blur supports-[backdrop-filter]:bg-background/75",
        td: "px-2 py-2 align-top",
      },
    } satisfies EstateColumnMeta,
  })),
);

const columns = computed<ColumnDef<ComparisonRow>[]>(() => [
  {
    id: "criteria",
    accessorKey: "label",
    header: "Criteria",
    enableSorting: false,
    meta: {
      class: {
        th: "sticky left-0 top-0 z-30 bg-background/95 px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.175em] text-muted backdrop-blur supports-[backdrop-filter]:bg-background/75",
        td: "sticky left-0 z-20 bg-background/95 px-4 py-4 text-sm font-semibold text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/75",
      },
    },
  },
  ...estateColumns.value,
]);

const tableUi = {
  root: "w-full",
  base: "w-full border-separate border-spacing-y-5",
  thead: "text-left",
  tbody: "[&_tr]:align-top",
  th: "align-middle max-w-xs",
  td: "align-top max-w-xs",
};

const cardUi = {
  root: "h-full rounded-md truncate bg-muted/80",
  body: "space-y-3 !p-2",
};

const imageCardUi = {
  ...cardUi,
  body: "!p-0",
};

const votesByEstate = (estateUrl: string) => props.getVotesForEstate(estateUrl);
const notesByEstate = (estateUrl: string) => props.getNotesForEstate(estateUrl);
const hasUserVoted = (estateUrl: string) =>
  props.hasUserVotedForEstate(estateUrl);
const currentUser = computed(() => props.currentUser);
</script>
