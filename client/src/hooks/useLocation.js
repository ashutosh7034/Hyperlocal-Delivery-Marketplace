import { useContext } from 'react';
import { LocationContext } from '../context/LocationContext';
import { haversineDistance } from '../utils/constants';

/**
 * Hook to use location context
 */
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

/**
 * Hook to filter nearby vendors
 */
export const useNearbyVendors = (vendors, radiusKm = 30) => {
  const { customerLocation } = useLocation();

  if (!customerLocation.lat || !customerLocation.lng) {
    return [];
  }

  return vendors
    .map((vendor) => {
      const distance = parseFloat(
        haversineDistance(
          customerLocation.lat,
          customerLocation.lng,
          vendor.lat,
          vendor.lng
        )
      );

      return {
        ...vendor,
        distance_km: distance,
        isDeliverable: distance <= vendor.delivery_radius_km,
      };
    })
    .filter((vendor) => vendor.isDeliverable && vendor.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km);
};
