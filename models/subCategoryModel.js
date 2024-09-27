const mongoose = require('mongoose');
const { Category } = require('./categoryModel');

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    is_active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

// Create a new subCategory
async function createSubCategory(subCategoryData) {
    try {
        // Create a new subCategory

        // Add created date and updated date
        subCategoryData.createdAt = Date.now();
        subCategoryData.updatedAt = Date.now();

        console.log("SubCategory data:", subCategoryData);

        // Find a category by ID
        const category = await Category.getCategoryById(subCategoryData.category_id);
        console.log("Category found ##:", category);
        if (!category) {
            console.error("Category not found");
            return { status: false, data: null, message: "Category not found" };
        }

        const subCategory = new SubCategory(subCategoryData);
        const newSubCategory = await subCategory.save();
        console.log("SubCategory created:", newSubCategory);
        return newSubCategory;
    }
    catch (error) {
        console.error("Error creating subCategory:", error);
    }
}

// Get all subCategories
async function getSubCategories() {
    try {
        // Find all subCategories
        const subCategories = await SubCategory.find();
        console.log("SubCategories found:", subCategories);
        return subCategories;
    }
    catch (error) {
        console.error("Error finding subCategories:", error);
    }
}

// Get subCategory by ID
async function getSubCategoryById(id) {
    try {
        // Find a subCategory by ID
        const subCategory = await SubCategory.findById(id);
        console.log("SubCategory found:", subCategory);
        return subCategory;
    }
    catch (error) {
        console.error("Error finding subCategory:", error);
    }
}

// Update subCategory by ID
async function updateSubCategory(id, subCategoryData) {
    try {
        // Find a subCategory by ID
        const subCategory = await SubCategory.findById(id);
        if (!subCategory) {
            console.error("SubCategory not found");
            return null;
        }
        // Update subCategory
        subCategoryData.updatedAt = Date.now();
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, subCategoryData, { new: true });
        console.log("SubCategory updated:", updatedSubCategory);
        return updatedSubCategory;
    }
    catch (error) {
        console.error("Error updating subCategory:", error);
    }
}

// Archive subCategory by ID
async function toggleSubCategoryStatusById(id) {
    try {
        // Find a subCategory by ID and toggle status

        // Find a subCategory by ID
        const subCategory = await SubCategory.findById(id);
        if (!subCategory) {
            console.error("SubCategory not found");
            return null;
        }

        subCategory.is_active = !subCategory.is_active;
        subCategory.updatedAt = Date.now();

        const updatedSubCategory = await subCategory.save();
        console.log("SubCategory archived:", updatedSubCategory);
        return updatedSubCategory;
    }
    catch (error) {
        console.error("Error archiving subCategory:", error);
    }
}

// Delete subCategory by ID
async function deleteSubCategoryById(id) {
    try {
        // Find a subCategory by ID
        const subCategory = await SubCategory.findById(id);
        if (!subCategory) {
            console.error("SubCategory not found");
            return null;
        }

        // Find a subCategory by ID and delete
        const deleteSubCategory = await SubCategory.deleteOne({ _id: id });
        console.log("SubCategory deleted:", deleteSubCategory);
        return deleteSubCategory;
    }
    catch (error) {
        console.error("Error deleting subCategory:", error);
    }
}

subCategorySchema.statics.createSubCategory = createSubCategory;
subCategorySchema.statics.getSubCategories = getSubCategories;
subCategorySchema.statics.getSubCategoryById = getSubCategoryById;
subCategorySchema.statics.updateSubCategory = updateSubCategory;
subCategorySchema.statics.toggleSubCategoryStatusById = toggleSubCategoryStatusById;
subCategorySchema.statics.deleteSubCategoryById = deleteSubCategoryById;


const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = { SubCategory };