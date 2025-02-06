import { DataTypes, Model } from "sequelize";
import { sqlz } from "../sqlz.js";

export default class Cardio extends Model {}

Cardio.init({
    cardioid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userid: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    movement: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    cardiotime: {
        type: DataTypes.FLOAT
        // change in db
    },
    date: {
        type: DataTypes.STRING(24)
    },
    time: {
        type: DataTypes.STRING(16)
    },
    note: {
        type: DataTypes.STRING(256)
    },
    distance: {
        type: DataTypes.STRING(4)
    }
},
{
    sequelize: sqlz,
    tableName: "cardio",
    timestamps: false,
    createdAt: false,
    updatedAt: false
})