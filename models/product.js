module.exports = (sequelize, DataTypes)=>{
    const product = sequelize.define("products", {
        id:{
            type:   DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title:          DataTypes.STRING,
        description:    DataTypes.TEXT,
        image:    DataTypes.TEXT,
        price:    DataTypes.FLOAT(12,2)
    }, 
    {
        timestamps: true,
        freezeTableName: true,
        tableName: "products",
    },
    {
        underscoredAll: false,
        underscored: false,
    });

    return product
}