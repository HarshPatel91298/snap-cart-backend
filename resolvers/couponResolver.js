const Coupon = require('../models/couponModel');
const User = require('../models/userModel'); // Assuming you have a User model for tracking coupon usage
const mongoose = require('mongoose');

const couponResolver = {
  Query: {
    async couponByCode(_, { code }) {
      try {
        const coupon = await Coupon.findOne({ code }).populate([
          'applicable_products',
          'applicable_categories',
          'applicable_subcategories'
        ]);
        if (!coupon) throw new Error('Coupon not found');
        return coupon;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async coupons() {
      try {
        const coupons = await Coupon.find().populate([
          'applicable_products',
          'applicable_categories',
          'applicable_subcategories'
        ]);
        return coupons;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async couponById(_, { id }) {
      try {
        const coupon = await Coupon.findById(id).populate([
          'applicable_products',
          'applicable_categories',
          'applicable_subcategories'
        ]);
        if (!coupon) throw new Error('Coupon not found');
        return coupon;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    async createCoupon(_, { input }) {
      try {
        console.log("Input:", input);
    
        // Check if coupon already exists
        const existingCoupon = await Coupon.findOne({ code: input.code });
        if (existingCoupon) throw new Error("Coupon code already exists");
    
        const applicableProducts = (input.applicable_products || []).map((id) => {
          if (typeof id !== "string") {
            throw new Error(`Invalid ID in applicable_products: Expected string, got ${typeof id}`);
          }
          return new mongoose.Types.ObjectId(id);
        });
    
        const applicableCategories = (input.applicable_categories || []).map((id) => {
          if (typeof id !== "string") {
            throw new Error(`Invalid ID in applicable_categories: Expected string, got ${typeof id}`);
          }
          return new mongoose.Types.ObjectId(id);
        });
    
        const applicableSubcategories = (input.applicable_subcategories || []).map((id) => {
          if (typeof id !== "string") {
            throw new Error(`Invalid ID in applicable_subcategories: Expected string, got ${typeof id}`);
          }
          return new mongoose.Types.ObjectId(id);
        });
    
        console.log("Applicable Products:", applicableProducts);
        console.log("Applicable Categories:", applicableCategories);
        console.log("Applicable Subcategories:", applicableSubcategories);
    
        // Create new coupon
        const newCoupon = await Coupon.create({
          ...input,
          valid_from: new Date(input.valid_from),
          valid_until: new Date(input.valid_until),
          applicable_products: applicableProducts,
          applicable_categories: applicableCategories,
          applicable_subcategories: applicableSubcategories,
        });
    
        // Populate the fields
        const populatedCoupon = await newCoupon.populate([
          { path: 'applicable_products', model: 'Product' },
          { path: 'applicable_categories', model: 'Category' },
          { path: 'applicable_subcategories', model: 'SubCategory' },
        ]);
    
        console.log("Populated Coupon:", populatedCoupon);

        const response = {
          ...populatedCoupon.toObject(),
          id: populatedCoupon._id.toString(),
          applicable_products: populatedCoupon.applicable_products.map((p) => ({
            id: p._id.toString(),
            ...p.toObject(),
          })),
          applicable_categories: populatedCoupon.applicable_categories.map((c) => ({
            id: c._id.toString(),
            ...c.toObject(),
          })),
          applicable_subcategories: populatedCoupon.applicable_subcategories.map((s) => ({
            id: s._id.toString(),
            ...s.toObject(),
          })),
        };
    
        // Return the populated coupon
        return response;
      } catch (error) {
        console.error("Error creating coupon:", error);
        throw new Error(error.message);
      }
    },
    async updateCoupon(_, { id, input }) {
      try {
        console.log("Updating Coupon ID:", id);
        console.log("Update Input:", input);
    
        // Validate input IDs for products, categories, and subcategories
        const applicableProducts = (input.applicable_products || []).map((id) => {
          if (typeof id !== "string") {
            throw new Error(`Invalid ID in applicable_products: Expected string, got ${typeof id}`);
          }
          return new mongoose.Types.ObjectId(id);
        });
    
        const applicableCategories = (input.applicable_categories || []).map((id) => {
          if (typeof id !== "string") {
            throw new Error(`Invalid ID in applicable_categories: Expected string, got ${typeof id}`);
          }
          return new mongoose.Types.ObjectId(id);
        });
    
        const applicableSubcategories = (input.applicable_subcategories || []).map((id) => {
          if (typeof id !== "string") {
            throw new Error(`Invalid ID in applicable_subcategories: Expected string, got ${typeof id}`);
          }
          return new mongoose.Types.ObjectId(id);
        });
    
        console.log("Applicable Products:", applicableProducts);
        console.log("Applicable Categories:", applicableCategories);
        console.log("Applicable Subcategories:", applicableSubcategories);
    
        // Convert date fields to Date objects if provided
        const updateData = {
          ...input,
          valid_from: input.valid_from ? new Date(input.valid_from) : undefined,
          valid_until: input.valid_until ? new Date(input.valid_until) : undefined,
          applicable_products: applicableProducts.length ? applicableProducts : undefined,
          applicable_categories: applicableCategories.length ? applicableCategories : undefined,
          applicable_subcategories: applicableSubcategories.length ? applicableSubcategories : undefined,
        };
    
        // Remove undefined fields to avoid overwriting
        Object.keys(updateData).forEach((key) => {
          if (updateData[key] === undefined) {
            delete updateData[key];
          }
        });
    
        // Find and update the coupon
        const updatedCoupon = await Coupon.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true } // Return the updated document
        );
    
        if (!updatedCoupon) {
          throw new Error("Coupon not found or update failed");
        }
    
        // Populate the fields
        const populatedCoupon = await updatedCoupon.populate([
          { path: "applicable_products", model: "Product" },
          { path: "applicable_categories", model: "Category" },
          { path: "applicable_subcategories", model: "SubCategory" },
        ]);
    
        console.log("Populated Updated Coupon:", populatedCoupon);
    
        // Prepare the response
        const response = {
          ...populatedCoupon.toObject(),
          id: populatedCoupon._id.toString(),
          applicable_products: populatedCoupon.applicable_products.map((p) => ({
            id: p._id.toString(),
            ...p.toObject(),
          })),
          applicable_categories: populatedCoupon.applicable_categories.map((c) => ({
            id: c._id.toString(),
            ...c.toObject(),
          })),
          applicable_subcategories: populatedCoupon.applicable_subcategories.map((s) => ({
            id: s._id.toString(),
            ...s.toObject(),
          })),
        };
    
        return response;
      } catch (error) {
        console.error("Error updating coupon:", error);
        throw new Error(error.message);
      }
    },
    async applyCoupon(_, { userId, couponCode, cartTotal, cartItems }) {
      try {
        // Fetch the coupon by code
        const coupon = await Coupon.findOne({ code: couponCode }).populate([
          'applicable_products',
          'applicable_categories',
          'applicable_subcategories'
        ]);
        
        if (!coupon) throw new Error('Coupon not found');
        
        // Check if the coupon is still valid
        const now = new Date();
        if (!coupon.active || now < coupon.valid_from || now > coupon.valid_until) {
          throw new Error('Coupon is no longer valid');
        }

        // Check if the user has used the coupon more than the allowed limit
        const userUsage = coupon.user_usage.find(usage => usage.userId.toString() === userId.toString());
        if (userUsage && userUsage.usage_count >=  coupon.max_use_per_user) {
          throw new Error('You have already used this coupon the maximum number of times');
        }

        // Check if the coupon applies to the cart items (either by product, category, or subcategory)
        const isApplicableToCart = cartItems.some(item => {
          return (
            coupon.applicable_products.includes(item.productId) ||
            coupon.applicable_categories.includes(item.categoryId) ||
            coupon.applicable_subcategories.includes(item.subcategoryId)
          );
        });

        if (!isApplicableToCart) {
          throw new Error('This coupon cannot be applied to the items in your cart');
        }

        // Apply discount based on coupon type
        let discount = 0;
        if (cartTotal < coupon.min_order_amount) {
          throw new Error('Your order does not meet the minimum order amount for this coupon');
        }

        if (coupon.type === 'PERCENTAGE') {
          discount = (cartTotal * coupon.discount) / 100;
        } else if (coupon.type === 'FIXED') {
          discount = coupon.discount;
        }

        // Ensure the discount does not exceed the max discount
        if (coupon.max_discount && discount > coupon.max_discount) {
          discount = coupon.max_discount;
        }

        // Update the coupon's usage count for the user
        if (userUsage) {
          userUsage.usage_count += 1;
        } else {
          coupon.user_usage.push({ userId, usage_count: 1 });
        }

        // Save the coupon with the updated usage
        await coupon.save();

        // Return the applied discount
        return { success: true, discount };

      } catch (error) {
        return { success: false, message: error.message };
      }
    },
  },

 
};

module.exports = {couponResolver};
