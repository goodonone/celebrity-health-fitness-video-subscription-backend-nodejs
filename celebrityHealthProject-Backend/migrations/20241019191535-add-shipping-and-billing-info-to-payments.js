'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('payments', 'shippingAddress', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('payments', 'shippingZipcode', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('payments', 'billingAddress', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('payments', 'billingZipcode', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('payments', 'shippingAddress');
    await queryInterface.removeColumn('payments', 'shippingZipcode');
    await queryInterface.removeColumn('payments', 'billingAddress');
    await queryInterface.removeColumn('payments', 'billingZipcode');
  }
};