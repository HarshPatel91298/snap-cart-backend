const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    is_active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


// Create a new category
async function createCategory(categoryData) {
    try {
        // Create a new category

        // Add created date and updated date
        categoryData.createdAt = Date.now();
        categoryData.updatedAt = Date.now();

        const category = new Category(categoryData);
        const newCategory = await category.save();
        console.log("Category created:", newCategory);
        return newCategory;
    }
    catch (error) {
        console.error("Error creating category:", error);
    }
}

// Get all categories
async function getCategories() {
    try {
        // Find all categories
        const categories = await Category.find();
        console.log("Categories found:", categories);
        return categories;
    }
    catch (error) {
        console.error("Error finding categories:", error);
    }
}

// Get category by ID
async function getCategoryById(id) {
    try {
        // Find a category by ID
        const category = await Category.findById(id);
        return category;
    }
    catch (error) {
        console.error("Error finding category:", error);
    }
}

// Update category by ID
async function updateCategory(id, categoryData) {
    try {
        // Find a category by ID
        const category = await Category.findById(id);
        if (!category) {
            console.log("Category not found");
            return null;
        }

        // Update the category
        category.name = categoryData.name || category.name;
        category.description = categoryData.description || category.description;
        category.updatedAt = Date.now();

        const updatedCategory = await category.save();
        console.log("Category updated:", updatedCategory);
        return updatedCategory;
    }
    catch (error) {
        console.error("Error updating category:", error);
    }
}

// Archive category by ID
async function toggleCategoryStatusById(id) {
    try {
        // Find a category by ID
        const category = await Category.findById(id);
        if (!category) {
            console.log("Category not found");
            return null;
        }

        // Toggle the category status
        category.is_active = !category.is_active;
        category.updatedAt = Date.now();

        const updatedCategory = await category.save();
        console.log("Category status updated:", updatedCategory);
        return updatedCategory;
    }
    catch (error) {
        console.error("Error updating category status:", error);
    }
}

// Delete category by ID
async function deleteCategoryById(id) {
    try {
        // Find a category by ID
        const category = await Category.findById(id);
        if (!category) {
            return null;
        }

        // Delete the category
        const deletedCategory = await Category.deleteOne({ _id: id });
        return deletedCategory;
    }
    catch (error) {
        console.error("Error deleting category:", error);
    }
}


categorySchema.statics.createCategory = createCategory;
categorySchema.statics.getCategories = getCategories;
categorySchema.statics.getCategoryById = getCategoryById;
categorySchema.statics.updateCategory = updateCategory;
categorySchema.statics.toggleCategoryStatusById = toggleCategoryStatusById;
categorySchema.statics.deleteCategoryById = deleteCategoryById;



const Category = mongoose.model('Category', categorySchema);
module.exports = { Category };
