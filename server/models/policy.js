'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Policy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Policy.hasMany(models.UserPolicy, {
        foreignKey: 'policy',
      });
    }
  };
  Policy.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payout_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    starting_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    policy_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'Policy',
  });
  return Policy;
};