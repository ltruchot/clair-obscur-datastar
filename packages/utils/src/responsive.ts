/**
 * Detects if device is touch-only with no mouse/trackpad attached
 * No false positives (2025)
 *
 * @returns true if pure touch device (mobile/tablet without mouse)
 */
function isTouchOnlyDevice(): boolean {
  // Criterion 1: Device has a touch screen
  const hasTouchScreen = navigator.maxTouchPoints > 0;

  // Criterion 2: Primary pointer is coarse (finger, not mouse)
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  // Criterion 3: Device doesn't support hover (no mouse)
  const hasNoHover = window.matchMedia('(hover: none)').matches;

  // It's a pure touch device if:
  // - Has touch screen
  // - AND primary pointer is coarse
  // - AND doesn't support hover
  return hasTouchScreen && hasCoarsePointer && hasNoHover;
}

export { isTouchOnlyDevice };
