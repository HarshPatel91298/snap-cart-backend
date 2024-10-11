const { Category } = require('../models/categoryModel');
const { PERMISSIONS } = require('../lib/accessControl');
const { ForbiddenError } = require('apollo-server-express');
const { authenticateAndAuthorize } = require('../lib/auth'); // Import your auth utility

const categoryResolver = {
    Query: {
        categories: async (_, {}, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, 'category');
            return await Category.getCategories();
        },
        categoryById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.READ, 'category');

            const category = await Category.getCategoryById(id);
            if (!category) {
                throw new ForbiddenError("Category not found");
            }

            return { status: true, data: category, message: "Category found" };
        },
    },
    Mutation: {
        createCategory: async (_, { newCategory }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'category');

            const createdCategory = await Category.createCategory(newCategory);
            return { status: true, data: createdCategory, message: "Category created successfully" };
        },
        updateCategory: async (_, { id, categoryData }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.WRITE, 'category');

            const updatedCategory = await Category.updateCategory(id, categoryData);
            if (!updatedCategory) {
                throw new ForbiddenError("Category not found");
            }

            return { status: true, data: updatedCategory, message: "Category updated successfully" };
        },
        toggleCategoryStatusById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.DELETE, 'category');

            const updatedCategory = await Category.toggleCategoryStatusById(id);
            if (!updatedCategory) {
                throw new ForbiddenError("Category not found");
            }

            return { status: true, data: updatedCategory, message: "Category status updated successfully" };
        },
        deleteCategoryById: async (_, { id }, context) => {
            const user = context.user;
            await authenticateAndAuthorize(user, PERMISSIONS.DELETE, 'category');

            const deletedCategory = await Category.deleteCategoryById(id);
            if (!deletedCategory || (deletedCategory.deletedCount === 0)) {
                throw new ForbiddenError("Category not found");
            }

            return { status: true, data: null, message: "Category deleted successfully" };
        },
    },
};

module.exports = { categoryResolver };
