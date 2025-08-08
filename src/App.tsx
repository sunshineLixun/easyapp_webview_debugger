import { useEffect, useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./index.css";
import {
  clickAdd,
  clickShowAlert,
  clickShowConfirm,
  clickShowPrompt,
  clickCheckUserAgent,
  clickCheckCookies,
  clickCustomScheme,
  selectFileFromInput,
  clickSharePhoto,
  clickDeviceLocation,
  clickCameraMicrophone,
  getHistoryFromQuery,
  isReloadNavigation,
  getProperties,
  copyTextToClipboard,
  sendSomethisToSwiftUI,
} from "./script/debugger";
import { registerReceiveMessageFunctions, registerSendMessageFunctions } from "./script/script-config";

function App() {
  const [schemeUrl, setSchemeUrl] = useState("sms://");
  const [historyCount, setHistoryCount] = useState(0);
  const [properties, setProperties] = useState<
    Record<string, string | number | boolean | null>
  >({});

  useEffect(() => {
    // mimic previous behavior: on reload, reset history to 0 without reloading the page
    if (isReloadNavigation()) {
      const url = new URL(window.location.href);
      url.searchParams.set("history", "0");
      window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    }
    setHistoryCount(getHistoryFromQuery());
    setProperties(getProperties());

    window.document.title = "WebView Debugger";

    registerSendMessageFunctions()

    registerReceiveMessageFunctions()

  }, []);

  const Button = useMemo(
    () =>
      function Button({
        onClick,
        children,
      }: {
        onClick?: () => void;
        children: React.ReactNode;
      }) {
        return (
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90 active:opacity-80 transition"
            onClick={onClick}
          >
            {children}
          </button>
        );
      },
    []
  );

  return (
    <div className="min-h-dvh bg-white text-gray-900">
      <main className="mx-auto px-4 py-6 space-y-6">
        <section className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Properties</h2>
            <div className="flex gap-2">
              <Button onClick={() => setProperties(getProperties())}>
                Refresh
              </Button>
              <Button
                onClick={async () => {
                  const text = Object.entries(properties)
                    .map(([k, v]) => `${k}: ${String(v)}`)
                    .join("\n");
                  await copyTextToClipboard(text);
                  window.alert("Copied to clipboard");
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {Object.entries(properties).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between gap-3">
                <span className="text-gray-600 w-40 shrink-0">{key}</span>
                <span className="font-mono break-all">{String(value)}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Navigation History</h2>
            <span className="text-sm text-gray-600">
              current: {historyCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={clickAdd}>Add history param</Button>
          </div>
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="text-lg font-medium mb-3">Dialogs</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={clickShowAlert}>Show Alert</Button>
            <Button onClick={clickShowConfirm}>Show Confirm</Button>
            <Button onClick={clickShowPrompt}>Show Prompt</Button>
          </div>
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="text-lg font-medium mb-3">Environment</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={clickCheckUserAgent}>Check User Agent</Button>
            <Button onClick={clickCheckCookies}>Check Cookies</Button>
          </div>
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="text-lg font-medium mb-3">Custom Scheme</h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              value={schemeUrl}
              onChange={(e) => setSchemeUrl(e.target.value)}
              placeholder="sms://"
              className="flex-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-black/20"
            />
            <Button onClick={() => clickCustomScheme(schemeUrl)}>
              Open URL
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              "sms://",
              "tel://",
              "facetime://",
              "facetime-audio://",
              "imessage://",
              "mailto://",
            ].map((u) => (
              <button
                key={u}
                type="button"
                className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90 active:opacity-80 transition"
                onClick={() => {
                  setSchemeUrl(u);
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="text-lg font-medium mb-3">File</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => selectFileFromInput(e.currentTarget)}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-black file:text-white hover:file:opacity-90"
          />
        </section>

        <section className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Save Image</h2>
          </div>
          <div className="flex items-center gap-4">
            <img
              id="sample"
              src={reactLogo}
              alt="sample"
              className="w-20 h-20"
            />
            <Button onClick={clickSharePhoto}>Share</Button>
          </div>
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="text-lg font-medium mb-3">Location</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={clickDeviceLocation}>Get device location</Button>
          </div>
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="text-lg font-medium mb-3">Camera & Microphone</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <video
              className="w-[400px] h-[300px] bg-black/5 rounded"
              muted
              autoPlay
              playsInline
            />
            <div className="flex gap-3">
              <Button onClick={clickCameraMicrophone}>Start</Button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="text-lg font-medium mb-3">SwiftUI</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={sendSomethisToSwiftUI}>Send Something to SwiftUI</Button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
