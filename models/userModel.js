const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");
const Habit = require("../models/habitsModel");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    age: {
        type: DataTypes.INTEGER,
    },
    role:{
        type: DataTypes.STRING,
        defaultValue: "user",
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
    },
});

// Hash password before creating user
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

// Relationships
User.hasMany(Habit, { foreignKey: "userId", onDelete: "CASCADE" });
Habit.belongsTo(User, { foreignKey: "userId" });

// Sync
sequelize.sync()
 .then(() => console.log("Tables synced"))
    .catch((err) => console.error("Error syncing tables:", err));

module.exports = User;
