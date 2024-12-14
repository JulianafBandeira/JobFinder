import Sequelize from "sequelize";
import path from "path"; // Para garantir o caminho correto do banco de dados

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve("db", "app.db"), // Caminho relativo para o banco de dados
});

export default sequelize; 
