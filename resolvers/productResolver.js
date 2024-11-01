const Product = require('../models/productModel')
const { authenticateAndAuthorize } = require('../lib/auth'); // Import your auth utility
const { PERMISSIONS } = require('../lib/accessControl'); 
const { ForbiddenError } = require('apollo-server-express');

const productResolver = {
  Query: {
    products: async (_, { category_id, sub_category_id, brand_id, sku, is_active, price, stock, color, search }, context) => {
      try {
        const user = context.user;
        await authenticateAndAuthorize(user, PERMISSIONS.READ, 'product');
        const query = {
          ...(category_id && { category_id }),
          ...(sub_category_id && { sub_category_id }),
          ...(brand_id && { brand_id }),
          ...(sku && { sku }),
          ...(![null, undefined].includes(is_active) && { is_active }),
          ...(price && { price: { $lte: price } }),
          ...(stock && { stock: { $lte: stock } }),
          ...(color && { color }),
          ...(search && {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ],
          }),
        }
        console.log('query', query)
        const products = await Product.find({ ...query})
      
        return products
      } catch (err) {
        throw new Error(err)
      }
    },
    product: async (_, { id }) => {
      try {
        return await Product.findById(id)
      } catch (err) {
        throw new Error(err)
      }
    },
    productCount: async () => {
      try {
        const count = await Product.countDocuments()
        return count
      } catch (err) {
        throw new Error(err)
      }
    },
  },
  Mutation: {
    addProduct: async (_, { newProduct }) => {
      const newProd = new Product(newProduct)
      try {
        const product = await newProd.save()
        return {
          status: true,
          data: product,
          message: 'Product created successfully',
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    updateProduct: async (_, { id, productData }) => {
      try {
        const product = await Product.findByIdAndUpdate(id, productData, {
          new: true,
        })
        if (!product) {
          return { status: false, data: null, message: 'Product not found' }
        }
        return {
          status: true,
          data: product,
          message: 'Product updated successfully',
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    toggleProductStatusById: async (_, { id }) => {
      try {
        const product = await Product.findById(id)
        if (!product) {
          return { status: false, data: null, message: 'Product not found' }
        }

        product.is_active = !product.is_active
        await product.save()

        return {
          status: true,
          data: product,
          message: 'Product status toggled successfully',
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    deleteProduct: async (_, { id }) => {
      try {
        await Product.findByIdAndDelete(id)
        return { status: true, message: 'Product deleted successfully' }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}

module.exports = { productResolver }
