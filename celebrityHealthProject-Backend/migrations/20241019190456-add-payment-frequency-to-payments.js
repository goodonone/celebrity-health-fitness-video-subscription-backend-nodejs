'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('payments', 'paymentFrequency', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'paymentType' // This will add the new column after the paymentType column
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('payments', 'paymentFrequency');
  }
};