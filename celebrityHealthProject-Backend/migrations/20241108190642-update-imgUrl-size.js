'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'imgUrl', {
      type: Sequelize.STRING(2048),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'imgUrl', {
      type: Sequelize.STRING(255), // or the previous size
      allowNull: true,
    });
  },
};