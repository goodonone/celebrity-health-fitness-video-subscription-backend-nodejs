'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cart_products', {
      cartProductId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      cartId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'carts',
          key: 'cartId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'products',
          key: 'productId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
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
    await queryInterface.dropTable('cart_products');
  }
};
