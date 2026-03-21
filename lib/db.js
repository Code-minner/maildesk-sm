import { MongoClient, ObjectId } from "mongodb";

// ─── Connection ───────────────────────────────────────────────────────────────
// Next.js hot-reloads in dev — reuse the connection instead of creating a new
// one on every request (standard Next.js + MongoDB pattern)

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please set MONGODB_URI in your .env.local file");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4, // force IPv4, avoids DNS SRV resolution issues on some systems
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4,
  });
  clientPromise = client.connect();
}

async function getDb() {
  const c = await clientPromise;
  return c.db("maildesk");
}

// ─── Emails collection helpers ────────────────────────────────────────────────

export async function getAllEmails(type) {
  const db = await getDb();
  const query = type ? { type } : {};
  return db
    .collection("emails")
    .find(query)
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();
}

export async function getUnreadCount() {
  const db = await getDb();
  return db.collection("emails").countDocuments({ type: "inbound", unread: true });
}

export async function insertEmail(email) {
  const db = await getDb();
  const doc = {
    ...email,
    createdAt: new Date(),
    unread: email.unread ?? false,
  };
  const result = await db.collection("emails").insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function markEmailRead(id) {
  const db = await getDb();
  try {
    await db.collection("emails").updateOne(
      { _id: new ObjectId(id) },
      { $set: { unread: false } }
    );
  } catch {
    // id may not be a valid ObjectId if it's old seed data — ignore
  }
}

export async function deleteEmail(id) {
  const db = await getDb();
  try {
    await db.collection("emails").deleteOne({ _id: new ObjectId(id) });
  } catch {
    // ignore invalid ObjectId
  }
}

export async function clearAllEmails() {
  const db = await getDb();
  await db.collection("emails").deleteMany({});
}