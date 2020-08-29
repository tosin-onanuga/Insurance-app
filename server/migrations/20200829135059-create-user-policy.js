'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_policies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      policy: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      policy_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      date_paid: {
        type: Sequelize.DATE
      },
      channel: {
        type: Sequelize.STRING
      },
      reference_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_policies');
  }
};