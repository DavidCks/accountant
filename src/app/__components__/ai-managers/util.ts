// /ai-managers/util.ts
export type DownloadProgressEvent = Event & { loaded?: number; total?: number };

export function onDownloadProgress(
  target: EventTarget,
  cb: (loaded: number, total?: number) => void,
) {
  const handler = (e: Event) => {
    const ev = e as DownloadProgressEvent;
    cb(ev.loaded ?? 0, ev.total);
  };
  target.addEventListener("downloadprogress", handler as EventListener);
  // return an unsubscribe if you ever need it:
  return () =>
    target.removeEventListener("downloadprogress", handler as EventListener);
}
