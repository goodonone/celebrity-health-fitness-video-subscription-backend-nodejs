'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('payments', 'paymentType', 'purchaseType');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('payments', 'purchaseType', 'paymentType');
  }
};