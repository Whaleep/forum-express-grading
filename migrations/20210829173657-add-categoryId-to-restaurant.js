'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add altering commands here.
    await queryInterface.addColumn('Restaurants', 'CategoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Add reverting commands here.
    await queryInterface.removeColumn('Restaurants', 'CategoryId')
  }
};
