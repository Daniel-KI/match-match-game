import { ScoreModel, UserModel } from '../models/UserData.model';

export default class Database {
  private _databaseName: string;

  constructor(databaseName: string) {
    this._databaseName = databaseName;
    if (!window.indexedDB) Error("Your browser doesn't support a stable version of IndexedDB.");
  }

  get databaseName(): string {
    return this._databaseName;
  }

  set databaseName(newDatabaseName: string) {
    this._databaseName = newDatabaseName;
  }

  createTable(tableName: string): Promise<string> {
    return new Promise((resolve) => {
      const databaseName: string = this.databaseName;
      const request: IDBOpenDBRequest = indexedDB.open(databaseName);

      request.onsuccess = () => {
        const database: IDBDatabase = request.result;
        const version: number = database.version;
        const isExist: boolean = Object.values(database.objectStoreNames).includes(tableName);
        database.close();

        if (!isExist) {
          const secondRequest: IDBOpenDBRequest = indexedDB.open(databaseName, version + 1);

          secondRequest.onupgradeneeded = () => {
            const secondDatabase: IDBDatabase = secondRequest.result;
            secondDatabase.createObjectStore(tableName, {
              keyPath: 'id'
            });
            resolve('New table was created');
          };

          secondRequest.onsuccess = () => {
            secondRequest.result.close();
            resolve('Success');
          };
        }
        if (isExist) {
          resolve('Table already exists');
        }
      };
    });
  }

  static generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; ++i) {
      hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }
    return `${hash}`;
  }

  set(id: string, value: ScoreModel | UserModel, tableName: string): Promise<string> {
    return new Promise((resolve) => {
      const databaseName: string = this.databaseName;
      const request: IDBOpenDBRequest = indexedDB.open(databaseName);

      request.onsuccess = () => {
        const database: IDBDatabase = request.result;
        const transaction: IDBTransaction = database.transaction([tableName], 'readwrite');
        const objectStore: IDBObjectStore = transaction.objectStore(tableName);
        const add: IDBRequest<IDBValidKey> = objectStore.put({ value, id });
        database.close();
        add.onsuccess = () => {
          resolve(`${add.result}`);
        };
      };
    });
  }

  get(id: string, tableName: string): Promise<{ id: string; value: ScoreModel | UserModel }> {
    return new Promise((resolve, reject) => {
      const request: IDBOpenDBRequest = indexedDB.open(this.databaseName);

      request.onupgradeneeded = () => {
        request.transaction.abort();
      };

      request.onsuccess = () => {
        const database: IDBDatabase = request.result;
        const transaction: IDBTransaction = database.transaction([tableName]);
        const objectStore: IDBObjectStore = transaction.objectStore(tableName);
        const read: IDBRequest = objectStore.get(id);
        database.close();

        read.onsuccess = () => {
          if (read.result) {
            resolve(read.result);
          } else {
            reject(Error("record couldn't be found in your database!"));
          }
        };
      };
    });
  }

  getAllRecords(tableName: string): Promise<{ id: string; value: ScoreModel | UserModel }[]> {
    return new Promise((resolve, reject) => {
      const request: IDBOpenDBRequest = indexedDB.open(this.databaseName);

      request.onupgradeneeded = () => {
        request.transaction.abort();
      };

      request.onsuccess = () => {
        const database: IDBDatabase = request.result;
        const transaction: IDBTransaction = database.transaction([tableName]);
        const objectStore: IDBObjectStore = transaction.objectStore(tableName);
        const read: IDBRequest = objectStore.getAll();
        database.close();

        read.onsuccess = () => {
          if (read.result) {
            resolve(read.result);
          } else {
            reject(Error("record couldn't be found in your database!"));
          }
        };
      };
    });
  }

  remove(id: string, tableName: string): Promise<string> {
    return new Promise((resolve) => {
      const databaseName: string = this.databaseName;
      const request: IDBOpenDBRequest = indexedDB.open(databaseName);

      request.onsuccess = () => {
        const database = request.result;
        const remove = database.transaction([tableName], 'readwrite').objectStore(tableName).delete(id);
        remove.onsuccess = () => {
          resolve('record entry has been removed from your database.');
        };
        database.close();
      };
    });
  }
}
