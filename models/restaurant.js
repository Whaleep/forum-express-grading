'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // 增加 restaurant.Category 關聯方法
      Restaurant.belongsTo(models.Category)
      Restaurant.hasMany(models.Comment)
      // 設定 restaurants.FavoritedUsers 方法，可以直接從 restaurant 實例取到收藏該餐廳的所有使用者
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'RestaurantId',
        as: 'FavoritedUsers'
      })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};