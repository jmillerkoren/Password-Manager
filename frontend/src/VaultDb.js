import Dexie from "dexie";

let db = new Dexie('vault_db');
db.version(1).stores({vault_key: '++id,username,key'});

export default db;
