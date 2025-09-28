import { useToast } from '#imports';

export function useShareableUrl() {
  const toast = useToast();

  async function copyShareableUrl(targetUrl?: string) {
    if (!import.meta.client) {
      return;
    }

    try {
      await navigator.clipboard.writeText(targetUrl ?? window.location.href);
      toast.add({ title: 'Shareable URL copied to clipboard!', color: 'success' });
    } catch (error) {
      console.error('Failed to copy URL', error);
      toast.add({ title: 'Unable to copy URL', color: 'error' });
    }
  }

  return { copyShareableUrl };
}
