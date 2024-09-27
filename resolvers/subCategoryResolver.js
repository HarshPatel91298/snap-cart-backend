const { Query } = require('firebase-admin/firestore');
const { SubCategory } = require('../models/subCategoryModel');

const subCategoryResolver = {
    Query: {
        subCategories: async () => {
            try {
                // Fetch all subCategories
                const subCategories = await SubCategory.getSubCategories();
                return subCategories;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        subCategoryById: async (_, { id }) => {
            try {
                // Fetch a subCategory by ID
                const subCategory = await SubCategory.getSubCategoryById(id);
                if (!subCategory) {
                    return { status : false, data: null, message: "SubCategory not found" };
                }
                return { status : true, data: subCategory, message: "SubCategory found" };
            } catch (error) {
                throw new Error(error.message);
            }
        },
    },
    Mutation: {
        createSubCategory: async (_, { newSubCategory }) => {
            try {
                // Create a new subCategory
                const subCategory = await SubCategory.createSubCategory(newSubCategory);
                console.log("SubCategory created TTT:", subCategory);
                if (subCategory.status === false) {
                    console.log("SubCategory not created");
                    console.log(subCategory);
                    return subCategory;
                }
                return { status: true, data: subCategory, message: "SubCategory created successfully" };
            } catch (error) {
                throw new Error(error.message);
            }
        },
        updateSubCategory: async (_, { id, subCategoryData }) => {
            try {
                // Update a subCategory by ID
                const subCategory = await SubCategory.updateSubCategory(id, subCategoryData);
                if (!subCategory) {
                    return { status: false, data: null, message: "SubCategory not found" };
                }
                return { status: true, data: subCategory, message: "SubCategory updated successfully" };
            } catch (error) {
                throw new Error(error.message);
            }
        },
        toggleSubCategoryStatusById: async (_, { id }) => {
            try {
                // Toggle subCategory status by ID
                const subCategory = await SubCategory.toggleSubCategoryStatusById(id);
                if (!subCategory) {
                    return { status: false, data: null, message: "SubCategory not found" };
                }
                return { status: true, data: subCategory, message: "SubCategory status toggled successfully" };
            } catch (error) {
                throw new Error(error.message);
            }
        },
        deleteSubCategoryById: async (_, { id }) => {
            try {
                // Delete a subCategory by ID
                const subCategory = await SubCategory.deleteSubCategoryById(id);
                if (!subCategory || (subCategory.hasOwnProperty("deletedCount") && subCategory.deletedCount === 0)) {
                    return { status: false, data: null, message: "SubCategory not found" };
                }
                return { status: true, data: null, message: "SubCategory deleted successfully" };
            } catch (error) {
                throw new Error(error.message);
            }
        },

    }
};

module.exports = {subCategoryResolver};