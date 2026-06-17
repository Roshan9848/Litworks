import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'litworks';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Global interface for caching connection in development
interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare const global: GlobalWithMongo & typeof globalThis;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db } | null> {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Database operations will fall back to local file storage.');
    return null;
  }

  try {
    if (cachedClient && cachedDb) {
      return { client: cachedClient, db: cachedDb };
    }

    const opts = {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    };

    let client: MongoClient;

    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR.
      if (!global._mongoClientPromise) {
        client = new MongoClient(MONGODB_URI, opts);
        global._mongoClientPromise = client.connect();
      }
      client = await global._mongoClientPromise;
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(MONGODB_URI, opts);
      await client.connect();
    }

    const db = client.db(MONGODB_DB);
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error: any) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB: ' + error.message);
  }
}

export async function saveBooking(bookingData: any) {
  const timestamp = new Date();
  const dataToSave = {
    ...bookingData,
    timestamp,
  };

  const dbConnection = await connectToDatabase();

  if (dbConnection) {
    try {
      const { db } = dbConnection;
      const result = await db.collection('bookings').insertOne(dataToSave);
      return {
        success: true,
        insertedId: result.insertedId.toString(),
        storage: 'mongodb',
      };
    } catch (error) {
      console.error('Error saving to MongoDB, falling back to local file storage:', error);
    }
  }

  // Fallback to local file storage
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, 'bookings.json');
    let bookings = [];

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      bookings = JSON.parse(fileContent || '[]');
    }

    // Add unique ID for the local entry
    const localId = 'local_' + Math.random().toString(36).substring(2, 11);
    const localEntry = {
      _id: localId,
      ...dataToSave,
    };

    bookings.push(localEntry);
    fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2), 'utf8');

    console.log(`Saved booking successfully to local file fallback: ${filePath}`);
    return {
      success: true,
      insertedId: localId,
      storage: 'file',
      filePath,
    };
  } catch (err) {
    console.error('Fatal: Failed to save booking to local file fallback:', err);
    throw new Error('Failed to save booking. Database and file fallbacks are both unavailable.');
  }
}
