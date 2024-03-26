import { Sequelize } from 'sequelize';

// konek ke mysql pake sequelize
const sequelize = new Sequelize('sql6694377', 'sql6694377', '6kH1SQLeaS', {
  host: 'sql6.freemysqlhosting.net',
  port: 3306,
  dialect: 'mysql'
});

export default sequelize;