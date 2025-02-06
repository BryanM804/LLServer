import { DataTypes, Model } from "sequelize";
import { sqlz } from "../sqlz";

export default class Record extends Model {

}

Record.init({
    recordid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userid: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    recordtype: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING(24)
    }
},
{
    sequelize: sqlz,
    tableName: "records",
    timestamps: false,
    createdAt: false,
    updatedAt: false
})