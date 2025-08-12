import React, { useState, useRef, useEffect } from "react";
import { LocateIcon, MapPin } from "lucide-react";
import {
  LocationDetails,
  LocationPrediction,
  useGoogleLocationSearchFixed,
} from "@/hooks/useGoogleLocationSearchFixed";

interface LocationSearchInputProps {
  value?: string;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  onLocationSelect?: (location: LocationDetails) => void;
  onInputChange?: (value: string) => void;
  showSelectedInfo?: boolean;
  disabled?: boolean;
}

const LocationSearchInputFixed: React.FC<LocationSearchInputProps> = ({
  value = "",
  placeholder = "Search for a location...",
  className = "",
  label = "Location",
  required = false,
  onLocationSelect,
  onInputChange,
  showSelectedInfo = true,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [selectedLocation, setSelectedLocation] = useState<LocationDetails | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    predictions,
    isLoading,
    isInitialized,
    searchLocations,
    getLocationDetails,
    clearPredictions,
    error,
  } = useGoogleLocationSearchFixed({
    debounceMs: 300,
    minQueryLength: 2,
  });

  // Update input when external value changes
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedLocation(null);
    onInputChange?.(newValue);

    if (newValue.length === 0) {
      clearPredictions();
      setShowDropdown(false);
    } else {
      searchLocations(newValue);
    }
  };

  // Handle location selection
  const handleLocationSelect = async (prediction: LocationPrediction) => {
    try {
      const locationDetails = await getLocationDetails(prediction.place_id);

      if (locationDetails) {
        setInputValue(prediction.description);
        setSelectedLocation(locationDetails);
        setShowDropdown(false);
        clearPredictions();

        // Call the callback with location details
        onLocationSelect?.(locationDetails);
        onInputChange?.(prediction.description);
      }
    } catch (error) {
      console.error("Error selecting location:", error);
    }
  };

  // Show dropdown when predictions are available
  useEffect(() => {
    if (predictions.length > 0) {
      setShowDropdown(true);
    }
  }, [predictions]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPlaceholderText = () => {
    if (error) return "Location services unavailable";
    if (!isInitialized) return "Loading location services...";
    return placeholder;
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={getPlaceholderText()}
            disabled={disabled || !isInitialized || !!error}
            className={`w-full px-4 py-3 pl-12 border rounded-lg outline-none transition-colors ${
              error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            }`}
            onFocus={() => {
              if (predictions.length > 0) {
                setShowDropdown(true);
              }
            }}
          />
          <LocateIcon
            size={20}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              error ? "text-red-400" : "text-gray-400"
            }`}
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

        {/* Dropdown with predictions */}
        {showDropdown && predictions.length > 0 && !error && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                onClick={() => handleLocationSelect(prediction)}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-start gap-3 transition-colors"
              >
                <MapPin size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prediction.main_text}
                  </p>
                  {prediction.secondary_text && (
                    <p className="text-xs text-gray-500 truncate">
                      {prediction.secondary_text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected location info */}
        {showSelectedInfo && selectedLocation && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-green-800 font-medium">
                  Selected: {selectedLocation.name}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Lat: {selectedLocation.latitude.toFixed(6)}, Lng:{" "}
                  {selectedLocation.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearchInputFixed;