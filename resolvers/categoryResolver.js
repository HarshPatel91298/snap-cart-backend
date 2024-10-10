const { Category } = require('../models/categoryModel')

const categoryResolver = {
  Query: {
    categories: async () => {
      try {
        // Fetch all categories
        return await Category.getCategories()
      } catch (error) {
        throw new Error(error.message)
      }
    },
    categoryById: async (_, { id }) => {
      try {
        // Fetch category by ID
        const category = await Category.getCategoryById(id)
        if (!category) {
          throw new Error('Category not found')
        }
        return category
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
  Mutation: {
    createCategory: async (_, { newCategory }) => {
      try {
        // Create a new category
        console.log('newCategory', newCategory)
        const category = await Category.createCategory(newCategory)
        if (!category) {
          return { status: false, data: null, message: 'Category not created' }
        }
        return {
          status: true,
          data: category,
          message: 'Category created successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    updateCategory: async (_, { id, categoryData }) => {
      try {
        // Update a category by ID
        const category = await Category.updateCategory(id, categoryData)
        if (!category) {
          return { status: false, data: null, message: 'Category not found' }
        }
        return {
          status: true,
          data: category,
          message: 'Category updated successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    toggleCategoryStatusById: async (_, { id }) => {
      try {
        // Toggle category status by ID
        const category = await Category.toggleCategoryStatusById(id)
        if (!category) {
          return { status: false, data: null, message: 'Category not found' }
        }
        return {
          status: true,
          data: category,
          message: 'Category status toggled successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    deleteCategoryById: async (_, { id }) => {
      try {
        // Delete category by ID
        const category = await Category.deleteCategoryById(id)
        console.log('category', category)
        if (
          !category ||
          (category.hasOwnProperty('deletedCount') &&
            category.deletedCount === 0)
        ) {
          console.log('Category not found')
          return { status: false, data: null, message: 'Category not found' }
        }
        return {
          status: true,
          data: null,
          message: 'Category deleted successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
  },
}

module.exports = { categoryResolver }
