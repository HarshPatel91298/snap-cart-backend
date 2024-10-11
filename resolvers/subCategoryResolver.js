const { SubCategory } = require('../models/subCategoryModel');
const { PERMISSIONS } = require('../lib/accessControl');
const { ForbiddenError } = require('apollo-server-express');
const { authenticateAndAuthorize } = require('../lib/auth');

const subCategoryResolver = {
    Query: {
        subCategories: async (_, {}, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, 'subCategory');
            return await SubCategory.getSubCategories();
        },
        subCategoryById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, 'subCategory');

            const subCategory = await SubCategory.getSubCategoryById(id);
            if (!subCategory) {
                throw new ForbiddenError("SubCategory not found");
            }

            return { status: true, data: subCategory, message: "SubCategory found" };
        },
    },
    Mutation: {
        createSubCategory: async (_, { newSubCategory }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'subCategory');

            const createdSubCategory = await SubCategory.createSubCategory(newSubCategory);
            return { status: true, data: createdSubCategory, message: "SubCategory created successfully" };
        },
        updateSubCategory: async (_, { id, subCategoryData }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'subCategory');

            const updatedSubCategory = await SubCategory.updateSubCategory(id, subCategoryData);
            if (!updatedSubCategory) {
                throw new ForbiddenError("SubCategory not found");
            }

            return { status: true, data: updatedSubCategory, message: "SubCategory updated successfully" };
        },
        toggleSubCategoryStatusById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.DELETE, 'subCategory');

            const updatedSubCategory = await SubCategory.toggleSubCategoryStatusById(id);
            if (!updatedSubCategory) {
                throw new ForbiddenError("SubCategory not found");
            }

            return { status: true, data: updatedSubCategory, message: "SubCategory status updated successfully" };
        },
        deleteSubCategoryById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.DELETE, 'subCategory');

            const deletedSubCategory = await SubCategory.deleteSubCategoryById(id);
            if (!deletedSubCategory || (deletedSubCategory.deletedCount === 0)) {
                throw new ForbiddenError("SubCategory not found");
            }

            return { status: true, data: null, message: "SubCategory deleted successfully" };
        },
    },
};

module.exports = { subCategoryResolver };
