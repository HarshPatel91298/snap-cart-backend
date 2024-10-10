const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    logoURL: { type: String },
    is_active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
    });


// Create a new brand
async function createBrand(brandData) {
    try {
      // Create a new brand

      // Add created date and updated date
      brandData.createdAt = Date.now();
      brandData.updatedAt = Date.now();

      const brand = new Brand(brandData);
      const newBrand = await brand.save();
      console.log("Brand created:", newBrand);
      return newBrand;
    }
    catch (error) {
      console.error("Error creating brand:", error);
    }
}

// Get all brands
async function getBrands() {
    try {
      // Find all brands
      const brands = await Brand.find();
      console.log("Brands found:", brands);
      return brands;
    }
    catch (error) {
      console.error("Error finding brands:", error);
    }
}

// Get brand by ID
async function getBrandById(id) {
    try {
      // Find a brand by ID
      const brand = await Brand.findById(id);
      console.log("Brand found:", brand);
      return brand;
    }
    catch (error) {
      console.error("Error finding brand:", error);
    }
}

// Update brand by ID
async function updateBrand(id, brandData) {
    try {
      // Find a brand by ID and update
      brandData.updatedAt = Date.now();
      const updatedBrand = await Brand.findByIdAndUpdate(id, brandData, { new: true });
      console.log("Brand updated:", updatedBrand);
      return updatedBrand;
    }
    catch (error) {
      console.error("Error updating brand:", error);
    }
}

// Archive brand by ID
async function toggleBrandStatusById(id) {
    try {
        // Find a brand by ID and update the `is_active` status
        const currentBrand = await Brand.findById(id);
        const isActive = currentBrand.is_active;

        const updatedBrand = await Brand.findByIdAndUpdate(id, { is_active: !isActive }, { new: true });

        const status = isActive ? "activated" : "archived";
        console.log(`Brand ${status}:`, updatedBrand);
        return updatedBrand;
    } catch (error) {
        console.error("Error updating brand status:", error);
        throw error;  // Re-throw the error to handle it at a higher level if needed
    }
}



// Delete brand by ID
async function deleteBrandById(id) {
    try {
      // Search for a brand by ID
      const brand = await Brand.findById(id);
      if (!brand) {
        console.log("Brand not found");
        return null;
      }

      const deletedBrand = await Brand.deleteOne({ _id : id });
      console.log("Brand deleted:", deletedBrand);
      return deletedBrand;
    }
    catch (error) {
      console.error("Error deleting brand:", error);
    }
}

brandSchema.statics.createBrand = createBrand;
brandSchema.statics.getBrands = getBrands;
brandSchema.statics.getBrandById = getBrandById;
brandSchema.statics.updateBrand = updateBrand;
brandSchema.statics.deleteBrandById = deleteBrandById;
brandSchema.statics.toggleBrandStatusById = toggleBrandStatusById;


const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;