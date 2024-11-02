const Address = require("../models/addressModel");
const { PERMISSIONS } = require("../lib/accessControl");
const { ForbiddenError } = require("apollo-server-express");
const { authenticateAndAuthorize } = require("../lib/auth"); // Import your auth utility

const addressResolver = {
  Query: {
    addresses: async (_, __, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "address");

      const addresses = await Address.find();
      return {
        status: true,
        data: addresses,
        message: "Addresses fetched successfully",
      };
    },
    addressById: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "address");

      const address = await Address.findById(id);
      if (!address) {
        throw new ForbiddenError("Address not found");
      }

      return { status: true, data: address, message: "Address found" };
    },
  },
  Mutation: {
    addAddress: async (_, { addressInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "address");

      const newAddress = new Address(addressInput);
      const address = await newAddress.save();
      return {
        status: true,
        data: address,
        message: "Address created successfully",
      };
    },
    updateAddress: async (_, { id, addressInput }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "address");

      const updatedAddress = await Address.findByIdAndUpdate(id, addressInput, {
        new: true,
      });
      if (!updatedAddress) {
        throw new ForbiddenError("Address not found");
      }

      return {
        status: true,
        data: updatedAddress,
        message: "Address updated successfully",
      };
    },
    deleteAddress: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.DELETE, "address");

      const deletedAddress = await Address.findByIdAndDelete(id);
      if (!deletedAddress) {
        throw new ForbiddenError("Address not found");
      }

      return {
        status: true,
        data: null,
        message: "Address deleted successfully",
      };
    },
  },
};

module.exports = { addressResolver };
