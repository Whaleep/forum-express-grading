'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed commands here.
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 50 }).map((d, i) =>
      ({
        text: faker.lorem.sentence(),
        UserId: Math.floor(Math.random() * 3) * 10 + 1,
        RestaurantId: Math.floor(Math.random() * 50) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    // Add commands to revert seed here.
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
