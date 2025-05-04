// models/product.js
import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';  // Ensure sequelize instance is correctly imported

await sequelize.sync({ force: true });

const Product = sequelize.define('Product', { // Capitalized model name
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  article_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  in_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  in_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'products', // ensure lowercase plural
  timestamps: false
});

export default Product;

