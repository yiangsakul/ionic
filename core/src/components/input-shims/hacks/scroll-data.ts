
const SCROLL_ASSIST_SPEED = 0.3;

export interface ScrollData {
  scrollAmount: number;
  scrollPadding: number;
  scrollDuration: number;
  inputSafeY: number;
}

export function getScrollData(componentEl: HTMLElement, contentEl: HTMLElement, keyboardHeight: number): ScrollData {
  if (!contentEl) {
    return {
      scrollAmount: 0,
      scrollPadding: 0,
      scrollDuration: 0,
      inputSafeY: 0,
    };
  }
  // const scrollData = (componentEl as any)[SCROLL_DATA_KEY];
  // if (scrollData) {
  //   return scrollData;
  // }
  const itemEl = <HTMLElement>componentEl.closest('ion-item,[ion-item]') || componentEl;
  const newScrollData = calcScrollData(
    itemEl.getBoundingClientRect(),
    contentEl.getBoundingClientRect(),
    keyboardHeight,
    window.innerHeight
  );
  // (componentEl as any)[SCROLL_DATA_KEY] = newScrollData;
  return newScrollData;
}


function calcScrollData(
  inputRect: ClientRect,
  contentRect: ClientRect,
  keyboardHeight: number,
  plaformHeight: number
): ScrollData {
  // compute input's Y values relative to the body
  const inputTop = inputRect.top;
  const inputBottom = inputRect.bottom;

  // compute visible area
  const visibleAreaTop = contentRect.top;
  const visibleAreaBottom = Math.min(contentRect.bottom, plaformHeight - keyboardHeight);

  // compute safe area
  const safeAreaTop = visibleAreaTop + 10;
  const safeAreaBottom = visibleAreaBottom / 2.0;

  // figure out if each edge of teh input is within the safe area
  const distanceToBottom = safeAreaBottom - inputBottom;
  const distanceToTop = safeAreaTop - inputTop;

  // The scrollAmount is the negated distance to the safe area.
  const scrollAmount = Math.round((distanceToBottom < 0)
    ? -distanceToBottom
    : (distanceToTop > 0)
    ? -distanceToTop
    : 0);

  const distance = Math.abs(scrollAmount);
  const duration = distance / SCROLL_ASSIST_SPEED;
  const scrollDuration = Math.min(400, Math.max(150, duration));

  return  {
    scrollAmount,
    scrollDuration,
    scrollPadding: keyboardHeight,
    inputSafeY: -(inputTop - safeAreaTop) + 4
  };
}
