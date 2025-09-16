<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { UButton } from "#components";

const toast = useToast();
const route = useRoute();
const router = useRouter();

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

// State
const urlInput = ref(
  "https://www.booking.com/hotel/es/villa-samar-altea.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661&ucfs=1&checkin=2025-12-20&checkout=2025-12-25&dest_id=-406131&dest_type=city&group_adults=7&no_rooms=1&group_children=0&nflt=oos%3D1%3Bprice%3DEUR-350-450-1%3Bht_id%3D220%3Bht_id%3D213%3Bprivacy_type%3D3%3Bht_id%3D228%3Bentire_place_bedroom_count%3D4%3Breview_score%3D90%3Bhotelfacility%3D4&srpvid=af3048ef6f4805e0&srepoch=1757674145&matching_block_id=39659301_414720911_7_0_0&atlas_src=sr_iw_title#map_closed",
);

const viewMode = ref<"table" | "grid">("grid");
const currentUser = ref("");
const showUserModal = ref(false);
const showDeleteModal = ref(false);
const showNotesModal = ref(false);
const isAddingEstate = ref(false);
const estateToDelete = ref<Estate | null>(null);
const selectedEstateForNotes = ref<Estate | null>(null);
const newNote = ref("");

const estates = ref<Estate[]>([
  {
    url: "https://www.booking.com/hotel/es/villa-samar-altea.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661&ucfs=1&checkin=2025-12-20&checkout=2025-12-25&dest_id=-406131&dest_type=city&group_adults=7&no_rooms=1&group_children=0&nflt=oos%3D1%3Bprice%3DEUR-350-450-1%3Bht_id%3D220%3Bht_id%3D213%3Bprivacy_type%3D3%3Bht_id%3D228%3Bentire_place_bedroom_count%3D4%3Breview_score%3D90%3Bhotelfacility%3D4&srpvid=af3048ef6f4805e0&srepoch=1757674145&matching_block_id=39659301_414720911_7_0_0&atlas_src=sr_iw_title#map_closed",
    name: "Villa Samar Altea Grupo Terra de Mar, alojamientos con encanto",
    price: "€420/night",
    rating: "9.4/10",
    location: "Sorolla, 11, 03590 Altea, Espagne",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max500/258347354.jpg?k=9af9fd1c4041078bde60d0f0361deca1902895825f083df8b67f07de72d73632&o=&hp=1",
  },
  {
    url: "https://www.booking.com/hotel/es/casa-en-primera-linea-de-playa-pucol.fr.html?aid=2369661&label=msn-_%2Aipi4csWbMJFg%2AQb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&sid=6ccab3c3e23eedd0177dfbbd49e2223e&all_sr_blocks=981892601_370451345_8_0_0&checkin=2025-12-20&checkout=2025-12-25&dest_id=1523&dest_type=region&dist=0&group_adults=7&group_children=0&hapos=1&highlighted_blocks=981892601_370451345_8_0_0&hpos=1&matching_block_id=981892601_370451345_8_0_0&no_rooms=1&req_adults=7&req_children=0&room1=A%2CA%2CA%2CA%2CA%2CA%2CA&sb_price_type=total&sr_order=popularity&sr_pri_blocks=981892601_370451345_8_0_0__103500&srepoch=1757852613&srpvid=b72a55f7147200a5&type=total&ucfs=1&",
    name: "Casa en primera linea de playa",
    price: "€350/night",
    rating: "9.0/10",
    location: "13 Avinguda dels Pescadors, 46530 Puzol, Espagne",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max500/442843977.jpg?k=e6bd7a365011fad222c492645642fb5645b2e15a152826499002dc6a8554bdfa&o=&hp=1",
  },
  {
    url: "https://www.booking.com/hotel/es/asa-la-marina-by-sh-hoteles.fr.html?label=msn-_*ipi4csWbMJFg*Qb30F5w-80608133315299%3Atikwd-80608308434614%3Aloc-14%3Aneo%3Amte%3Alp616%3Adec%3Aqsbooking&aid=2369661",
    name: "ASA Hotel La Marina",
    price: "€380/night",
    rating: "9.1/10",
    location:
      "Carrer Alcalalí - Esquina Calle Vall De Laguard, 03760 Ondara, Espagne",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max500/562928066.jpg?k=64cbc9f6e3af2a3fa4e9815d1d4e6e94cb261e437e7c49ea262d081b369f463d&o=&hp=1",
  },
]);

