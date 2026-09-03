import { useEffect, useRef, useState } from "react";

type Options<T> = {
  items: T[] | string[];
  onSelect?: (item: T | string, index: number) => void;
  loop?: boolean;
};

export function useKeyboardListNavigation<T>({
  items,
  onSelect,
  loop = false,
}: Options<T>) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemRefs = useRef<(HTMLLIElement| HTMLElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, query: string) => {
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = loop ? (activeIndex + 1) % items.length : Math.min(activeIndex + 1, items.length - 1);
      setActiveIndex(newIndex);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = loop ? (activeIndex - 1 + items.length) % items.length : Math.max(activeIndex - 1, 0);
      setActiveIndex(newIndex);
    }



    if (e.key === "Enter") {
      e.preventDefault();
      activeIndex == -1 ? onSelect?.(query, activeIndex) : onSelect?.(items[activeIndex], activeIndex);
      
    }
  };

  useEffect(() => {
  setActiveIndex(-1);
}, [items]);

  // Auto scroll into view
  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeIndex]);

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    itemRefs,
  };
}