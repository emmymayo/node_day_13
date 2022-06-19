module.exports = (sequelize, DataTypes)=>{
    const order = sequelize.define("orders",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        product_id: DataTypes.INTEGER,
        total:      DataTypes.FLOAT(12,2),
        stripe_id:  DataTypes.STRING,
        payment_method: DataTypes.STRING,
        status:     DataTypes.ENUM("paid","failed")
    },{
        tableName:          "orders",
        freezeTableName:    true,
        timestamps:         true
    },{
        underscoredAll: false,
        underscored:    false
    });

    return order;
}