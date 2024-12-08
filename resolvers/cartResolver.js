const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { PERMISSIONS } = require("../lib/accessControl");
const { ForbiddenError } = require("apollo-server-express");
const { authenticateAndAuthorize } = require("../lib/auth");

const cartResolver = {
  Query: {
    cart: async (_, {}, context) => {
      const user = context.user;
    
      // Check for user authentication and permissions
      await authenticateAndAuthorize(user, PERMISSIONS.READ, "cart");
    
      try {
        // Get the user_id from context.user
        const user_id = user.db_id;
    
        // Find the cart for the given user
        const cart = await Cart.findOne({ user_id , is_active: true });
        // If no cart is found, return null
        if (!cart) {
          console.log("Cart not found for user:", user_id);
          return {
            status: false,
            message: "No active cart found",
          }
        }
    
        return {
          status: true,
          data: cart,
          message: "Cart retrieved successfully",
        }
      } catch (err) {
        console.error("Error retrieving cart:", err);
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
        let cart = await Cart.findOne({ user_id, is_active: true });
    
        // Ensure all products exist
        const productDetails = await Product.find({
          _id: { $in: products.map((p) => p.product_id) },
        });
    
        // Create a lookup for the product details
        const productLookup = productDetails.reduce((acc, product) => {
          acc[product._id.toString()] = product;
          return acc;
        }, {});
    
        // Check if any product doesn't exist
        const invalidProduct = products.find((p) => !productLookup[p.product_id]);
        if (invalidProduct) {
          return { status: false, message: "One or more products not found" };
        }
    
        // Initialize the cart if not found
        if (!cart) {
          cart = new Cart({
            user_id,
            products: [],
            sub_total: 0,
            tax: 0,
            total_price: 0,
          });
        }
    
        // Process products and calculate totals
        products.forEach(({ product_id, quantity }) => {
          const product = productLookup[product_id];
          const existingProductIndex = cart.products.findIndex(
            (p) => p.product_id.toString() === product_id
          );
    
          if (existingProductIndex > -1) {
            // Update quantity if product exists
            cart.products[existingProductIndex].quantity += quantity;
          } else {
            // Add new product to the cart
            cart.products.push({ product_id, quantity, price: product.price });
          }
        });
        
        console.log("track 1");
        // Recalculate sub_total, tax, and total_price
        console.log("cart.products", cart.products);
        cart.sub_total = cart.products.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );

        console.log("track 2");
        cart.tax = cart.sub_total * 0.13; // 13% tax
        cart.total_price = cart.sub_total + cart.tax;
    
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
    reduceCartItemQuantity: async (_, { user_id, product_id, quantity }, context) => {
      const user = context.user;
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "cart");
    
      try {
        // Find the user's active cart
        const cart = await Cart.findOne({ user_id, is_active: true });
        if (!cart) {
          return { status: false, message: "Cart not found" };
        }
    
        // Find the product in the cart
        const itemIndex = cart.products.findIndex(
          (p) => p.product_id.toString() === product_id
        );
        if (itemIndex === -1) {
          return { status: false, message: "Product not found in cart" };
        }
    
        // Find the product details to adjust the price
        const product = await Product.findById(product_id);
        if (!product) {
          return { status: false, message: "Product not found" };
        }
    
        // Check if reducing quantity is possible (can't reduce below 1)
        if (cart.products[itemIndex].quantity <= quantity) {
          return { status: false, message: "Cannot reduce quantity below 1" };
        }
    
        // Reduce the quantity of the product in the cart
        cart.products[itemIndex].quantity -= quantity;
    
        // Recalculate the subtotal
        cart.sub_total = cart.products.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
    
        // Recalculate tax (13% of subtotal)
        cart.tax = cart.sub_total * 0.13;
    
        // Recalculate total price
        cart.total_price = cart.sub_total + cart.tax;
    
        // Save the updated cart
        await cart.save();
    
        return {
          status: true,
          data: cart,
          message: `Cart item quantity reduced by ${quantity}`,
        };
      } catch (err) {
        throw new Error("Failed to reduce cart item quantity: " + err.message);
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
        // Find the active cart for the user
        const cart = await Cart.findOne({ user_id, is_active: true });
        if (!cart) {
          return { status: false, message: "Cart not found" };
        }
    
        // Locate the product in the cart
        const itemIndex = cart.products.findIndex(
          (p) => p.product_id.toString() === product_id
        );
        if (itemIndex === -1) {
          return { status: false, message: "Product not found in cart" };
        }
    
        // Remove the product from the cart
        const removedItem = cart.products[itemIndex];
        cart.products.splice(itemIndex, 1);
    
        // Recalculate the subtotal
        cart.sub_total = cart.products.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
    
        // Recalculate tax (13% of subtotal)
        cart.tax = cart.sub_total * 0.13;
    
        // Recalculate total
        cart.total_price = cart.sub_total + cart.tax;
    
        // Save the updated cart
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
    closeCart: async (_, { user_id }, context) => {
      const user = context.user;

      // Authorize the user
      await authenticateAndAuthorize(user, PERMISSIONS.WRITE, "cart");

      try {
        // Find the cart for the user
        const cart = await Cart.findOne({ user_id });

        if (!cart) {
          return {
            status: false,
            message: "Cart not found",
          };
        }

        // Update the cart's `is_active` field to false
        cart.is_active = false;
        await cart.save();

        return {
          status: true,
          data: cart,
          message: "Cart closed successfully",
        };
      } catch (err) {
        throw new Error("Failed to close cart: " + err.message);
      }
    },
  },
};

module.exports = { cartResolver };