'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Check if isGoogleAuth column exists before adding
      const columns = await queryInterface.describeTable('users');
      if (!columns.isGoogleAuth) {
        await queryInterface.addColumn('users', 'isGoogleAuth', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }, { transaction });
      }

      // Modify password column to allow null
      await queryInterface.changeColumn('users', 'password', {
        type: Sequelize.STRING,
        allowNull: true
      }, { transaction });

      // Check if dateOfBirth column exists before adding
      if (!columns.dateOfBirth) {
        await queryInterface.addColumn('users', 'dateOfBirth', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '1900-01-01'
        }, { transaction });
      }

      // Add any other new columns or modify existing ones as needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Check if isGoogleAuth column exists before removing
      const columns = await queryInterface.describeTable('users');
      if (columns.isGoogleAuth) {
        await queryInterface.removeColumn('users', 'isGoogleAuth', { transaction });
      }

      // Revert password column to not allow null
      await queryInterface.changeColumn('users', 'password', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction });

      // Check if dateOfBirth column exists before removing
      if (columns.dateOfBirth) {
        await queryInterface.removeColumn('users', 'dateOfBirth', { transaction });
      }

      // Revert any other changes made in the 'up' function
    });
  }
};