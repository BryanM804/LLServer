import { DataTypes, Model } from "sequelize";
import { sqlz } from "../sqlz.js";


export default class Account extends Model {
    addXp(newXp) {
        this.xp += newXp;
        while (this.xp > this.level * 1500) {
            this.xp -= (this.level * 1500);
            this.level++;
        }
    }

    removeXp(rXp) {
        this.xp -= rXp;
        while (this.xp < 0) {
            this.level--;
            this.xp += (this.level * 1500);
        }
    }
}

Account.init({
    id: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(48),
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    creationdate: {
        type: DataTypes.STRING(24)
    },
    totalweight: {
        type: DataTypes.FLOAT
        // Change in db
    },
    totalsets: {
        type: DataTypes.INTEGER
    },
    username: {
        type: DataTypes.STRING(64)
        // not in db yet
    },
    password: {
        type: DataTypes.STRING(255)
        // not in db
    },
    splitsmovements: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
        // Not in db
    }
},
{
    sequelize: sqlz,
    tableName: "accounts",
    timestamps: false,
    createdAt: false,
    updatedAt: false
})