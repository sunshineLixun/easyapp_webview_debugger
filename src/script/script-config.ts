import { showSwiftUIMessage } from "./debugger";

/**
 * common post message to SwiftUI
 * @param message message to send to SwiftUI
 */
function commonPostMessage(message: string) {
  // @ts-ignore
  webkit.messageHandlers.sample.postMessage({
    message: message,
  });
}

/**
 * The functions registered here are specifically for sending messages to the SwiftUI client
 */
export function registerSendMessageFunctions() {
  //@ts-ignore
  window.sample.doSomething = function (message: string) {
    // @ts-ignore
    commonPostMessage(message);
  };

  // if your SwiftUI has a function that you want to call, you can register it here
}

/**
 * The functions registered here are specifically for SwiftUI client to call
 */
export function registerReceiveMessageFunctions() {
  //@ts-ignore
  window.sample = {
    showSwiftUIMessage: showSwiftUIMessage,
  };

  // If you want to receive messages from SwiftUI, you can register your functions here
}