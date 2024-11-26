import { useState, useCallback, useEffect } from "react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

export const useServiceWorker = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  const [showReload, setShowReload] = useState<boolean>(false);

  const onSWUpdate = useCallback((registration: ServiceWorkerRegistration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  }, []);

  const reloadPage = useCallback(() => {
    if (!waitingWorker) {
      console.log("reloadPage waitingWorker is null:= ", waitingWorker);
      return;
    }
    console.log("reloadPage method ver 16");
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setShowReload(false);
  }, [waitingWorker]);

  useEffect(() => {
    console.log("useEffect serviceWorkerRegistration.register ver 16");
    serviceWorkerRegistration.register({
      onUpdate: (registration) => {
        console.log("serviceWorkerRegistration.register", registration);
        onSWUpdate(registration);
      },
    });
  }, [onSWUpdate]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let isControlled = Boolean(navigator.serviceWorker.controller);
    const abortController = new AbortController();

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {
        if (isControlled) {
          console.log("isControlled bingo reload", isControlled);
          window.location.reload();
        } else {
          console.log("isControlled set is controlled false", isControlled);
          isControlled = true;
        }
      },
      {
        signal: abortController.signal,
      }
    );

    return () => abortController.abort();
  }, []);

  return {
    isServiceWorkerUpdated: showReload && waitingWorker,
    reloadPage,
  };
};
