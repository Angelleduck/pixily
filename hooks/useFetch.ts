import { getImages } from "@/service/apiImage";
import type { Filters, ImageType } from "@/types";
import type { Params } from "@/types/api/indext";
import { useCallback, useState } from "react";

interface useFetchProps {
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>;
  handleCloseModalPress: () => void;
  scrollToTop: () => void;
}
let page = 1;
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
      page = 1;
    },
    [category, fetchData, searchText, filters],
  );

  const handleLoadMore = async () => {
    if (loadingMore) return;

    setLoadingMore(true);

    page += 1;

    const params: Record<string, any> = { page };
    if (category) params.category = category;
    if (searchText) params.q = searchText;
    if (filters) Object.assign(params, filters);

    await fetchData(params, true);

    setLoadingMore(false);
  };

  const handleFilterApply = () => {
    const params: Params = { ...filters };

    if (category) params.category = category;
    if (searchText) params.q = searchText;

    fetchData(params);
    handleCloseModalPress();
  };

  const handleFilterReset = () => {
    let params: Params = {};
    if (category) params.category = category;
    if (searchText) params.q = searchText;

    fetchData(params);
    setFilters({});
    handleCloseModalPress();
    scrollToTop();
  };

  const handleRefreshing = () => {
    const params: Params = {};
    if (category) params.category = category;
    if (searchText) params.q = searchText;
    if (filters) Object.assign(params, filters);

    setRefreshing(true);
    fetchData(params);
    setRefreshing(false);
  };

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
