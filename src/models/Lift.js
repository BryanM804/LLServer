import { DataTypes, Model, Sequelize } from "sequelize";
import { sqlz } from "../sqlz.js";

export default class Lift extends Model {
    setSetTotal(bodyweight) {
        if (bodyweight && this.movement.startsWith("Assissted")) {
            this.settotal = reps * (weight - bodyweight);
        } else if (bodyweight) {
            this.settotal = reps * (weight + bodyweight);
        } else {
            this.settotal = reps * weight;
        }
    }
}

Lift.init({
    setid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    movement: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    weight: {
        type: DataTypes.FLOAT
        // Needs to be changed in db
    },
    reps: {
        type: DataTypes.INTEGER
    },
    date: {
        type: DataTypes.STRING(24)
    },
    time: {
        type: DataTypes.STRING(16)
    },
    settotal: {
        type: DataTypes.FLOAT
        // Needs to be changed in db
    }
},
{
    sequelize: sqlz,
    tableName: "lifts",
    timestamps: false,
    createdAt: false,
    updatedAt: false
})