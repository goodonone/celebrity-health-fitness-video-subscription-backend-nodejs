'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      paymentId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tier: {
        type: Sequelize.STRING,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentType: {
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
    await queryInterface.dropTable('payments');
  }
};
