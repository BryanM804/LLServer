import { DataTypes, Model } from "sequelize";
import { sqlz } from "../sqlz";

export default class Exercise extends Model {

}

Exercise.init({
    exerciseid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    movement: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    mgroup: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    isbodyweight: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    splittable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},
{
    sequelize: sqlz,
    tableName: "exercises",
    timestamps: false,
    createdAt: false,
    updatedAt: false
})