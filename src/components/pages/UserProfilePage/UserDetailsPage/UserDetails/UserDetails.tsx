import { IUser } from "@/types/user.types";
import moment from "moment";

const UserDetails = ({ userData }: { userData: IUser }) => {
  return (
    <div className="w-full bg-white p-6 rounded-2xl">
      {/* Header with Title and Edit Button */}
      <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Details</h2>
      </div>

      {/* User Details List */}
      <div className="space-y-[32px] mt-10">
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Full name
          </h1>
          <h1 className="w-full md:w-96 text-[#9194A9]">
            {userData?.fullName || "N/A"}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Nick name
          </h1>
          <h1 className="text-[#9194A9]">{userData?.nickname || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Username
          </h1>
          <h1 className="text-[#9194A9]">{userData?.username || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Joined
          </h1>
          <h1 className="text-[#9194A9]">
            {userData?.createdAt
              ? moment(userData.createdAt).format("MM-DD-YY")
              : "N/A"}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Email
          </h1>
          <h1 className="text-[#9194A9]">{userData?.email || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Phone Number
          </h1>
          <h1 className="text-[#9194A9]">{userData?.phoneNumber || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Country
          </h1>
          <h1 className="text-[#9194A9]">{userData?.country || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            City
          </h1>
          <h1 className="text-[#9194A9]">{userData?.city || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            State
          </h1>
          <h1 className="text-[#9194A9]">{userData?.state || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Referred as
          </h1>
          <h1 className="text-[#9194A9]">{userData?.referredAs || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Age range
          </h1>
          <h1 className="text-[#9194A9]">{userData?.ageRange || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Profession
          </h1>
          <h1 className="text-[#9194A9]">{userData?.profession || "N/A"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96 font-medium text-[#9194A9] text-[16px]">
            Relationship Status
          </h1>
          <h1 className="text-[#9194A9]">{userData?.maritalStatus || "N/A"}</h1>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;