const votes = ref<Vote[]>([]);
const notes = ref<Note[]>([]);

// UTF-8 safe encoding/decoding functions
function safeEncode(str: string): string {
  try {
    return btoa(encodeURIComponent(str));
  } catch (e) {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

function safeDecode(str: string): string {
  try {
    return decodeURIComponent(atob(str));
  } catch (e) {
    return decodeURIComponent(escape(atob(str)));
  }
}

// Initialize from URL parameters
onMounted(() => {
  initializeFromUrl();

  setTimeout(() => {
    if (
      !currentUser.value &&
      (allParticipants.value.length > 0 || estates.value.length > 0)
    ) {
      showUserModal.value = true;
    }
  }, 500);
});

// Watch for changes and update URL
watch(
  [estates, votes, notes],
  () => {
    updateUrlParams();
  },
  { deep: true },
);

function initializeFromUrl() {
  try {
    const estatesParam = route.query.estates as string;
    if (estatesParam) {
      const decodedEstates = JSON.parse(safeDecode(estatesParam));
      if (Array.isArray(decodedEstates) && decodedEstates.length > 0) {
        estates.value = decodedEstates;
      }
    }

    const votesParam = route.query.votes as string;
    if (votesParam) {
      const decodedVotes = JSON.parse(safeDecode(votesParam));
      if (Array.isArray(decodedVotes)) {
        votes.value = decodedVotes;
      }
    }

    const notesParam = route.query.notes as string;
    if (notesParam) {
      const decodedNotes = JSON.parse(safeDecode(notesParam));
      if (Array.isArray(decodedNotes)) {
        notes.value = decodedNotes;
      }
    }
  } catch (error) {
    console.warn("Failed to parse URL parameters:", error);
  }
}

function updateUrlParams() {
  const params: Record<string, string> = {};

  if (estates.value.length > 0) {
    params.estates = safeEncode(JSON.stringify(estates.value));
  }

  if (votes.value.length > 0) {
    params.votes = safeEncode(JSON.stringify(votes.value));
  }

  if (notes.value.length > 0) {
    params.notes = safeEncode(JSON.stringify(notes.value));
  }

  const query = { ...route.query, ...params };
  router.replace({ query });
}

// Computed properties
const allParticipants = computed(() => {
  const participants = [
    ...new Set([
      ...votes.value.map((v) => v.voterName),
      ...notes.value.map((n) => n.voterName),
    ]),
  ];
  return participants.sort();
});

const currentUserVotes = computed(() => {
  return votes.value.filter((v) => v.voterName === currentUser.value);
});

const hasUserVotedForEstate = computed(() => (estateUrl: string) => {
  return votes.value.some(
    (v) => v.estateUrl === estateUrl && v.voterName === currentUser.value,
  );
});

// Columns definition
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
        h("span", { class: "text-xs text-muted-foreground" }, "votes"),
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
        h("span", { class: "text-xs text-muted-foreground" }, "notes"),
      ]);
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const hasVoted = hasUserVotedForEstate.value(row.original.url);
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
                onClick: () => toggleVote(row.original.url),
              })
            : h(UButton, {
                size: "sm",
                color: "success",
                variant: "soft",
                icon: "i-mdi-account-plus",
                onClick: () => {
                  showUserModal.value = true;
                },
              }),
          h(UButton, {
            size: "sm",
            color: "neutral",
            variant: "ghost",
            icon: "i-mdi-note-text",
            onClick: () => openNotesModal(row.original),
          }),
          h(UButton, {
            size: "sm",
            color: "info",
            variant: "ghost",
            icon: "i-mdi-link-variant",
            to: row.original.url,
            target: "_blank",
          }),
          h(UButton, {
            icon: "i-mdi-trash-can",
            size: "sm",
            color: "error",
            variant: "ghost",
            onClick: () => confirmDeleteEstate(row.original),
          }),
        ].filter(Boolean),
      );
    },
  },
];

const columnPinning = ref({
  right: ["actions"],
});

