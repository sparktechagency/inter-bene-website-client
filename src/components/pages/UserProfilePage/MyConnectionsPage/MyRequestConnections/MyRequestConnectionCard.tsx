import CustomButton from "@/components/custom/custom-button";
import {
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
} from "@/redux/features/connections/connectionsApi";
import { IConnectionRequest } from "@/types/connection.types";
import { TError } from "@/types/error";
import { getFullName } from "@/utils/nameUtils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";

const MyRequestConnectionCard = ({
  connection,
}: {
  connection: IConnectionRequest;
}) => {
  const [acceptConnection, { isLoading: acceptLoading }] =
    useAcceptConnectionMutation();
  const [declineConnection, { isLoading: declineLoading }] =
    useDeclineConnectionMutation();

  const handleAcceptConnection = async () => {
    try {
      await acceptConnection(connection?._id).unwrap();
      toast.success("Connection accepted successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  const handleDeclineConnection = async () => {
    try {
      await declineConnection(connection?._id).unwrap();
      toast.success("Connection declined successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="w-full flex items-center justify-between bg-white p-4 rounded-xl">
      <Link href={`/${connection?.sentBy?.username}`}>
        <div className="flex items-center space-x-4">
          <Image
            src={connection?.sentBy?.profileImage}
            alt={getFullName(connection?.sentBy) || "User"}
            width={70}
            height={70}
            className="w-[70px] h-[70px] rounded-full object-cover ring-2 ring-gray-300"
          />
          <div className="flex flex-col">
            <span className="text-gray-800 font-semibold text-lg">
              {getFullName(connection?.sentBy)}
            </span>
            <span className="text-gray-600">
              @{connection?.sentBy?.username}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <CustomButton
          onClick={handleAcceptConnection}
          loading={acceptLoading}
          variant="default"
          className="px-8 py-2.5"
        >
          Accept
        </CustomButton>
        <CustomButton
          onClick={handleDeclineConnection}
          loading={declineLoading}
          variant="outline"
          className="px-8 py-2.5"
        >
          Decline
        </CustomButton>
      </div>
    </div>
  );
};

export default MyRequestConnectionCard;
