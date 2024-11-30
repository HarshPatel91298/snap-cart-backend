const Address = require('../models/addressModel');
const { PERMISSIONS } = require('../lib/accessControl');
const { ForbiddenError } = require('apollo-server-express');
const { authenticateAndAuthorize } = require('../lib/auth');

const addressResolver = {
  Query: {
    addresses: async (_, { limit = 10, offset = 0 }, context) => {
      console.log("################### Address ###############################");
      console.log({context});
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, 'address');
    
      let filter = {};
      let totalCount = 0;
    
      if (user.role !== 'admin') {
        filter = { userId: user.id };
      }
      console.log("User DB ID: ", user.db_id);
      console.log("Filter: ", filter);
      // Fetch addresses with pagination
      const addresses = await Address.find(filter)
        .skip(offset)
        .limit(limit)
        .sort({ isDefault: -1, createdAt: -1 });
    
      // If the user is an admin, count all addresses, else count only the user's addresses
      if (user.role === 'admin') {
        totalCount = await Address.countDocuments({});
      } else {
        totalCount = await Address.countDocuments({ userId: user.id });
      }


      console.log("Addresses #######: ", addresses);
    
      return {
        status: true,
        data: addresses,
        totalCount,
        message: 'Addresses fetched successfully',
      };
    }
    ,
    addressById: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, 'address');

      const address = await Address.findOne({ _id: id, userId: user.id });
      if (!address) {
        throw new ForbiddenError('Address not found');
      }

      return { status: true, data: address, message: 'Address found' };
    },
  },
  Mutation: {
    addAddress: async (_, { addressInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'address');
    
      // Handle default address logic
      if (addressInput.isDefault) {
        await Address.updateMany(
          { userId: user.db_id, isDefault: true }, // Use user.db_id instead of user.id
          { $set: { isDefault: false } }
        );
      }
    
      const newAddress = new Address({ ...addressInput, userId: user.db_id }); // Use user.db_id instead of user.id
      const address = await newAddress.save();
      return {
        status: true,
        data: address,
        message: 'Address created successfully',
      };
    },
    
    updateAddress: async (_, { id, addressInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'address');
    
      const address = await Address.findOne({ _id: id, userId: user.db_id }); // Use user.db_id instead of user.id
      if (!address) {
        throw new ForbiddenError('Address not found');
      }
    
      // Handle default address logic
      if (addressInput.isDefault) {
        await Address.updateMany(
          { userId: user.db_id, isDefault: true }, // Use user.db_id instead of user.id
          { $set: { isDefault: false } }
        );
      }
    
      Object.assign(address, addressInput);
      const updatedAddress = await address.save();
    
      return {
        status: true,
        data: updatedAddress,
        message: 'Address updated successfully',
      };
    },
    
    deleteAddress: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.DELETE, 'address');
    
      const address = await Address.findOneAndDelete({ _id: id, userId: user.db_id }); // Use user.db_id instead of user.id
      if (!address) {
        throw new ForbiddenError('Address not found');
      }
    
      return {
        status: true,
        data: null,
        message: 'Address deleted successfully',
      };
    },
    
    toggleDefaultStatus: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'address');
    
      const address = await Address.findOne({ _id: id, userId: user.db_id }); // Use user.db_id instead of user.id
      if (!address) {
        throw new ForbiddenError('Address not found');
      }
    
      // Unset current default if exists
      await Address.updateMany(
        { userId: user.db_id, isDefault: true }, // Use user.db_id instead of user.id
        { $set: { isDefault: false } }
      );
    
      address.isDefault = !address.isDefault;
      const updatedAddress = await address.save();
    
      return {
        status: true,
        data: updatedAddress,
        message: `Address marked as ${address.isDefault ? 'default' : 'non-default'} successfully`,
      };
    },    
  },
};

module.exports = { addressResolver };
