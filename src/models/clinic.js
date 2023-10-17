'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Clinic.hasOne(models.Doctor_Info, { foreignKey: 'clinicId' });
        }
    }
    Clinic.init(
        {
            address: DataTypes.STRING,
            descriptionMarkdown: DataTypes.TEXT,
            descriptionHTML: DataTypes.TEXT,
            image: DataTypes.TEXT,
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Clinic',
            freezeTableName: true,
        },
    );
    return Clinic;
};
