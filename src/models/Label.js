import { DataTypes, Model } from "sequelize";
import { sqlz } from "../sqlz.js";

export default class Label extends Model {}

Label.init({
    labelid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    label: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    date: {
        type: DataTypes.STRING(24),
        allowNull: false
    }
},
{
    sequelize: sqlz,
    tableName: "labels",
    timestamps: false,
    createdAt: false,
    updatedAt: false
})