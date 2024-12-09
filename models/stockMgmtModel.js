const mongoose = require('mongoose')

const stockMgmtSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    warehouse_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Warehouse',
    },
    stock_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'StockLocation',
    },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
)


async function fetchStocks() {
  try {
    const stocks = (await StockMgmt.find().
    populate('product_id').
    populate('warehouse_id').
    populate('stock_location_id'))

    return stocks
  } catch (error) {
    throw new Error(error.message)
  }
}

async function fetchSingleStock(id) {
  try {
    const stock = (await StockMgmt.findById(id).
    populate('product_id').
    populate('warehouse_id').
    populate('stock_location_id'))

    return stock
  }
  catch (error) {
    throw new Error(error.message)
  }
}

async function createStock(stockInput) {
  try {
    console.log(stockInput);
    const newStock = new StockMgmt(stockInput);
    console.log(newStock);

    // Save the document
    const savedStock = await newStock.save();

    // Return the populated document
    const populatedStock = await StockMgmt.fetchSingleStock(savedStock._id);

    return populatedStock;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateStock(id, stockInput) {
  try {
    const stock = await StockMgmt.findByIdAndUpdate(id, stockInput, { new: true });

    // Return the populated document
    const populatedStock = await StockMgmt.fetchSingleStock(stock._id);
    return populatedStock;
  }
  catch (error) {
    throw new Error(error.message);
  }
}


stockMgmtSchema.statics.fetchStocks = fetchStocks
stockMgmtSchema.statics.fetchSingleStock = fetchSingleStock
stockMgmtSchema.statics.createStock = createStock
stockMgmtSchema.statics.updateStock = updateStock

const StockMgmt = mongoose.model('StockMgmt', stockMgmtSchema)
module.exports = StockMgmt
