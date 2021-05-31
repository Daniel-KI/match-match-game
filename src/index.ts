import './style.css';
import Database from './utils/Database.util';
import Router from './utils/Router.util';
import { databaseName, userTableName, recordsTableName } from './models/UserData.model';

const router = new Router();
router.listen();

async function createTables() {
  const database = new Database(databaseName);
  await database.createTable(userTableName);
  await database.createTable(recordsTableName);
}
createTables();

localStorage.setItem('level', 'easy');
localStorage.setItem('theme', 'heroes');
