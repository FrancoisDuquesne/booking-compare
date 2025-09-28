<script setup lang="ts">
import { h } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { computed, onMounted, ref } from "#imports";
import { UButton } from "#components";
import type { Estate } from "~/types/estate";
import { useCurrentUser } from "~/composables/useCurrentUser";
import { useEstates } from "~/composables/useEstates";
import { useShareableUrl } from "~/composables/useShareableUrl";

const viewMode = ref<"grid" | "table">("grid");
const urlInput = ref(
  "https://www.booking.com/hotel/es/villa-samar-altea.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661&ucfs=1&checkin=2025-12-20&checkout=2025-12-25&dest_id=-406131&dest_type=city&group_adults=7&no_rooms=1&group_children=0&nflt=oos%3D1%3Bprice%3DEUR-350-450-1%3Bht_id%3D220%3Bht_id%3D213%3Bprivacy_type%3D3%3Bht_id%3D228%3Bentire_place_bedroom_count%3D4%3Breview_score%3D90%3Bhotelfacility%3D4&srpvid=af3048ef6f4805e0&srepoch=1757674145&matching_block_id=39659301_414720911_7_0_0&atlas_src=sr_iw_title#map_closed",
);

const { currentUser, showUserModal, setCurrentUser, promptForUser } =
  useCurrentUser();

const {
  estates,
  isAddingEstate,
  estateToDelete,
  selectedEstateForNotes,
  newNote,
  showDeleteModal,
  showNotesModal,
  columnPinning,
  allParticipants,
  currentUserVotes,
  hasUserVotedForEstate,
  estatesSortedByVotes,
  sortedNotesForSelectedEstate,
  addEstate,
  confirmDeleteEstate,
  removeEstate,
  toggleVote,
  openNotesModal,
  closeNotesModal,
  addNote,
  removeNote,
  getVotesForEstate,
  getNotesForEstate,
} = useEstates({ currentUser, requireIdentification: promptForUser });

const { copyShareableUrl } = useShareableUrl();

const hasEstates = computed(() => estates.value.length > 0);

async function handleAddEstate() {
  const added = await addEstate(urlInput.value);
  if (added) {
    urlInput.value = "";
  }
}

function handleDeleteModalToggle(open: boolean) {
  showDeleteModal.value = open;
  if (!open) {
    estateToDelete.value = null;
  }
}

function handleNotesModalToggle(open: boolean) {
  if (open) {
    showNotesModal.value = true;
    return;
  }

  closeNotesModal();
}

function handleNoteInput(value: string) {
  newNote.value = value;
}

function handleUserModalToggle(open: boolean) {
  showUserModal.value = open;
}

function handleUserNameInput(value: string) {
  currentUser.value = value;
}

function handleSelectParticipant(name: string) {
  setCurrentUser(name);
}

function handleConfirmUser() {
  setCurrentUser(currentUser.value);
}

function handleShare() {
  copyShareableUrl();
}

function handleViewModeChange(mode: "grid" | "table") {
  viewMode.value = mode;
}

const columns: TableColumn<Estate>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) =>
      h("img", {
        src: row.original.image,
        alt: row.original.name,
        class: "max-w-44 rounded-lg h-28 object-cover",
        loading: "lazy",
      }),
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "rating", header: "Rating" },
  { accessorKey: "location", header: "Location" },
  {
    accessorKey: "votes",
    header: "Votes",
    cell: ({ row }) => {
      const estateVotes = getVotesForEstate(row.original.url);
      return h("div", { class: "flex flex-col items-center" }, [
        h(
          "span",
          { class: "text-lg font-bold text-primary" },
          estateVotes.length.toString(),
        ),
        h("span", { class: "text-xs text-muted" }, "votes"),
      ]);
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const estateNotes = getNotesForEstate(row.original.url);
      return h("div", { class: "flex flex-col items-center" }, [
        h(
          "span",
          { class: "text-lg font-bold text-blue-600" },
          estateNotes.length.toString(),
        ),
        h("span", { class: "text-xs text-muted" }, "notes"),
      ]);
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const estate = row.original;
      const hasVoted = hasUserVotedForEstate.value(estate.url);

      return h(
        "div",
        { class: "flex items-center gap-1" },
        [
          currentUser.value
            ? h(UButton, {
                size: "sm",
                color: "success",
                variant: hasVoted ? "solid" : "ghost",
                icon: hasVoted ? "i-mdi-check" : "i-mdi-thumb-up",
                onClick: () => toggleVote(estate.url),
              })
            : h(UButton, {
                size: "sm",
                color: "success",
                variant: "soft",
                icon: "i-mdi-account-plus",
                onClick: () => promptForUser("Please identify yourself first"),
              }),
          h(UButton, {
            size: "sm",
            color: "neutral",
            variant: "ghost",
            icon: "i-mdi-note-text",
            onClick: () => openNotesModal(estate),
          }),
          h(UButton, {
            size: "sm",
            color: "info",
            variant: "ghost",
            icon: "i-mdi-link-variant",
            to: estate.url,
            target: "_blank",
          }),
          h(UButton, {
            icon: "i-mdi-trash-can",
            size: "sm",
            color: "error",
            variant: "ghost",
            onClick: () => confirmDeleteEstate(estate),
          }),
        ].filter(Boolean),
      );
    },
  },
];

