const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { PERMISSIONS } = require("../lib/accessControl");
const { ForbiddenError } = require("apollo-server-express");
const { authenticateAndAuthorize } = require("../lib/auth");

const cartResolver = {
  Query: {
    cart: async (_, { user_id }, context) => {
      const user = context.user;
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
      const { user_id, product_id, quantity } = input;
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "cart");

      try {
        let cart = await Cart.findOne({ user_id });

        // Ensure product exists
        const product = await Product.findById(product_id);
        if (!product) {
          return { status: false, message: "Product not found" };
        }

        if (!cart) {
          cart = new Cart({
            user_id,
            products: [{ product_id, quantity }],
            total_price: product.price * quantity,
          });
        } else {
          const existingProductIndex = cart.products.findIndex(
            (p) => p.product_id.toString() === product_id
          );
          if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += quantity;
          } else {
            cart.products.push({ product_id, quantity });
          }
          cart.total_price += product.price * quantity;
        }

        await cart.save();
        return {
          status: true,
          data: cart,
          message: "Product added to cart successfully",
        };
      } catch (err) {
        throw new Error("Failed to add product to cart: " + err.message);
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
