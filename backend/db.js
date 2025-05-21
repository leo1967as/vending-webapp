// 📄 backend/db.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';

const file = join(process.cwd(), 'db.json');
const adapter = new JSONFile(file);

// กำหนดค่าเริ่มต้นเป็น object ที่มี products เป็น array ว่าง
const defaultData = { products: [] };

// ส่งค่า adapter และ defaultData ให้กับ constructor
const db = new Low(adapter, defaultData);

export default db;