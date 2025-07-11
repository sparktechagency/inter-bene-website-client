"use client";
import { useGetMyInvitedGroupsQuery } from "@/redux/features/group/groupApi";
import { useState, useEffect, useRef } from "react";
import { IGroupInvite } from "@/types/group.types";
import MyInvitationsGroupCard from "./MyInvitationsGroupCard";
import MyInvitationsGroupSkeleton from "./MyInvitationsGroupSkeleton";

const MyInvitationsGroups = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [invitedGroups, setInvitedGroups] = useState<IGroupInvite[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Get invited groups
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyInvitedGroupsQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
  ]);

  // Update invited groups when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const myAllInvitedGroups = responseData?.data?.attributes?.results || [];
    if (myAllInvitedGroups?.length > 0) {
      setInvitedGroups((prev) => {
        const existingIds = new Set(prev.map((group) => group._id));
        const newGroups = myAllInvitedGroups.filter(
          (group: IGroupInvite) => !existingIds.has(group._id)
        );
        return currentPage === 1 ? newGroups : [...prev, ...newGroups];
      });
    }
  }, [responseData, currentPage]);

  // Reset invited groups when sortBy changes
  useEffect(() => {
    setInvitedGroups([]);
    setCurrentPage(1);
  }, [sortBy]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const totalResults = responseData?.data?.attributes?.totalResults || 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          !isFetching &&
          invitedGroups.length < totalResults
        ) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, isFetching, invitedGroups.length, responseData, currentPage]);

  // const handleItemRemove = (itemId: string) => {
  //   setInvitedGroups((prev) => prev.filter((group) => group._id !== itemId));
  // };

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <MyInvitationsGroupSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1) {
    content = renderLoading();
  } else if (invitedGroups.length === 0 && !isLoading) {
    content = (
      <h1 className="text-center text-gray-500 py-8">
        No invited groups available
      </h1>
    );
  } else if (invitedGroups.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {invitedGroups?.map((group, index) => (
          <MyInvitationsGroupCard
            key={`${group._id}-${index}`}
            group={group}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {content}
      {isFetching && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MyInvitationsGroupSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default MyInvitationsGroups;
