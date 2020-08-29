'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPolicy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserPolicy.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    policy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    policy_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_paid: DataTypes.DATE,
    channel: DataTypes.STRING,
    reference_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserPolicy',
  });
  return UserPolicy;
};