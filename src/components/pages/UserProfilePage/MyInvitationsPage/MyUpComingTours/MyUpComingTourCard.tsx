import CustomButton from "@/components/custom/custom-button";
import { useNotInterestEventMutation } from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { IEvent } from "@/types/event.types";
import { getFullName } from "@/utils/nameUtils";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";

interface UpcomingEventCardProps {
  event: IEvent;
}

const MyUpComingTourCard = ({ event }: UpcomingEventCardProps) => {
  const [notInterest, { isLoading: isNotInterestLoading }] =
    useNotInterestEventMutation();
  const handleNotInterest = async () => {
    try {
      await notInterest(event?._id).unwrap();
      toast.success("Marked as not interested successfully.");
    } catch (error) {
      const err = error as TError;
      toast.error(
        err?.data?.message ||
          "Failed to mark as not interested. Please try again."
      );
      console.error("Failed to mark as not interested:", error);
    }
  };
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Group Image */}
      <div className="w-full h-[350px] bg-gray-200 rounded-xl mb-4 relative">
        <Image
          src={event?.eventImage}
          alt={event?.eventName}
          width={350}
          height={350}
          className="w-full h-full object-cover rounded-2xl mb-4"
        />
        <div className="absolute px-4 py-5 rounded-xl top-0 left-0 right-0 bottom-0 bg-gray-950/20">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex  justify-between items-center">
              <Image
                src={event?.creatorId?.profileImage}
                alt={getFullName(event?.creatorId) || "Creator"}
                width={60}
                height={60}
                className="size-[60px] rounded-full object-cover mr-3 "
              />
              <div className="bg-white rounded-full px-4 py-2 flex items-center gap-1">
                <PiUserBold size={24} className="text-secondary" />
                <span className="text-sm font-semibold text-gray-800">
                  {event?.interestCount}
                </span>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {event?.eventName}
            </h2>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full">
        <Link href={`/events/${event?._id}`}>
          <CustomButton variant="default" className="py-3" fullWidth>
            View
          </CustomButton>
        </Link>
        <CustomButton
          loading={isNotInterestLoading}
          onClick={handleNotInterest}
          variant="outline"
          className="py-3"
          fullWidth
        >
          Not Interest
        </CustomButton>
      </div>
    </div>
  );
};

export default MyUpComingTourCard;
