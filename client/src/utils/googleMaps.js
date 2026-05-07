import axios from 'axios';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const GOOGLE_GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

/**
 * Geocode an address to get latitude and longitude
 */
export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(GOOGLE_GEOCODING_URL, {
      params: {
        address: address,
        key: API_KEY,
        region: 'in',
      },
    });

    if (response.data.results.length === 0) {
      throw new Error('Address not found');
    }

    const result = response.data.results[0];
    const addressComponents = result.address_components;

    // Extract pin code and city from address components
    let pinCode = '';
    let city = '';

    addressComponents.forEach((component) => {
      if (component.types.includes('postal_code')) {
        pinCode = component.long_name;
      }
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_2') && !city) {
        city = component.long_name;
      }
    });

    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formatted_address: result.formatted_address,
      pin_code: pinCode,
      city: city,
    };
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

/**
 * Get place predictions for autocomplete
 */
export const getPlacePredictions = async (input) => {
  try {
    const response = await axios.get(GOOGLE_PLACES_URL, {
      params: {
        input: input,
        components: 'country:in',
        key: API_KEY,
      },
    });

    return response.data.predictions || [];
  } catch (error) {
    console.error('Place prediction error:', error);
    return [];
  }
};

/**
 * Get place details from place ID
 */
export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: 'geometry,formatted_address,address_components',
          key: API_KEY,
        },
      }
    );

    const result = response.data.result;
    const addressComponents = result.address_components;

    let pinCode = '';
    let city = '';

    addressComponents?.forEach((component) => {
      if (component.types.includes('postal_code')) {
        pinCode = component.long_name;
      }
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_2') && !city) {
        city = component.long_name;
      }
    });

    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formatted_address: result.formatted_address,
      pin_code: pinCode,
      city: city,
    };
  } catch (error) {
    throw new Error(`Failed to get place details: ${error.message}`);
  }
};
