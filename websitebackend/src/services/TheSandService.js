const TheSand = require('../models/TheSand');

exports.GetAllShop = async () => {
    const shops = await TheSand.find({});
    return shops;
};

exports.AddShop = async (shop) => {
    const newShop = await TheSand.create(shop);
    return newShop.save();
};

exports.UpdateShop = async (id, shopData) => {
    const updatedShop = await TheSand.findByIdAndUpdate(id, shopData, { new: true });
    return updatedShop;
};

exports.DeleteShop = async (shopID) => {
    return TheSand.findByIdAndDelete(shopID);
}