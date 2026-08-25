import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  modifierKey?: 'ctrl' | 'meta' | 'alt' | 'shift'
): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let modifierPressed = true;
      if (modifierKey === 'ctrl') modifierPressed = event.ctrlKey;
      if (modifierKey === 'meta') modifierPressed = event.metaKey;
      if (modifierKey === 'alt') modifierPressed = event.altKey;
      if (modifierKey === 'shift') modifierPressed = event.shiftKey;

      if (event.key.toLowerCase() === key.toLowerCase() && modifierPressed) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, modifierKey]);
}
