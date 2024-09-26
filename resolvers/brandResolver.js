const Brand = require('../models/brandModel');

const brandResolver = {
    Query: {
        brands: async () => {
            try {
                // Fetch all brands
                const brands = await Brand.getBrands();
                return brands;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        brandById: async (_, { id }) => {
            try {
                // Fetch a brand by ID
                const brand = await Brand.getBrandById(id);
                if (!brand) {
                    return { data: null, message: "Brand not found" };
                }
                return { data: brand, message: "Brand found" };
            } catch (error) {
                throw new Error(error.message);
            }
        },
    },
    Mutation : {
        createBrand: async (_, { newBrand }) => {
            try {
                // Create a new brand
                const newBrandData = await Brand.createBrand(newBrand);
                return { data: newBrandData, message: "Brand created successfully" };
            } catch (error) {
                throw new Error(error.message);
            }
        },
        updateBrand: async (_, { id, brandData }) => {
            try {
                // Update a brand by ID
                const updatedBrand = await Brand.updateBrand(id, brandData);
                if (!updatedBrand) {
                    return { data: null, message: "Brand not found" };
                }
                return { data: updatedBrand, message: "Brand updated successfully" };
            } catch (error) {
                throw new Error(error.message);
            }
        },
        toggleBrandStatusById: async (_, { id }) => {
            try {
                // Archive a brand by ID
                const updatedBrand = await Brand.toggleBrandStatusById(id);
                if (!updatedBrand) {
                    return { data: null, message: "Brand not found" };
                }
                return { data: updatedBrand, message: "Brand status updated successfully" };
            } catch (error) {
                throw new Error(error.message);
            }
        }
    },
};

module.exports = {brandResolver};