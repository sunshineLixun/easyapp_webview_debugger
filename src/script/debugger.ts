export const clickAdd = (): void => {
  const params = new URLSearchParams(window.location.search);
  const queries = Object.fromEntries(params.entries());
  if ("history" in queries) {
    const current =
      Number.parseInt(
        String((queries as Record<string, string>).history),
        10
      ) || 0;
    window.location.href = `?history=${current + 1}`;
  } else {
    window.location.href = "?history=1";
  }
};

export const clickShowAlert = (): void => {
  window.alert("Alert Test");
};

export const clickShowConfirm = (): void => {
  const result = window.confirm("Confirm Test");
  window.alert(`Result: ${result ? "OK" : "Cancel"}`);
};

export const clickShowPrompt = (): void => {
  const result = window.prompt("Prompt Test", "Placeholder");
  window.alert(`Result: ${result}`);
};

export const clickCheckUserAgent = (): void => {
  const userAgent = window.navigator.userAgent;
  window.alert(userAgent);
};

export const clickCheckCookies = (): void => {
  const cookies = document.cookie
    .split("; ")
    .map((item) => item.replace("=", " = "))
    .join("\n");
  window.alert(cookies);
};

export const clickCustomScheme = (url: string): void => {
  if (!url) {
    window.alert("URL is empty");
    return;
  }
  // Assigning string to location is allowed to navigate
  // eslint-disable-next-line no-restricted-globals
  (window.location as unknown as Location).href = url;
};

export const selectFile = (event: Event): void => {
  const target = event.target as HTMLInputElement | null;
  const file = target?.files?.[0];
  if (!file) {
    window.alert("No file selected");
    return;
  }
  const blobURL = URL.createObjectURL(file);
  const img = document.createElement("img");
  img.onload = function onLoad() {
    window.alert(`width: ${img.width}\nheight: ${img.height}`);
    URL.revokeObjectURL(blobURL);
  };
  img.onerror = function onError() {
    window.alert("Failed to load image");
    URL.revokeObjectURL(blobURL);
  };
  img.src = blobURL;
};

export const selectFileFromInput = (input: HTMLInputElement): void => {
  const file = input.files?.[0] ?? null;
  if (!file) {
    window.alert("No file selected");
    return;
  }
  const blobURL = URL.createObjectURL(file);
  const img = document.createElement("img");
  img.onload = function onLoad() {
    window.alert(`width: ${img.width}\nheight: ${img.height}`);
    URL.revokeObjectURL(blobURL);
  };
  img.onerror = function onError() {
    window.alert("Failed to load image");
    URL.revokeObjectURL(blobURL);
  };
  img.src = blobURL;
};

export const errorHandler = (error: unknown): void => {
  if (
    error &&
    typeof error === "object" &&
    "name" in error &&
    "message" in error
  ) {
    const named = error as { name: string; message: string };
    window.alert(`Error(${named.name}): ${named.message}`);
  } else {
    window.alert("Unknown error");
  }
};

export const clickSharePhoto = (): void => {
  if (typeof window.navigator.share !== "function") {
    window.alert("Error: navigator.share() is not implemented.");
    return;
  }

  const el = document.getElementById("sample");
  if (!(el instanceof HTMLImageElement)) {
    window.alert('Image with id "sample" not found.');
    return;
  }
  const img = el as HTMLImageElement;

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    window.alert("Canvas 2D context is not available");
    return;
  }
  context.drawImage(img, 0, 0);

  canvas.toBlob((blob) => {
    if (!blob) {
      window.alert("Failed to create image blob");
      return;
    }
    const file = new File([blob], "sample.png");
    const data: ShareData = {
      files: [file],
    } as unknown as ShareData;
    window.navigator.share(data).catch(errorHandler);
  }, "image/png");
};

export const clickDeviceLocation = (): void => {
  const successHandler = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    window.alert(`Latitude: ${latitude}\nLongitude: ${longitude}`);
  };

  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: 0,
  };

  if (!("geolocation" in window.navigator)) {
    window.alert("Geolocation is not supported in this browser");
    return;
  }
  window.navigator.geolocation.getCurrentPosition(
    successHandler,
    errorHandler,
    options
  );
};

export const clickCameraMicrophone = (): void => {
  const video = document.querySelector("video");
  if (!(video instanceof HTMLVideoElement)) {
    window.alert("Video element not found");
    return;
  }

  const constraints: MediaStreamConstraints = {
    audio: true,
    video: {
      width: 400,
      height: 300,
      facingMode: { exact: "environment" },
    },
  } as MediaStreamConstraints;

  window.navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream: MediaStream) => {
      video.srcObject = mediaStream;
      void video.play();
    })
    .catch(errorHandler);
};

export const getHistoryFromQuery = (): number => {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("history");
  const n = value ? Number.parseInt(value, 10) : 0;
  return Number.isFinite(n) ? n : 0;
};

export const isReloadNavigation = (): boolean => {
  const entries = window.performance.getEntriesByType(
    "navigation"
  ) as PerformanceEntry[];
  const nav = entries[0] as PerformanceNavigationTiming | undefined;
  return Boolean(nav && (nav as PerformanceNavigationTiming).type === "reload");
};

export type DebugProperties = Record<string, string | number | boolean | null>;

export const getProperties = (): DebugProperties => {
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth || 0;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight || 0;
  const timezone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
    } catch {
      return null;
    }
  })();

  return {
    url: window.location.href,
    origin: window.location.origin,
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    referrer: document.referrer || null,
    userAgent: window.navigator.userAgent,
    platform: window.navigator.platform,
    language: window.navigator.language,
    languages: Array.isArray(window.navigator.languages)
      ? window.navigator.languages.join(", ")
      : null,
    cookiesEnabled: window.navigator.cookieEnabled,
    online: window.navigator.onLine,
    devicePixelRatio: window.devicePixelRatio || 1,
    screenWidth: window.screen?.width ?? 0,
    screenHeight: window.screen?.height ?? 0,
    screenAvailWidth: window.screen?.availWidth ?? 0,
    screenAvailHeight: window.screen?.availHeight ?? 0,
    screenColorDepth: window.screen?.colorDepth ?? 0,
    viewportWidth,
    viewportHeight,
    historyLength: window.history.length,
    timezone,
  };
};

export const copyTextToClipboard = async (text: string): Promise<void> => {
  try {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // fallback below
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
};

export function sendSomethisToSwiftUI() {
  // Limit the random string length to a maximum of 16
  const maxLen = 16;
  const randomLen = Math.floor(Math.random() * maxLen) + 1; // 1 to 16
  // @ts-ignore
  if (window.sample && typeof window.sample.doSomething === "function") {
    //  @ts-ignore
    window.sample.doSomething(generateRandomString(randomLen));
  }
}

export function generateRandomString(length: number = 16): string {
  const maxLen = 16;
  const finalLength = Math.min(Math.max(1, Math.floor(length)), maxLen);
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < finalLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}


export function showSwiftUIMessage(message: string) {
  window.alert(message);
}