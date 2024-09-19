'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      productId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      productDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      productUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};
