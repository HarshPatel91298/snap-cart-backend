const Product = require("../models/productModel");
const { PERMISSIONS } = require("../lib/accessControl");
const { ForbiddenError } = require("apollo-server-express");
const { authenticateAndAuthorize } = require("../lib/auth");

const productResolver = {
  Query: {
    products: async (_, __, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "product");

      try {
        const products = await Product.find();
        return products;
      } catch (err) {
        throw new Error("Failed to retrieve products: " + err.message);
      }
    },
    product: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "product");

      try {
        const product = await Product.findById(id);
        if (!product) {
          throw new ForbiddenError("Product not found");
        }
        return product;
      } catch (err) {
        throw new Error("Failed to retrieve product: " + err.message);
      }
    },
    productCount: async (_, __, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "product");

      try {
        const count = await Product.countDocuments();
        return count;
      } catch (err) {
        throw new Error("Failed to retrieve product count: " + err.message);
      }
    },
  },
  Mutation: {
    addProduct: async (_, { newProduct }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "product");

      const newProd = new Product(newProduct);
      try {
        const product = await newProd.save();
        return {
          status: true,
          data: product,
          message: "Product created successfully",
        };
      } catch (err) {
        throw new Error("Failed to create product: " + err.message);
      }
    },
    updateProduct: async (_, { id, productData }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "product");

      try {
        const product = await Product.findByIdAndUpdate(id, productData, {
          new: true,
        });
        if (!product) {
          return { status: false, data: null, message: "Product not found" };
        }
        return {
          status: true,
          data: product,
          message: "Product updated successfully",
        };
      } catch (err) {
        throw new Error("Failed to update product: " + err.message);
      }
    },
    toggleProductStatusById: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.DELETE, "product");

      try {
        const product = await Product.findById(id);
        if (!product) {
          return { status: false, data: null, message: "Product not found" };
        }

        product.is_active = !product.is_active;
        await product.save();

        return {
          status: true,
          data: product,
          message: "Product status toggled successfully",
        };
      } catch (error) {
        throw new Error("Failed to toggle product status: " + error.message);
      }
    },
    deleteProduct: async (_, { id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.DELETE, "product");

      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return { status: false, message: "Product not found" };
        }
        return { status: true, message: "Product deleted successfully" };
      } catch (err) {
        throw new Error("Failed to delete product: " + err.message);
      }
    },
  },
};

module.exports = { productResolver };
