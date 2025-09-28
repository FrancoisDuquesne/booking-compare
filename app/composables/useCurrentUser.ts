import { ref, useState, useToast } from '#imports';

export function useCurrentUser() {
  const toast = useToast();
  const currentUser = useState<string>('current-user', () => '');
  const showUserModal = ref(false);

  function setCurrentUser(name: string) {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    currentUser.value = trimmed;
    showUserModal.value = false;
    toast.add({ title: `Welcome, ${trimmed}!`, color: 'success' });
  }

  function promptForUser(message?: string) {
    if (message) {
      toast.add({ title: message, color: 'warning' });
    }

    showUserModal.value = true;
  }

  return {
    currentUser,
    showUserModal,
    setCurrentUser,
    promptForUser,
  };
}
