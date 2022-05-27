import {type EffectCallback, useEffect, useRef} from 'react';

/**
 * Tymczasowe obejście na podwójny use effect on mount w trybie lokalnym.
 * Docelowo, do wyrzucenia, a kod wyrzkostyujący powinien być przerobiony. Do tego czasu mamy to co ammy ;)
 * @param effect
 */
export const useMount = (effect: EffectCallback) => {
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      return effect();
    }
    mounted.current = true;
    return () => {};
  }, [mounted, effect]);
};
