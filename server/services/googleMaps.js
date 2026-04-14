const axios = require('axios');
require('dotenv').config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const DISTANCE_MATRIX_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';

/**
 * Geocode an address to get latitude and longitude
 */
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(GOOGLE_GEOCODING_URL, {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY,
        region: 'in',
      },
    });

    if (response.data.results.length === 0) {
      throw new Error('Address not found');
    }

    const result = response.data.results[0];
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formatted_address: result.formatted_address,
    };
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

/**
 * Get place predictions for autocomplete
 */
const getPlacePredictions = async (input, components = 'country:in') => {
  try {
    const response = await axios.get(GOOGLE_PLACES_URL, {
      params: {
        input: input,
        components: components,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    return response.data.predictions || [];
  } catch (error) {
    throw new Error(`Place prediction failed: ${error.message}`);
  }
};

/**
 * Calculate distance between two points using Google Distance Matrix API
 */
const calculateDistance = async (origin, destination) => {
  try {
    const response = await axios.get(DISTANCE_MATRIX_URL, {
      params: {
        origins: `${origin.lat},${origin.lng}`,
        destinations: `${destination.lat},${destination.lng}`,
        mode: 'driving',
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (
      response.data.rows.length === 0 ||
      response.data.rows[0].elements[0].status !== 'OK'
    ) {
      throw new Error('Distance calculation failed');
    }

    const element = response.data.rows[0].elements[0];
    return {
      distance_meters: element.distance.value,
      distance_km: (element.distance.value / 1000).toFixed(2),
      duration_seconds: element.duration.value,
    };
  } catch (error) {
    throw new Error(`Distance calculation failed: ${error.message}`);
  }
};

/**
 * Haversine formula to calculate distance between two coordinates (in km)
 * Used as fallback when Google API is unavailable
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

module.exports = {
  geocodeAddress,
  getPlacePredictions,
  calculateDistance,
  haversineDistance,
};