// Add a new estate
async function addEstate() {
  const url = urlInput.value.trim();

  if (!url) {
    toast.add({ title: "Please enter a URL", color: "warning" });
    return;
  }

  if (estates.value.some((e) => e.url === url)) {
    toast.add({ title: "This estate is already in the list", color: "info" });
    urlInput.value = "";
    return;
  }

  let endpoint = "";
  if (url.includes("booking.com")) {
    endpoint = "/api/scrapeBooking";
  } else if (url.includes("airbnb.")) {
    endpoint = "/api/scrapeAirbnb";
  } else {
    toast.add({
      title: "Unsupported URL",
      description: "Only Booking.com or Airbnb links are supported.",
      color: "error",
    });
    return;
  }

  isAddingEstate.value = true;

  try {
    const estate = await $fetch(endpoint, { params: { url } });
    if (!estate.error) {
      estates.value.push(estate);
      toast.add({ title: "Estate added successfully", color: "success" });
    } else {
      toast.add({
        title: "Scraping failed",
        description: estate.error,
        color: "error",
      });
    }
  } catch (err: any) {
    console.error("Scraping failed:", err);
    toast.add({
      title: "Scraping failed",
      description: err.message,
      color: "error",
    });
  } finally {
    isAddingEstate.value = false;
  }

  urlInput.value = "";
}

function confirmDeleteEstate(estate: Estate) {
  estateToDelete.value = estate;
  showDeleteModal.value = true;
}

function removeEstate() {
  if (!estateToDelete.value) return;

  const url = estateToDelete.value.url;
  estates.value = estates.value.filter((e) => e.url !== url);
  votes.value = votes.value.filter((v) => v.estateUrl !== url);
  notes.value = notes.value.filter((n) => n.estateUrl !== url);

  toast.add({ title: "Estate removed", color: "info" });
  showDeleteModal.value = false;
  estateToDelete.value = null;
}

function getVotesForEstate(estateUrl: string): Vote[] {
  return votes.value.filter((v) => v.estateUrl === estateUrl);
}

function getNotesForEstate(estateUrl: string): Note[] {
  return notes.value.filter((n) => n.estateUrl === estateUrl);
}

function toggleVote(estateUrl: string) {
  if (!currentUser.value) {
    toast.add({ title: "Please identify yourself first", color: "warning" });
    showUserModal.value = true;
    return;
  }

  const existingVote = votes.value.find(
    (v) => v.estateUrl === estateUrl && v.voterName === currentUser.value,
  );

  if (existingVote) {
    votes.value = votes.value.filter((v) => v !== existingVote);
    toast.add({ title: "Vote removed", color: "info" });
  } else {
    votes.value.push({
      estateUrl,
      voterName: currentUser.value,
    });
    toast.add({ title: "Vote recorded!", color: "success" });
  }
}

function openNotesModal(estate: Estate) {
  selectedEstateForNotes.value = estate;
  showNotesModal.value = true;
}

function addNote() {
  if (!currentUser.value) {
    toast.add({ title: "Please identify yourself first", color: "warning" });
    showUserModal.value = true;
    return;
  }

  if (!selectedEstateForNotes.value || !newNote.value.trim()) {
    toast.add({ title: "Please enter a note", color: "warning" });
    return;
  }

  if (newNote.value.length > 150) {
    toast.add({
      title: "Note too long (max 150 characters)",
      color: "warning",
    });
    return;
  }

  notes.value.push({
    estateUrl: selectedEstateForNotes.value.url,
    voterName: currentUser.value,
    content: newNote.value.trim(),
    timestamp: Date.now(),
  });

  toast.add({ title: "Note added!", color: "success" });
  newNote.value = "";
}

function removeNote(note: Note) {
  if (note.voterName !== currentUser.value) {
    toast.add({
      title: "You can only remove your own notes",
      color: "warning",
    });
    return;
  }

  notes.value = notes.value.filter((n) => n !== note);
  toast.add({ title: "Note removed", color: "info" });
}

function setCurrentUser(name: string) {
  currentUser.value = name.trim();
  showUserModal.value = false;
  toast.add({ title: `Welcome, ${currentUser.value}!`, color: "success" });
}

