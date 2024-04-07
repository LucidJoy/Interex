import { toast } from "sonner";

export const copyToClipboard = async (address) => {
  try {
    await navigator.clipboard
      .writeText(address)
      .then(() => toast.success("Copied to clipboard."));
  } catch (err) {
    toast.error("Failed to copy.");
  }
};
