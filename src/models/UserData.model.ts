const databaseName = 'Daniel-KI';
const userTableName = 'Users';
const recordsTableName = 'Records';
type UserModel = {
  avatar: string | ArrayBuffer;
  name: string;
  surname: string;
  email: string;
};
type ScoreModel = {
  points: number;
};

export { UserModel, ScoreModel, databaseName, userTableName, recordsTableName };
