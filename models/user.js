'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Comment)
      // 設定 user.FavoritedRestaurants 方法，可以直接從 user 實例取到使用者收藏的所有餐廳
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'UserId',
        as: 'FavoritedRestaurants'
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedRestaurants'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};