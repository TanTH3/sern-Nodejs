'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Specialty.hasOne(models.Doctor_Info, { foreignKey: 'specialtyId' });
        }
    }
    Specialty.init(
        {
            descriptionHTML: DataTypes.TEXT,
            descriptionMarkdown: DataTypes.TEXT,
            image: DataTypes.TEXT,
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Specialty',
            freezeTableName: true,
        },
    );
    return Specialty;
};
