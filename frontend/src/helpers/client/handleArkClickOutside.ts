import type { DialogRootProps } from "@ark-ui/react";

const whitelistScopes = ["date-picker", "select"];

export function handleArkClickOutside(
  event: Parameters<Exclude<DialogRootProps["onPointerDownOutside"], undefined>>[0],
  onClose: () => void,
) {
  const element = event.detail.originalEvent.target as HTMLElement | undefined;
  if (!element) {
    onClose();
  }

  if (
    (element?.dataset?.scope && whitelistScopes.includes(element.dataset.scope)) ||
    element?.tagName.toLowerCase() === "wcm-modal"
  ) {
    return;
  }

  const allToasts = document.querySelectorAll('li[data-scope="toast"]');
  for (let i = 0; i < allToasts.length; i++) {
    const toast = allToasts[i];
    const isToast = toast.contains(element as Node);
    if (isToast) {
      return;
    }
  }

  onClose();
}
