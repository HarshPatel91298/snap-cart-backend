const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { PERMISSIONS } = require("../lib/accessControl");
const { ForbiddenError } = require("apollo-server-express");
const { authenticateAndAuthorize } = require("../lib/auth");

const cartResolver = {
  Query: {
    cart: async (_, { user_id }, context) => {
      const user = context.user;
      console.log("User ID %%:", user);
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "cart");

      try {
        // Find the cart without populating product_id directly
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
          throw new ForbiddenError("Cart not found");
        }
        return cart;
      } catch (err) {
        throw new Error("Failed to retrieve cart: " + err.message);
      }
    },
  },
  CartItem: {
    product: async (parent) => {
      // Fetch product details based on product_id
      return await Product.findById(parent.product_id);
    },
  },
  Mutation: {
    addToCart: async (_, { input }, context) => {
      const { user_id, products } = input;
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "cart");
    
      try {
        let cart = await Cart.findOne({ user_id });
    
        // Ensure all products exist
        const productDetails = await Product.find({
          '_id': { $in: products.map(p => p.product_id) }
        });
        
        // Create a lookup for the product details
        const productLookup = productDetails.reduce((acc, product) => {
          acc[product._id.toString()] = product;
          return acc;
        }, {});
    
        // Check if any product doesn't exist
        const invalidProduct = products.find(p => !productLookup[p.product_id]);
        if (invalidProduct) {
          return { status: false, message: "One or more products not found" };
        }
    
        // Initialize the cart if not found
        if (!cart) {
          cart = new Cart({
            user_id,
            products: [],
            total_price: 0,
          });
        }
    
        // Add products to the cart
        products.forEach(({ product_id, quantity }) => {
          const product = productLookup[product_id];
          const existingProductIndex = cart.products.findIndex(
            (p) => p.product_id.toString() === product_id
          );
          const productTotal = product.price * quantity;
    
          if (existingProductIndex > -1) {
            // Update quantity if product exists
            cart.products[existingProductIndex].quantity += quantity;
            cart.total_price += productTotal;
          } else {
            // Add new product to the cart
            cart.products.push({ product_id, quantity });
            cart.total_price += productTotal;
          }
        });
    
        await cart.save();
        return {
          status: true,
          data: cart,
          message: "Products added to cart successfully",
        };
      } catch (err) {
        throw new Error("Failed to add products to cart: " + err.message);
      }
    },
    updateCartItem: async (_, { input }, context) => {
      const { user_id, product_id, quantity } = input;

      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "cart");

      try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
          return { status: false, message: "Cart not found" };
        }

        const product = await Product.findById(product_id);
        if (!product) {
          return { status: false, message: "Product not found" };
        }

        const item = cart.products.find(
          (p) => p.product_id.toString() === product_id
        );
        if (!item) {
          return { status: false, message: "Product not found in cart" };
        }

        cart.total_price += (quantity - item.quantity) * product.price;
        item.quantity = quantity;

        await cart.save();
        return {
          status: true,
          data: cart,
          message: "Cart item updated successfully",
        };
      } catch (err) {
        throw new Error("Failed to update cart item: " + err.message);
      }
    },
    removeCartItem: async (_, { user_id, product_id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.DELETE, "cart");

      try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
          return { status: false, message: "Cart not found" };
        }

        const itemIndex = cart.products.findIndex(
          (p) => p.product_id.toString() === product_id
        );
        if (itemIndex === -1) {
          return { status: false, message: "Product not found in cart" };
        }

        const product = await Product.findById(product_id);
        if (!product) {
          return { status: false, message: "Product not found" };
        }

        const removedItem = cart.products[itemIndex];
        cart.total_price -= removedItem.quantity * product.price;
        cart.products.splice(itemIndex, 1);

        await cart.save();
        return {
          status: true,
          data: cart,
          message: "Cart item removed successfully",
        };
      } catch (err) {
        throw new Error("Failed to remove cart item: " + err.message);
      }
    },
    clearCart: async (_, { user_id }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.DELETE, "cart");

      try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
          return { status: false, message: "Cart not found" };
        }

        cart.products = [];
        cart.total_price = 0;
        await cart.save();

        return { status: true, message: "Cart cleared successfully" };
      } catch (err) {
        throw new Error("Failed to clear cart: " + err.message);
      }
    },
  },
};

module.exports = { cartResolver };