onMounted(() => {
  if (currentUser.value) {
    return;
  }

  setTimeout(() => {
    if (
      !currentUser.value &&
      (allParticipants.value.length > 0 || estates.value.length > 0)
    ) {
      showUserModal.value = true;
    }
  }, 500);
});
</script>

<template>
  <div class="bg-muted min-h-screen space-y-6 p-4 sm:p-10">
    <UContainer>
      <EstatesHeader
        :view-mode="viewMode"
        @share="handleShare"
        @update:viewMode="handleViewModeChange"
      />

      <UserPanel
        v-if="currentUser"
        :current-user="currentUser"
        :user-votes-count="currentUserVotes.length"
        :all-participants="allParticipants"
        @edit-user="showUserModal = true"
      />

      <AddEstateForm
        v-model="urlInput"
        :loading="isAddingEstate"
        @submit="handleAddEstate"
      />
    </UContainer>

    <UContainer
      v-if="hasEstates && viewMode === 'table'"
      class="bg-default border-default max-w-8xl overflow-clip rounded-2xl border shadow-2xl"
    >
      <UTable
        :columns="columns"
        :data="estatesSortedByVotes"
        v-model:column-pinning="columnPinning"
        row-key="url"
      />
    </UContainer>

    <UContainer v-else-if="hasEstates && viewMode === 'grid'">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <EstateCard
          v-for="estate in estatesSortedByVotes"
          :key="estate.url"
          :estate="estate"
          :current-user="currentUser"
          :has-user-voted="hasUserVotedForEstate(estate.url)"
          :votes="getVotesForEstate(estate.url)"
          :notes="getNotesForEstate(estate.url)"
          @vote="toggleVote(estate.url)"
          @delete="confirmDeleteEstate(estate)"
          @view-notes="openNotesModal(estate)"
        />
      </div>
    </UContainer>

    <UContainer v-else class="flex items-center justify-center py-20">
      <UAlert
        title="Add Properties to Compare"
        description="Paste a Booking.com or Airbnb URL above to get started"
        icon="i-mdi-database-off"
        size="xl"
        variant="soft"
        color="warning"
        class="max-w-sm"
      />
    </UContainer>

    <DeleteEstateModal
      :model-value="showDeleteModal"
      :estate="estateToDelete"
      @update:modelValue="handleDeleteModalToggle"
      @confirm="removeEstate"
    />

    <NotesModal
      :model-value="showNotesModal"
      :estate="selectedEstateForNotes"
      :notes="sortedNotesForSelectedEstate"
      :current-user="currentUser"
      :new-note="newNote"
      @update:modelValue="handleNotesModalToggle"
      @update:newNote="handleNoteInput"
      @add-note="addNote"
      @remove-note="removeNote"
    />

    <UserModal
      :model-value="showUserModal"
      :participants="allParticipants"
      :name="currentUser"
      :prevent-close="!currentUser"
      @update:modelValue="handleUserModalToggle"
      @update:name="handleUserNameInput"
      @select-participant="handleSelectParticipant"
      @confirm="handleConfirmUser"
    />
  </div>
</template>
