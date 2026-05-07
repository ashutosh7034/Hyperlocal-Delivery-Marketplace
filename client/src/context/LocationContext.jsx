import React, { createContext, useState, useCallback } from 'react';
import { geocodeAddress } from '../utils/googleMaps';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [customerLocation, setCustomerLocation] = useState({
    lat: null,
    lng: null,
    address: null,
    city: null,
    pinCode: null,
    loadingLocation: false,
    error: null,
  });

  const [savedAddresses, setSavedAddresses] = useState([]);

  /**
   * Geocode an address and update customer location
   */
  const updateLocationByAddress = useCallback(async (address) => {
    try {
      setCustomerLocation((prev) => ({
        ...prev,
        loadingLocation: true,
        error: null,
      }));

      const result = await geocodeAddress(address);

      setCustomerLocation({
        lat: result.lat,
        lng: result.lng,
        address: result.formatted_address,
        city: result.city || null,
        pinCode: result.pin_code || null,
        loadingLocation: false,
        error: null,
      });

      return result;
    } catch (error) {
      setCustomerLocation((prev) => ({
        ...prev,
        loadingLocation: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  /**
   * Use browser's geolocation to get current location
   */
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      setCustomerLocation((prev) => ({
        ...prev,
        loadingLocation: true,
        error: null,
      }));

      if (!navigator.geolocation) {
        const error = 'Geolocation is not supported by this browser';
        setCustomerLocation((prev) => ({
          ...prev,
          loadingLocation: false,
          error,
        }));
        reject(new Error(error));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setCustomerLocation((prev) => ({
              ...prev,
              lat: latitude,
              lng: longitude,
              loadingLocation: false,
            }));
            resolve({ lat: latitude, lng: longitude });
          } catch (error) {
            setCustomerLocation((prev) => ({
              ...prev,
              loadingLocation: false,
              error: error.message,
            }));
            reject(error);
          }
        },
        (error) => {
          const errorMessage = `Geolocation error: ${error.message}`;
          setCustomerLocation((prev) => ({
            ...prev,
            loadingLocation: false,
            error: errorMessage,
          }));
          reject(new Error(errorMessage));
        }
      );
    });
  }, []);

  /**
   * Set customer location manually (lat/lng)
   */
  const setLocation = useCallback((lat, lng, address = null) => {
    setCustomerLocation({
      lat,
      lng,
      address,
      city: null,
      pinCode: null,
      loadingLocation: false,
      error: null,
    });
  }, []);

  /**
   * Add saved address
   */
  const addSavedAddress = useCallback((addressData) => {
    setSavedAddresses((prev) => [...prev, addressData]);
  }, []);

  /**
   * Set primary/default address
   */
  const setDefaultAddress = useCallback((addressId) => {
    setSavedAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        is_default: addr.id === addressId,
      }))
    );
  }, []);

  const value = {
    customerLocation,
    savedAddresses,
    updateLocationByAddress,
    getCurrentLocation,
    setLocation,
    addSavedAddress,
    setDefaultAddress,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};
