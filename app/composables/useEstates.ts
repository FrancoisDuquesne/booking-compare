import { computed, onMounted, ref, useRoute, useRouter, useToast, watch } from '#imports';
import type { Ref } from 'vue';
import { createDefaultEstates } from '~/data/defaultEstates';
import type { Estate, Note, Vote } from '~/types/estate';
import { safeDecode, safeEncode } from '~/utils/safeEncoding';

type RequireIdentificationFn = (message?: string) => void;

interface UseEstatesOptions {
  currentUser: Ref<string>;
  requireIdentification: RequireIdentificationFn;
}

export function useEstates({ currentUser, requireIdentification }: UseEstatesOptions) {
  const toast = useToast();
  const route = useRoute();
  const router = useRouter();

  const estates = ref<Estate[]>(createDefaultEstates());
  const votes = ref<Vote[]>([]);
  const notes = ref<Note[]>([]);

  const isAddingEstate = ref(false);
  const estateToDelete = ref<Estate | null>(null);
  const selectedEstateForNotes = ref<Estate | null>(null);
  const newNote = ref('');
  const showDeleteModal = ref(false);
  const showNotesModal = ref(false);
  const columnPinning = ref({ right: ['actions'] as string[] });

  function getVotesForEstate(estateUrl: string) {
    return votes.value.filter((vote) => vote.estateUrl === estateUrl);
  }

  function getNotesForEstate(estateUrl: string) {
    return notes.value.filter((note) => note.estateUrl === estateUrl);
  }

  async function addEstate(url: string) {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      toast.add({ title: 'Please enter a URL', color: 'warning' });
      return false;
    }

    if (estates.value.some((estate) => estate.url === trimmedUrl)) {
      toast.add({ title: 'This estate is already in the list', color: 'info' });
      return false;
    }

    let endpoint = '';

    if (trimmedUrl.includes('booking.com')) {
      endpoint = '/api/scrapeBooking';
    } else if (trimmedUrl.includes('airbnb.')) {
      endpoint = '/api/scrapeAirbnb';
    } else {
      toast.add({
        title: 'Unsupported URL',
        description: 'Only Booking.com or Airbnb links are supported.',
        color: 'error',
      });
      return false;
    }

    isAddingEstate.value = true;

    try {
      const estate = await $fetch<Estate | { error: string }>(endpoint, {
        params: { url: trimmedUrl },
      });

      if ('error' in estate) {
        toast.add({
          title: 'Scraping failed',
          description: estate.error,
          color: 'error',
        });
        return false;
      }

      estates.value.push(estate);
      toast.add({ title: 'Estate added successfully', color: 'success' });
      return true;
    } catch (error: any) {
      console.error('Scraping failed:', error);
      toast.add({
        title: 'Scraping failed',
        description: error?.message ?? 'Unknown error',
        color: 'error',
      });
      return false;
    } finally {
      isAddingEstate.value = false;
    }
  }

  function confirmDeleteEstate(estate: Estate) {
    estateToDelete.value = estate;
    showDeleteModal.value = true;
  }

  function removeEstate() {
    if (!estateToDelete.value) {
      return;
    }

    const targetUrl = estateToDelete.value.url;

    estates.value = estates.value.filter((estate) => estate.url !== targetUrl);
    votes.value = votes.value.filter((vote) => vote.estateUrl !== targetUrl);
    notes.value = notes.value.filter((note) => note.estateUrl !== targetUrl);

    toast.add({ title: 'Estate removed', color: 'info' });
    showDeleteModal.value = false;
    estateToDelete.value = null;
  }

  function ensureUserIdentified() {
    if (currentUser.value) {
      return true;
    }

    requireIdentification('Please identify yourself first');
    return false;
  }

  function toggleVote(estateUrl: string) {
    if (!ensureUserIdentified()) {
      return;
    }

    const existingVote = votes.value.find(
      (vote) => vote.estateUrl === estateUrl && vote.voterName === currentUser.value,
    );

    if (existingVote) {
      votes.value = votes.value.filter((vote) => vote !== existingVote);
      toast.add({ title: 'Vote removed', color: 'info' });
    } else {
      votes.value.push({ estateUrl, voterName: currentUser.value });
      toast.add({ title: 'Vote recorded!', color: 'success' });
    }
  }

  function openNotesModal(estate: Estate) {
    selectedEstateForNotes.value = estate;
    showNotesModal.value = true;
  }

  function addNote() {
    if (!ensureUserIdentified()) {
      return;
    }

    if (!selectedEstateForNotes.value || !newNote.value.trim()) {
      toast.add({ title: 'Please enter a note', color: 'warning' });
      return;
    }

    if (newNote.value.length > 150) {
      toast.add({ title: 'Note too long (max 150 characters)', color: 'warning' });
      return;
    }

    notes.value.push({
      estateUrl: selectedEstateForNotes.value.url,
      voterName: currentUser.value,
      content: newNote.value.trim(),
      timestamp: Date.now(),
    });

    toast.add({ title: 'Note added!', color: 'success' });
    newNote.value = '';
  }

  function removeNote(target: Note) {
    if (target.voterName !== currentUser.value) {
      toast.add({ title: 'You can only remove your own notes', color: 'warning' });
      return;
    }

    notes.value = notes.value.filter((note) => note !== target);
    toast.add({ title: 'Note removed', color: 'info' });
  }

  function closeNotesModal() {
    showNotesModal.value = false;
    selectedEstateForNotes.value = null;
    newNote.value = '';
  }

  function initializeFromUrl() {
    try {
      const estatesParam = route.query.estates;
      if (typeof estatesParam === 'string') {
        const decoded = JSON.parse(safeDecode(estatesParam));
        if (Array.isArray(decoded) && decoded.length > 0) {
          estates.value = decoded;
        }
      }

      const votesParam = route.query.votes;
      if (typeof votesParam === 'string') {
        const decoded = JSON.parse(safeDecode(votesParam));
        if (Array.isArray(decoded)) {
          votes.value = decoded;
        }
      }

      const notesParam = route.query.notes;
      if (typeof notesParam === 'string') {
        const decoded = JSON.parse(safeDecode(notesParam));
        if (Array.isArray(decoded)) {
          notes.value = decoded;
        }
      }
    } catch (error) {
      console.warn('Failed to parse URL parameters:', error);
    }
  }

  function updateUrlParams() {
    if (!import.meta.client) {
      return;
    }

    const params: Record<string, string | undefined> = { ...route.query };

    if (estates.value.length > 0) {
      params.estates = safeEncode(JSON.stringify(estates.value));
    } else {
      delete params.estates;
    }

    if (votes.value.length > 0) {
      params.votes = safeEncode(JSON.stringify(votes.value));
    } else {
      delete params.votes;
    }

    if (notes.value.length > 0) {
      params.notes = safeEncode(JSON.stringify(notes.value));
    } else {
      delete params.notes;
    }

    router.replace({ query: params });
  }

  onMounted(() => {
    if (import.meta.client) {
      initializeFromUrl();
    }
  });

  watch(
    [estates, votes, notes],
    () => {
      updateUrlParams();
    },
    { deep: true },
  );

  const allParticipants = computed(() => {
    const participants = new Set<string>();

    votes.value.forEach((vote) => participants.add(vote.voterName));
    notes.value.forEach((note) => participants.add(note.voterName));

    return Array.from(participants).sort();
  });

  const currentUserVotes = computed(() =>
    votes.value.filter((vote) => vote.voterName === currentUser.value),
  );

  const hasUserVotedForEstate = computed(
    () => (estateUrl: string) =>
      votes.value.some(
        (vote) => vote.estateUrl === estateUrl && vote.voterName === currentUser.value,
      ),
  );

  const estatesSortedByVotes = computed(() =>
    [...estates.value].sort(
      (left, right) => getVotesForEstate(right.url).length - getVotesForEstate(left.url).length,
    ),
  );

  const sortedNotesForSelectedEstate = computed(() => {
    if (!selectedEstateForNotes.value) {
      return [] as Note[];
    }

    return getNotesForEstate(selectedEstateForNotes.value.url).sort(
      (a, b) => a.timestamp - b.timestamp,
    );
  });

  return {
    // state
    estates,
    votes,
    notes,
    isAddingEstate,
    estateToDelete,
    selectedEstateForNotes,
    newNote,
    showDeleteModal,
    showNotesModal,
    columnPinning,
    // getters
    allParticipants,
    currentUserVotes,
    hasUserVotedForEstate,
    estatesSortedByVotes,
    sortedNotesForSelectedEstate,
    // operations
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
  };
}
