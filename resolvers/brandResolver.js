const { Brand } = require('../models/brandModel');
const { PERMISSIONS } = require('../lib/accessControl'); 
const { ForbiddenError } = require('apollo-server-express');
const { authenticateAndAuthorize } = require('../lib/auth'); // Import your auth utility

const brandResolver = {
    Query: {
        brands: async (_, {}, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, 'brand');
            return await Brand.getBrands();
        },
        brandById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, 'brand');

            const brand = await Brand.getBrandById(id);
            if (!brand) {
                throw new ForbiddenError("Brand not found");
            }

            return { status: true, data: brand, message: "Brand found" };
        },
    },
    Mutation: {
        createBrand: async (_, { newBrand }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'brand');

            console.log("track 1");

            const createdBrand = await Brand.createBrand(newBrand);
            return { status: true, data: createdBrand, message: "Brand created successfully" };
        },
        updateBrand: async (_, { id, brandData }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'brand');

            const updatedBrand = await Brand.updateBrand(id, brandData);
            if (!updatedBrand) {
                throw new ForbiddenError("Brand not found");
            }

            return { status: true, data: updatedBrand, message: "Brand updated successfully" };
        },
        toggleBrandStatusById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.DELETE, 'brand');

            const updatedBrand = await Brand.toggleBrandStatusById(id);
            if (!updatedBrand) {
                throw new ForbiddenError("Brand not found");
            }

            return { status: true, data: updatedBrand, message: "Brand status updated successfully" };
        },
        deleteBrandById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.DELETE, 'brand');

            const deletedBrand = await Brand.deleteBrandById(id);
            if (!deletedBrand || (deletedBrand.deletedCount === 0)) {
                throw new ForbiddenError("Brand not found");
            }

            return { status: true, data: null, message: "Brand deleted successfully" };
        },
    },
};

module.exports = { brandResolver };
