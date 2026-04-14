const { CustomerProfile, User, CustomerAddress } = require('../models');
const { geocodeAddress } = require('../services/googleMaps');

/**
 * Get customer profile
 */
const getCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const customer = await CustomerProfile.findOne({
      where: { user_id: userId },
      include: [{ model: User, as: 'user', attributes: ['email', 'name'] }],
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found',
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get customer's saved addresses
 */
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await CustomerAddress.findAll({
      where: { user_id: userId },
      order: [['is_default', 'DESC'], ['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add new customer address
 */
const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { label, full_address, city, pin_code, is_default } = req.body;

    // Validate required fields
    if (!full_address || !city || !pin_code) {
      return res.status(400).json({
        success: false,
        message: 'Address, city, and pin code are required',
      });
    }

    // Validate pin code
    if (!/^\d{6}$/.test(pin_code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pin code. Must be 6 digits',
      });
    }

    // Geocode the address
    let geocodeResult;
    try {
      const fullAddressStr = `${full_address}, ${city}, ${pin_code}, India`;
      geocodeResult = await geocodeAddress(fullAddressStr);
    } catch (geocodeError) {
      return res.status(400).json({
        success: false,
        message: 'Unable to geocode address. Please verify the address.',
      });
    }

    // If this is the first address or explicitly set as default, make it default
    let setAsDefault = is_default || false;
    const existingAddresses = await CustomerAddress.findAll({
      where: { user_id: userId },
    });

    if (existingAddresses.length === 0) {
      setAsDefault = true;
    }

    // If setting as default, update other addresses
    if (setAsDefault) {
      await CustomerAddress.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
    }

    // Create new address
    const address = await CustomerAddress.create({
      user_id: userId,
      label: label || 'Home',
      full_address,
      city,
      pin_code,
      lat: geocodeResult.lat,
      lng: geocodeResult.lng,
      is_default: setAsDefault,
    });

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update customer address
 */
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { label, full_address, city, pin_code, is_default } = req.body;

    // Find address
    const address = await CustomerAddress.findOne({
      where: {
        id: addressId,
        user_id: userId,
      },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Update fields
    if (label) address.label = label;
    if (full_address) address.full_address = full_address;
    if (city) address.city = city;
    if (pin_code) address.pin_code = pin_code;

    // If setting as default, update other addresses
    if (is_default) {
      await CustomerAddress.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
      address.is_default = true;
    }

    // Geocode if address changed
    if (full_address || city || pin_code) {
      try {
        const fullAddressStr = `${address.full_address}, ${address.city}, ${address.pin_code}, India`;
        const geocodeResult = await geocodeAddress(fullAddressStr);
        address.lat = geocodeResult.lat;
        address.lng = geocodeResult.lng;
      } catch (geocodeError) {
        return res.status(400).json({
          success: false,
          message: 'Unable to geocode address',
        });
      }
    }

    await address.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete customer address
 */
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const address = await CustomerAddress.findOne({
      where: {
        id: addressId,
        user_id: userId,
      },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // If deleting default address, set another as default
    if (address.is_default) {
      const nextAddress = await CustomerAddress.findOne({
        where: { user_id: userId, id: { [require('sequelize').Op.ne]: addressId } },
        order: [['created_at', 'DESC']],
      });

      if (nextAddress) {
        nextAddress.is_default = true;
        await nextAddress.save();
      }
    }

    await address.destroy();

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCustomerProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
