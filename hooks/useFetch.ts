import { getImages } from "@/service/apiImage";
import type { Filters, ImageType } from "@/types";
import type { Params } from "@/types/api/indext";
import { useCallback, useRef, useState } from "react";

interface useFetchProps {
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>;
  handleCloseModalPress: () => void;
  scrollToTop: () => void;
}

export function useFetch({
  setImages,
  handleCloseModalPress,
  scrollToTop,
}: useFetchProps) {
  const [category, setCategory] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({});
  const [searchText, setSearchText] = useState<string>("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // CHANGE 1: page moved from module-level `let` to a ref inside the hook.
  // Module-level state was shared across every component instance/remount.
  const pageRef = useRef(1);

  // CHANGE 2: a ref-based lock, checked synchronously, to stop overlapping
  // fetches during fast scrolling (state updates are async and were letting
  // multiple onEndReached calls slip through before `loadingMore` updated).
  const loadingMoreRef = useRef(false);

  const hasMoreRef = useRef(true);

  const fetchData = useCallback(async (params: Params, append = false) => {
    const data = await getImages(params);

    if (append) {
      setImages((prevImages) => [...prevImages, ...data]);
    } else {
      setImages(data);
    }
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
      const params: Params = { q: value };
      if (category) params.category = category;
      if (filters) Object.assign(params, { ...filters });

      // CHANGE 3: reset page whenever we start a fresh page-1 query
      pageRef.current = 1;

      fetchData(params);
    },
    [fetchData, category, filters],
  );

  const handleCategory = useCallback(
    (value: string) => {
      const params: Params = {};
      if (searchText) params.q = searchText;
      if (filters) Object.assign(params, { ...filters });

      if (category === value) {
        setCategory("");
        fetchData(params);
      } else {
        setCategory(value);
        params.category = value;
        fetchData(params);
      }

      pageRef.current = 1;
    },
    [category, fetchData, searchText, filters],
  );

  // CHANGE 4: wrapped in useCallback + guarded with the ref, not just state
  const handleLoadMore = useCallback(async () => {
    // we don't use state here since it's asynchronous
    if (loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true); // still drives the ActivityIndicator in the UI

    pageRef.current += 1;

    const params: Record<string, any> = { page: pageRef.current };
    if (category) params.category = category;
    if (searchText) params.q = searchText;
    if (filters) Object.assign(params, filters);

    try {
      const data = await getImages(params); // call getImages directly here to inspect length
      if (data.length === 0) {
        hasMoreRef.current = false;
      } else {
        setImages((prev) => [...prev, ...data]);
      }
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [category, searchText, filters, fetchData]);

  const handleFilterApply = useCallback(() => {
    const params: Params = { ...filters };

    if (category) params.category = category;
    if (searchText) params.q = searchText;

    pageRef.current = 1;

    fetchData(params);
    handleCloseModalPress();
  }, [filters, category, searchText, fetchData, handleCloseModalPress]);

  const handleFilterReset = useCallback(() => {
    const params: Params = {};
    if (category) params.category = category;
    if (searchText) params.q = searchText;

    pageRef.current = 1;

    fetchData(params);
    setFilters({});
    handleCloseModalPress();
    scrollToTop();
  }, [category, searchText, fetchData, handleCloseModalPress, scrollToTop]);

  // CHANGE 5: made async and awaits fetchData, so `refreshing` stays true
  // until the request actually resolves instead of flipping off instantly
  const handleRefreshing = useCallback(async () => {
    const params: Params = {};
    if (category) params.category = category;
    if (searchText) params.q = searchText;
    if (filters) Object.assign(params, filters);

    pageRef.current = 1;

    setRefreshing(true);
    try {
      await fetchData(params);
    } finally {
      setRefreshing(false);
    }
  }, [category, searchText, filters, fetchData]);

  return {
    fetchData,
    category,
    filters,
    setFilters,
    handleSearch,
    searchText,
    handleCategory,
    handleLoadMore,
    loadingMore,
    handleFilterReset,
    handleFilterApply,
    refreshing,
    handleRefreshing,
  };
}
