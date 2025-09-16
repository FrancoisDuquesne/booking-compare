<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { UButton } from "#components";
import { titleCase } from "scule";

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

// State
const urlInput = ref();

const viewMode = ref<"table" | "grid">("grid");
const currentUser = ref("");
const showUserModal = ref(false);
const isAddingEstate = ref(false);

const estates = ref<Estate[]>([]);

const votes = ref<Vote[]>([]);

// UTF-8 safe encoding/decoding functions
function safeEncode(str: string): string {
  try {
    return btoa(encodeURIComponent(str));
  } catch (e) {
    // Fallback for non-Latin1 characters
    return btoa(unescape(encodeURIComponent(str)));
  }
}

function safeDecode(str: string): string {
  try {
    return decodeURIComponent(atob(str));
  } catch (e) {
    // Fallback
    return decodeURIComponent(escape(atob(str)));
  }
}

// Initialize from URL parameters
onMounted(() => {
  initializeFromUrl();

  // Show user identification if no current user and there are participants
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
  [estates, votes],
  () => {
    updateUrlParams();
  },
  { deep: true },
);

function initializeFromUrl() {
  try {
    // Get estates from URL
    const estatesParam = route.query.estates as string;
    if (estatesParam) {
      const decodedEstates = JSON.parse(safeDecode(estatesParam));
      if (Array.isArray(decodedEstates) && decodedEstates.length > 0) {
        estates.value = decodedEstates;
      }
    }

    // Get votes from URL
    const votesParam = route.query.votes as string;
    if (votesParam) {
      const decodedVotes = JSON.parse(safeDecode(votesParam));
      if (Array.isArray(decodedVotes)) {
        votes.value = decodedVotes;
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

  // Update URL without triggering navigation
  const query = { ...route.query, ...params };
  router.replace({ query });
}

// Computed properties
const allParticipants = computed(() => {
  const participants = [...new Set(votes.value.map((v) => v.voterName))];
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
        src: row.original.image || "/placeholder.png",
        alt: "Estate Image",
        class: "object-cover max-w-44 rounded-lg",
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
            onClick: () => removeEstate(row.original.url),
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

function removeEstate(url: string) {
  estates.value = estates.value.filter((e) => e.url !== url);
  // Also remove votes for this estate
  votes.value = votes.value.filter((v) => v.estateUrl !== url);
  toast.add({ title: "Estate removed", color: "info" });
}

function getVotesForEstate(estateUrl: string): Vote[] {
  return votes.value.filter((v) => v.estateUrl === estateUrl);
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
    // Remove vote
    votes.value = votes.value.filter((v) => v !== existingVote);
    toast.add({ title: "Vote removed", color: "info" });
  } else {
    // Add vote
    votes.value.push({
      estateUrl,
      voterName: currentUser.value,
    });
    toast.add({ title: "Vote recorded!", color: "success" });
  }
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
      <UCard v-if="currentUser" class="mb-4">
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
                You've voted for {{ currentUserVotes.length }} properties
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
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
                      : 'bg-gray-200 text-gray-700',
                  ]"
                >
                  {{ participant }}
                </span>
                <span
                  v-if="allParticipants.length > 3"
                  class="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700"
                >
                  +{{ allParticipants.length - 3 }}
                </span>
              </div>
            </div>

            <UButton
              @click="showUserModal = true"
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-mdi-account-edit"
            />
          </div>
        </div>
      </UCard>

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
        <UCard
          v-for="estate in estatesSortedByVotes"
          :key="estate.url"
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
                :src="estate.image || '/placeholder.png'"
                alt="Estate Image"
                class="h-48 w-full object-cover"
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
                <span class="text-sm font-bold">{{
                  getVotesForEstate(estate.url).length
                }}</span>
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
              <span class="text-primary text-lg font-bold">{{
                estate.price
              }}</span>
            </div>
          </div>

          <template #footer>
            <!-- Voters list -->
            <div v-if="getVotesForEstate(estate.url).length > 0">
              <p class="text-muted-foreground mb-2 text-xs">Voted by:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="vote in getVotesForEstate(estate.url)"
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
            <div class="flex gap-2 pt-2">
              <UButton
                v-if="currentUser"
                @click="toggleVote(estate.url)"
                :color="
                  hasUserVotedForEstate(estate.url) ? 'neutral' : 'success'
                "
                :variant="hasUserVotedForEstate(estate.url) ? 'soft' : 'soft'"
                size="sm"
                :icon="
                  hasUserVotedForEstate(estate.url)
                    ? 'i-mdi-check'
                    : 'i-mdi-thumb-up'
                "
                :label="hasUserVotedForEstate(estate.url) ? 'Voted' : 'Vote'"
                class="flex-1"
              />
              <UButton
                v-else
                @click="showUserModal = true"
                color="success"
                variant="soft"
                size="sm"
                icon="i-mdi-account-plus"
                label="Identify to Vote"
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
                @click="removeEstate(estate.url)"
                color="error"
                variant="ghost"
                size="sm"
                icon="i-mdi-trash-can"
              />
            </div>
          </template>
        </UCard>
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
                v-if="currentUser"
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
