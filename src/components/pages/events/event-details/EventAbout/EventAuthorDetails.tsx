import { IEventDetails } from "@/types/event.types";
import Image from "next/image";
const EventAuthorDetails = ({
  eventDetailsData,
}: {
  eventDetailsData: IEventDetails;
}) => {
  return (
    <div className="w-full col-span-full md:col-span-7 bg-white p-6 md:p-9 rounded-xl">
      <h1 className="text-2xl font-semibold">Meet Your Leader</h1>
      <div className="py-5">
        {eventDetailsData?.creatorId?.profileImage && (
          <Image
            src={eventDetailsData?.creatorId?.profileImage}
            alt="leader"
            width={174}
            height={174}
            className="size-[174px] object-cover rounded-full mx-auto"
          />
        )}

        <div className="mt-5">
          <h1 className="text-xl md:text-2xl xl:text-3xl font-semibold text-center text-gray-950">
            {`${eventDetailsData?.creatorId?.firstName} ${eventDetailsData?.creatorId?.lastName}`}
          </h1>
          <div className="flex flex-wrap gap-2 text-gray-600 text-base items-center justify-center">
            <p className="text-gray-600 text-center">
              @{eventDetailsData?.creatorId?.username}
            </p>
            <div className="size-1.5 bg-[#9194A9] rounded-full"></div>
            <p className="text-gray-600 text-center">Joined May 2025</p>
          </div>
        </div>
      </div>
      <h1 className="text-lg">{eventDetailsData?.creatorId?.description}</h1>
    </div>
  );
};

export default EventAuthorDetails;
