"use client";
import CustomButton from "@/components/custom/custom-button";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import CustomModal from "@/components/custom/custom-modal";
import CustomSelectField from "@/components/custom/custom-seletectField";
import { FieldValues, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import DayCard from "./DayCard";

interface CreateItineraryModalProps {
  visible: boolean;
  onClose: () => void;
  handleCreateItinerary: (values: FieldValues) => void;
  isLoading: boolean;
}

const CreateItineraryModal = ({
  visible,
  onClose,
  handleCreateItinerary,
  isLoading,
}: CreateItineraryModalProps) => {
  const methods = useForm();
  const { control } = methods;
  return (
    <CustomModal
      header={
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">
            Create Itinerary
          </h2>
          <button
            className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
            onClick={onClose}
          >
            <IoClose size={18} />
          </button>
        </div>
      }
      isOpen={visible}
      onClose={onClose}
      className="w-full p-2"
    >
      <CustomForm onSubmit={handleCreateItinerary}>
        <div className="w-full space-y-2">
          <CustomInput
            name="tripName"
            label="Trip Name"
            type="text"
            variant="default"
            size="md"
            fullWidth
            placeholder="Name your adventure (e.g., European Escape)"
            required
          />
          <CustomSelectField
            name="travelMode"
            label="Travel Mode"
            size="md"
            placeholder="How will you travel? (e.g., Plane)"
            items={[
              {
                value: "plane",
                label: "Plane",
              },
              {
                value: "train",
                label: "Train",
              },
              {
                value: "bus",
                label: "Bus",
              },
              {
                value: "car",
                label: "Car",
              },
              {
                value: "bicycle",
                label: "Bicycle",
              },
              {
                value: "walk",
                label: "Walk",
              },
              {
                value: "boat",
                label: "Boat",
              },
              {
                value: "motorcycle",
                label: "Motorcycle",
              },
            ]}
            required
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <CustomInput
              name="departure"
              label="Departure"
              type="text"
              variant="default"
              size="md"
              fullWidth
              placeholder="Where are you starting? (e.g., New York)"
              required
            />
            <CustomInput
              name="arrival"
              label="Arrival"
              type="text"
              variant="default"
              size="md"
              fullWidth
              placeholder="Where are you headed? (e.g., Paris)"
              required
            />
          </div>
          <div className="mb-4">
            <DayCard control={control} />
          </div>
          <CustomButton
            variant="default"
            fullWidth
            loading={isLoading}
            type="submit"
            className="px-5 py-3"
          >
            Create Itinerary
          </CustomButton>
        </div>
      </CustomForm>
    </CustomModal>
  );
};

export default CreateItineraryModal;
