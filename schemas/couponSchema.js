const { gql } = require("apollo-server-express");

const couponSchema = gql`
type Coupon {
  id: ID!
  code: String!
  description: String
  type: CouponType!
  discount: Float!
  max_discount: Float
  min_order_amount: Float
  valid_from: String
  valid_until: String
  applicable_products: [Product]
  applicable_categories: [Category]
  applicable_subcategories: [SubCategory]
  usage_limit: Int
  max_use_per_user: Int
  used_count: Int
  active: Boolean!
  applicable_global: Boolean!  # New boolean field
  is_valid: String!  # New computed field: Active, Expiry in X days, Expired
  user_usage: [UserCouponUsage]
}

type UserCouponUsage {
  userId: ID!
  usage_count: Int!
}

enum CouponType {
  FIXED
  PERCENTAGE
}

input CreateCouponInput {
  code: String!
  description: String
  type: CouponType!
  discount: Float!
  max_discount: Float
  min_order_amount: Float
  valid_from: String
  valid_until: String
  applicable_products: [ID]
  applicable_categories: [ID]
  applicable_subcategories: [ID]
  usage_limit: Int
  max_use_per_user: Int
  active: Boolean!
  applicable_global: Boolean!
}

input UpdateCouponInput {
  description: String
  type: CouponType
  discount: Float
  max_discount: Float
  min_order_amount: Float
  valid_from: String
  valid_until: String
  applicable_products: [ID]
  applicable_categories: [ID]
  applicable_subcategories: [ID]
  usage_limit: Int
  max_use_per_user: Int
  active: Boolean
  applicable_global: Boolean
}

type Mutation {
  createCoupon(input: CreateCouponInput!): Coupon!
  updateCoupon(id: ID!, input: UpdateCouponInput!): Coupon!
  applyCoupon(userId: ID!, couponCode: String!, cartTotal: Float!, cartItems: [CartItemInput]!): CouponApplyResponse!
}

type Query {
  coupons: [Coupon]
  couponById(id: ID!): Coupon
  couponByCode(code: String!): Coupon
}

input CartItemInput {
  productId: ID
  categoryId: ID
  subcategoryId: ID
}

type CouponApplyResponse {
  success: Boolean!
  discount: Float
  message: String
}
`;

module.exports = { couponSchema };
