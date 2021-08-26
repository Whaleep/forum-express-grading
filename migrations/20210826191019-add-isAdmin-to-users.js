'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add altering commands here.
    await queryInterface.addColumn('Users', 'isAdmin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Add reverting commands here.
    await queryInterface.removeColumn('Users', 'isAdmin')
  }
};
