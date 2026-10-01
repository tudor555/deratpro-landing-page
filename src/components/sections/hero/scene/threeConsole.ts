import { setConsoleFunction } from "three";

type Level = "log" | "warn" | "error";
type Sink = Pick<Console, Level>;
type StackTrace = { isStackTrace: true; getError: (message: string) => Error };

/**
 * React Three Fiber 9 creates a THREE.Clock internally, which three r183+ flags as deprecated.
 * Nothing in our code can act on it; R3F 10 moves to THREE.Timer. Remove this when upgrading.
 */
const SILENCED = ["THREE.Clock: This module has been deprecated."];

const isStackTrace = (value: unknown): value is StackTrace =>
  typeof value === "object" && value !== null && (value as { isStackTrace?: unknown }).isStackTrace === true;

/** Console function for three.js that drops known dependency noise and forwards everything else as three would. */
export function createThreeConsole(sink: Sink = console) {
  return (level: Level, message: string, ...params: unknown[]) => {
    if (SILENCED.some((prefix) => message.startsWith(prefix))) return;
    if (isStackTrace(params[0])) {
      sink[level](params[0].getError(message));
      return;
    }
    sink[level](message, ...params);
  };
}

export function installThreeConsole() {
  setConsoleFunction(createThreeConsole());
}
