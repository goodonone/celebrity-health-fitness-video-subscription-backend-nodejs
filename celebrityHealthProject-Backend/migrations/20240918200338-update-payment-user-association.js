'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, remove the existing foreign key constraint
    await queryInterface.removeConstraint('payments', 'payments_user_association');

    // Then, modify the column to allow NULL
    await queryInterface.changeColumn('payments', 'userId', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Finally, add the new foreign key constraint
    await queryInterface.addConstraint('payments', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'payments_user_association',
      references: {
        table: 'users',
        field: 'userId'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new foreign key constraint
    await queryInterface.removeConstraint('payments', 'payments_user_association');

    // Change the column back to NOT NULL
    await queryInterface.changeColumn('payments', 'userId', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Add back the original foreign key constraint
    await queryInterface.addConstraint('payments', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'payments_user_association',
      references: {
        table: 'users',
        field: 'userId'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
};