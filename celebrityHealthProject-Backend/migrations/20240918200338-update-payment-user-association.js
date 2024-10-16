// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // First, remove the existing foreign key constraint
//     await queryInterface.removeConstraint('payments', 'payments_user_association');

//     // Then, modify the column to allow NULL
//     await queryInterface.changeColumn('payments', 'userId', {
//       type: Sequelize.STRING,
//       allowNull: true
//     });

//     // Finally, add the new foreign key constraint
//     await queryInterface.addConstraint('payments', {
//       fields: ['userId'],
//       type: 'foreign key',
//       name: 'payments_user_association',
//       references: {
//         table: 'users',
//         field: 'userId'
//       },
//       onDelete: 'SET NULL',
//       onUpdate: 'CASCADE'
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     // Remove the new foreign key constraint
//     await queryInterface.removeConstraint('payments', 'payments_user_association');

//     // Change the column back to NOT NULL
//     await queryInterface.changeColumn('payments', 'userId', {
//       type: Sequelize.STRING,
//       allowNull: false
//     });

//     // Add back the original foreign key constraint
//     await queryInterface.addConstraint('payments', {
//       fields: ['userId'],
//       type: 'foreign key',
//       name: 'payments_user_association',
//       references: {
//         table: 'users',
//         field: 'userId'
//       },
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE'
//     });
//   }
// };

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ... (keep the existing 'up' function as it is)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Check if the constraint exists before trying to remove it
      const constraintExists = await queryInterface.sequelize.query(
        "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'payments' AND CONSTRAINT_NAME = 'payments_user_association'",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (constraintExists.length > 0) {
        // Remove the constraint only if it exists
        await queryInterface.removeConstraint('payments', 'payments_user_association', { transaction });
      }

      // Change the column back to NOT NULL
      await queryInterface.changeColumn('payments', 'userId', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction });

      // Add back the original foreign key constraint, if needed
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
      }, { transaction });
    });
  }
};