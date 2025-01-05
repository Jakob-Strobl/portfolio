export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator == undefined) {
    console.error("copyToClipboard: navigator undefined");
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("copyToClipboard: threw exception", err);
  }

  return false;
}
