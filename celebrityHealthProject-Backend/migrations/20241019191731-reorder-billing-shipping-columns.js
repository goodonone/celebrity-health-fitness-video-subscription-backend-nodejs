'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Remove existing columns
    await queryInterface.removeColumn('payments', 'shippingAddress');
    await queryInterface.removeColumn('payments', 'shippingZipcode');
    await queryInterface.removeColumn('payments', 'billingAddress');
    await queryInterface.removeColumn('payments', 'billingZipcode');

    // Step 2: Add columns back in the desired order
    await queryInterface.addColumn('payments', 'billingAddress', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'paymentFrequency' // Adjust this if needed to place it after a specific column
    });
    await queryInterface.addColumn('payments', 'billingZipcode', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'billingAddress'
    });
    await queryInterface.addColumn('payments', 'shippingAddress', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'billingZipcode'
    });
    await queryInterface.addColumn('payments', 'shippingZipcode', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'shippingAddress'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If needed, reverse the order here
    await queryInterface.removeColumn('payments', 'shippingZipcode');
    await queryInterface.removeColumn('payments', 'shippingAddress');
    await queryInterface.removeColumn('payments', 'billingZipcode');
    await queryInterface.removeColumn('payments', 'billingAddress');

    await queryInterface.addColumn('payments', 'shippingAddress', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('payments', 'shippingZipcode', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('payments', 'billingAddress', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('payments', 'billingZipcode', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};