import { useState, useEffect, useCallback } from 'react';

export function useInfiniteScroll<T>(initialItems: T[], itemsPerPage = 10) {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setItems(initialItems.slice(0, itemsPerPage));
    setHasMore(initialItems.length > itemsPerPage);
    setPage(1);
  }, [initialItems, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    const nextPage = page + 1;
    const nextItems = initialItems.slice(0, nextPage * itemsPerPage);
    setItems(nextItems);
    setHasMore(initialItems.length > nextItems.length);
    setPage(nextPage);
  }, [hasMore, page, initialItems, itemsPerPage]);

  return { items, hasMore, loadMore };
}