function copyShareableUrl() {
  navigator.clipboard.writeText(window.location.href);
  toast.add({ title: "Shareable URL copied to clipboard!", color: "success" });
}

// Computed property for sorted estates by votes
const estatesSortedByVotes = computed(() => {
  return [...estates.value].sort((a, b) => {
    const votesA = getVotesForEstate(a.url).length;
    const votesB = getVotesForEstate(b.url).length;
    return votesB - votesA;
  });
});

// Computed property for sorted notes (chronological order: oldest to newest)
const sortedNotesForSelectedEstate = computed(() => {
  if (!selectedEstateForNotes.value) return [];
  return getNotesForEstate(selectedEstateForNotes.value.url).sort(
    (a, b) => a.timestamp - b.timestamp,
  );
});
</script>

<template>
  <div class="bg-muted min-h-screen space-y-6 p-4 sm:p-10">
    <UContainer>
      <div
        class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <h1 class="text-2xl font-bold">Booking.com & Airbnb Comparison</h1>

        <div class="flex items-center gap-2">
          <UButton
            @click="copyShareableUrl"
            color="primary"
            variant="outline"
            size="sm"
            icon="i-mdi-share-variant"
            label="Share"
          />

          <UButtonGroup size="sm" orientation="horizontal">
            <UButton
              :color="viewMode === 'grid' ? 'primary' : 'primary'"
              :variant="viewMode === 'grid' ? 'solid' : 'outline'"
              icon="i-mdi-view-grid"
              @click="viewMode = 'grid'"
            />
            <UButton
              :color="viewMode === 'table' ? 'primary' : 'primary'"
              :variant="viewMode === 'table' ? 'solid' : 'outline'"
              icon="i-mdi-table"
              @click="viewMode = 'table'"
            />
          </UButtonGroup>
        </div>
      </div>

      <!-- User Panel -->
      <UserPanel
        v-if="currentUser"
        :current-user="currentUser"
        :user-votes-count="currentUserVotes.length"
        :all-participants="allParticipants"
        @edit-user="showUserModal = true"
      />

      <UCard>
        <div class="flex gap-2">
          <UInput
            v-model="urlInput"
            placeholder="Enter Booking.com or Airbnb URL"
            clearable
            @keyup.enter="addEstate"
            class="flex-1"
            :disabled="isAddingEstate"
          />
          <UButton
            color="primary"
            @click="addEstate"
            :loading="isAddingEstate"
            :disabled="isAddingEstate"
            icon="i-mdi-plus"
          >
            {{ isAddingEstate ? "Adding..." : "Add" }}
          </UButton>
        </div>
      </UCard>
    </UContainer>

    <!-- Table View -->
    <div
      v-if="estates.length && viewMode === 'table'"
      class="bg-default border-muted overflow-clip rounded-2xl border shadow-2xl"
    >
      <UTable
        :columns="columns"
        :data="estatesSortedByVotes"
        v-model:column-pinning="columnPinning"
        row-key="url"
      />
    </div>

    <!-- Grid View -->
    <UContainer v-else-if="estates.length && viewMode === 'grid'">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <EstateCard
          v-for="estate in estatesSortedByVotes"
          :key="estate.url"
          :estate="estate"
          :current-user="currentUser"
          :has-user-voted="hasUserVotedForEstate(estate.url)"
          :votes="getVotesForEstate(estate.url)"
          :notes="getNotesForEstate(estate.url)"
          @vote="currentUser ? toggleVote(estate.url) : (showUserModal = true)"
          @delete="confirmDeleteEstate(estate)"
          @view-notes="openNotesModal(estate)"
        />
      </div>
    </UContainer>

    <!-- Empty State -->
    <UContainer v-else class="flex w-full items-center justify-center py-20">
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

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-red-600">Confirm Deletion</h3>
          </template>

          <div class="space-y-4">
            <p class="text-sm">
              Are you sure you want to remove this property? This will also
              delete all votes and notes for this property.
            </p>

            <div v-if="estateToDelete" class="rounded-lg bg-gray-50 p-3">
              <p class="text-sm font-medium">{{ estateToDelete.name }}</p>
              <p class="text-muted-foreground text-xs">
                {{ estateToDelete.location }}
              </p>
            </div>

            <div class="flex justify-end gap-2">
              <UButton
                @click="showDeleteModal = false"
                color="neutral"
                variant="ghost"
                label="Cancel"
              />
              <UButton
                @click="removeEstate"
                color="error"
                label="Delete Property"
                icon="i-mdi-trash-can"
              />
            </div>
          </div>
        </UCard>
      </template>
    </UModal>

    <!-- Notes Modal -->
    <UModal v-model:open="showNotesModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Notes</h3>
            <p
              v-if="selectedEstateForNotes"
              class="text-muted-foreground text-sm"
            >
              {{ selectedEstateForNotes.name }}
            </p>
          </template>

          <div class="max-h-96 space-y-4 overflow-y-auto">
            <!-- Existing notes (chronological order: oldest to newest) -->
            <div class="space-y-3">
              <div
                v-for="note in sortedNotesForSelectedEstate"
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
                      <span class="text-muted-foreground text-xs">
                        {{ new Date(note.timestamp).toLocaleDateString() }}
                      </span>
                    </div>
                    <p class="text-sm">{{ note.content }}</p>
                  </div>
                  <UButton
                    v-if="note.voterName === currentUser"
                    @click="removeNote(note)"
                    color="error"
                    variant="ghost"
                    size="xs"
                    icon="i-mdi-trash-can"
                  />
                </div>
              </div>

              <div
                v-if="sortedNotesForSelectedEstate.length === 0"
                class="text-muted-foreground py-4 text-center"
              >
                <Icon
                  name="i-mdi-note-off"
                  class="mx-auto mb-2 h-8 w-8 opacity-50"
                />
                <p class="text-sm">No notes yet</p>
              </div>
            </div>
          </div>

          <template #footer>
            <!-- Add new note (at the bottom like a messaging app) -->
            <div
              v-if="currentUser"
              class="mb-4 space-y-2 rounded-lg bg-gray-50 p-3"
            >
              <UTextarea
                v-model="newNote"
                placeholder="Add a note about this property..."
                :maxlength="150"
                :rows="3"
                class="w-full"
                @keyup.ctrl.enter="addNote"
              />
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground text-xs">
                  {{ newNote.length }}/150 characters
                </span>
                <UButton
                  @click="addNote"
                  color="primary"
                  size="sm"
                  :disabled="!newNote.trim()"
                  label="Add Note"
                  icon="i-mdi-plus"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <UButton
                @click="showNotesModal = false"
                color="neutral"
                variant="ghost"
                label="Close"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- User Identification Modal -->
    <UModal v-model:open="showUserModal" :prevent-close="!currentUser">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Who are you?</h3>
          </template>

          <div class="space-y-4">
            <p class="text-muted-foreground text-sm">
              {{
                allParticipants.length > 0
                  ? "Choose your name from the list or add yourself:"
                  : "Enter your name to start voting on properties:"
              }}
            </p>

            <!-- Existing participants -->
            <div v-if="allParticipants.length > 0" class="space-y-2">
              <p class="text-sm font-medium">Existing participants:</p>
              <div class="grid grid-cols-2 gap-2">
                <UButton
                  v-for="participant in allParticipants"
                  :key="participant"
                  @click="setCurrentUser(participant)"
                  color="primary"
                  variant="outline"
                  size="sm"
                  class="justify-start"
                >
                  {{ participant }}
                </UButton>
              </div>
            </div>

            <!-- New user input -->
            <div class="space-y-2">
              <p class="text-sm font-medium">
                {{
                  allParticipants.length > 0 ? "Or add yourself:" : "Your name:"
                }}
              </p>
              <UInput
                v-model="currentUser"
                placeholder="Enter your name"
                @keyup.enter="currentUser && setCurrentUser(currentUser)"
              />
            </div>

            <div class="flex justify-end gap-2">
              <UButton
                v-if="currentUser && allParticipants.length > 0"
                @click="showUserModal = false"
                color="neutral"
                variant="ghost"
                label="Cancel"
              />
              <UButton
                @click="setCurrentUser(currentUser)"
                color="primary"
                label="Continue"
                :disabled="!currentUser.trim()"
              />
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
