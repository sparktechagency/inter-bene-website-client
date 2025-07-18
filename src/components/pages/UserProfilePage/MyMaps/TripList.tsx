"use client";
import { useGetVisitedPostsWithDistanceQuery } from "@/redux/features/post/postApi";
import TripCard from "./TripCard";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ISearchPost } from "@/types/search.types";
import TripCardSkeleton from "./TripCardSkeleton";

const TripList = ({
  mapHide,
  showFullMap,
}: {
  mapHide: boolean;
  showFullMap: boolean;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;

  const { data: responseData, isLoading } = useGetVisitedPostsWithDistanceQuery(
    [
      {
        key: "page",
        value: currentPage,
      },
      {
        key: "limit",
        value: limit,
      },
    ],
    { refetchOnMountOrArgChange: true }
  );

  const tripsData = responseData?.data?.attributes?.results;
  const totalPages = responseData?.data?.attributes?.totalPages;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-1 gap-5 ${
          mapHide ? "md:grid-cols-3 lg:grid-cols-4" : "md:grid-cols-2"
        }`}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <TripCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`w-full p-2 flex flex-col gap-5 ${
        mapHide ? "col-span-full" : showFullMap ? "hidden" : "col-span-1"
      }`}
    >
      {/* Trip Cards Grid */}
      <div
        className={`grid grid-cols-1 gap-5 ${
          mapHide ? "md:grid-cols-3 lg:grid-cols-4" : "md:grid-cols-2"
        }`}
      >
        {tripsData
          ?.filter((trip: ISearchPost) => trip?.media[0]?.mediaType)
          .map((trip: ISearchPost, index: number) => (
            <TripCard key={trip._id || index} trip={trip} />
          ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {/* Previous Button */}
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`size-8 flex justify-center items-center cursor-pointer rounded-full border transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 cursor-pointer"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`size-8 cursor-pointer rounded-full border transition-colors ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`size-8 flex justify-center items-center rounded-full border transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 cursor-pointer"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* No Results */}
      {!isLoading && (!tripsData || tripsData.length === 0) && (
        <div className="text-center text-gray-500 py-8">
          No trips found. Start exploring and share your adventures!
        </div>
      )}
    </div>
  );
};

export default TripList;
