
module.exports = function(sequelize, DataTypes) {
    const Character = sequelize.define("Character",{
        level: DataTypes.INTEGER,
        x_position: DataTypes.INTEGER,
        y_position: DataTypes.INTEGER
    });
    Character.associate = function(models) {
        // Associating Author with Posts
        // When an Author is deleted, also delete any associated Posts
        Character.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }        
        });
    };
    return Character;
};
