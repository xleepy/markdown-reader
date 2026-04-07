import { useEffect, useEffectEvent } from "react";

const SCROLL_LINES = 3;

// SGR mouse encoding: ESC [ < button ; col ; row M/m
// button 64 = scroll up, 65 = scroll down
const SGR_MOUSE_RE = /\x1b\[<(\d+);\d+;\d+[Mm]/g;

export function useMouseScroll(onScroll: (delta: number) => void) {
  const handleScroll = useEffectEvent(onScroll);

  useEffect(() => {
    if (!process.stdout.isTTY) return;

    // Enable mouse button reporting + SGR extended coordinates
    process.stdout.write("\x1b[?1000h\x1b[?1006h");

    // process.exit() skips React cleanup, so also disable via the exit event
    const disableMouse = () => process.stdout.write("\x1b[?1000l\x1b[?1006l");
    process.on("exit", disableMouse);

    const handleData = (data: Buffer) => {
      const str = data.toString("binary");
      for (const match of str.matchAll(SGR_MOUSE_RE)) {
        const button = parseInt(match[1]);
        if (button === 64) handleScroll(-SCROLL_LINES); // wheel up
        if (button === 65) handleScroll(+SCROLL_LINES); // wheel down
      }
    };

    process.stdin.on("data", handleData);

    return () => {
      disableMouse();
      process.off("exit", disableMouse);
      process.stdin.off("data", handleData);
    };
  }, []);
}
