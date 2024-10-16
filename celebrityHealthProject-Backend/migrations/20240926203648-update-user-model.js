'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const columns = await queryInterface.describeTable('users');
      
      // Remove isGoogleAuth column if it exists
      if (columns.isGoogleAuth) {
        await queryInterface.removeColumn('users', 'isGoogleAuth', { transaction });
      }

      // Modify password column to allow null
      await queryInterface.changeColumn('users', 'password', {
        type: Sequelize.STRING,
        allowNull: true
      }, { transaction });

      // Add dateOfBirth column if it doesn't exist
      if (!columns.dateOfBirth) {
        await queryInterface.addColumn('users', 'dateOfBirth', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '01/01/1990'
        }, { transaction });
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const columns = await queryInterface.describeTable('users');
      
      // Add isGoogleAuth column back
      if (!columns.isGoogleAuth) {
        await queryInterface.addColumn('users', 'isGoogleAuth', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }, { transaction });
      }

      // Update any NULL passwords to an empty string before changing the column
      await queryInterface.sequelize.query(
        'UPDATE users SET password = \'\' WHERE password IS NULL',
        { transaction }
      );

      // Revert password column to not allow null
      await queryInterface.changeColumn('users', 'password', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction });

      // Remove dateOfBirth column if it exists
      if (columns.dateOfBirth) {
        await queryInterface.removeColumn('users', 'dateOfBirth', { transaction });
      }
    });
  }
};