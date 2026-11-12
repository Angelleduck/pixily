import { getImages, PAGE_SIZE } from "@/service/apiImage";
import type { Filters, ImageType } from "@/types";
import type { Params } from "@/types/api/indext";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [draftFilters, setDraftFilters] = useState<Filters>({});
  const [searchText, setSearchText] = useState<string>("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const firstPageLoadingRef = useRef(false);
  const requestVersionRef = useRef(0);
  const paramsRef = useRef<Params>({});

  const fetchData = useCallback(async (params: Params, refresh = false) => {
    const version = ++requestVersionRef.current;
    paramsRef.current = { ...params };
    pageRef.current = 1;
    hasMoreRef.current = true;
    firstPageLoadingRef.current = true;
    loadingMoreRef.current = false;
    setLoadingMore(false);
    setRefreshing(refresh);

    try {
      const data = await getImages({ ...params, page: 1 });
      if (version !== requestVersionRef.current) return;

      setImages(data.hits);
      hasMoreRef.current =
        data.hits.length === PAGE_SIZE && data.totalHits > PAGE_SIZE;
    } finally {
      if (version === requestVersionRef.current) {
        firstPageLoadingRef.current = false;
        setRefreshing(false);
      }
    }
  }, [setImages]);

  useEffect(() => {
    void fetchData({});
    return () => {
      requestVersionRef.current += 1;
    };
  }, [fetchData]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
      const params: Params = { q: value };
      if (category) params.category = category;
      Object.assign(params, filters);

      void fetchData(params);
    },
    [fetchData, category, filters],
  );

  const handleCategory = useCallback(
    (value: string) => {
      const params: Params = {};
      if (searchText) params.q = searchText;
      Object.assign(params, filters);

      if (category === value) {
        setCategory("");
        void fetchData(params);
      } else {
        setCategory(value);
        params.category = value;
        void fetchData(params);
      }
    },
    [category, fetchData, searchText, filters],
  );

  const handleLoadMore = useCallback(async () => {
    if (
      loadingMoreRef.current ||
      firstPageLoadingRef.current ||
      !hasMoreRef.current
    ) return;

    const version = requestVersionRef.current;
    const nextPage = pageRef.current + 1;
    loadingMoreRef.current = true;
    setLoadingMore(true);

    const params: Params = { ...paramsRef.current, page: nextPage };

    try {
      const data = await getImages(params);
      if (version !== requestVersionRef.current) return;

      pageRef.current = nextPage;
      hasMoreRef.current =
        data.hits.length === PAGE_SIZE &&
        data.totalHits > nextPage * PAGE_SIZE;
      if (data.hits.length > 0) setImages((prev) => [...prev, ...data.hits]);
    } finally {
      if (version === requestVersionRef.current) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [setImages]);

  const resetFilterDraft = useCallback(() => {
    setDraftFilters({ ...filters });
  }, [filters]);

  const handleFilterApply = useCallback(() => {
    const params: Params = { ...draftFilters };

    if (category) params.category = category;
    if (searchText) params.q = searchText;

    setFilters({ ...draftFilters });
    void fetchData(params);
    handleCloseModalPress();
  }, [draftFilters, category, searchText, fetchData, handleCloseModalPress]);

  const handleFilterReset = useCallback(() => {
    const params: Params = {};
    if (category) params.category = category;
    if (searchText) params.q = searchText;

    void fetchData(params);
    setFilters({});
    setDraftFilters({});
    handleCloseModalPress();
    scrollToTop();
  }, [category, searchText, fetchData, handleCloseModalPress, scrollToTop]);

  const handleRefreshing = useCallback(async () => {
    const params: Params = { ...filters };
    if (category) params.category = category;
    if (searchText) params.q = searchText;

    await fetchData(params, true);
  }, [category, searchText, filters, fetchData]);

  return {
    category,
    draftFilters,
    setDraftFilters,
    resetFilterDraft,
    handleSearch,
    handleCategory,
    handleLoadMore,
    loadingMore,
    handleFilterReset,
    handleFilterApply,
    refreshing,
    handleRefreshing,
  };
}
