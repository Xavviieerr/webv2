"use client";

import { useState, useCallback, useMemo } from "react";
import { useGetUserPostsQuery } from "../api/communityEndpoints";
import { COMMUNITY_PAGE_SIZE } from "../constants";
import type { CommunityPostsQueryParams } from "../types";

export function useUserPosts(initialParams: CommunityPostsQueryParams = {}) {
  const [params, setParams] = useState<CommunityPostsQueryParams>({
    page: 1,
    limit: COMMUNITY_PAGE_SIZE,
    ...initialParams,
  });

  const { data, isLoading, isFetching, error, refetch } = useGetUserPostsQuery(params);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const rawPosts = data?.posts ?? [];
  const pagination = data?.pagination ?? null;

  const posts = useMemo(() => {
    return [...rawPosts].sort((a, b) => {
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return dateB - dateA;
    });
  }, [rawPosts]);

  return {
    posts,
    pagination,
    params,
    isLoading,
    isFetching,
    error,
    refetch,
    setPage,
  };
}
