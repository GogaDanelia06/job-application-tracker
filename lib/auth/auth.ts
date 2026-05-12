import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { initializeUserBoard } from "../init-user-board";

const uri = process.env.MONGODB_URL!;

if (!uri) {
  throw new Error("Please define MONGODB_URL in .env.local");
}

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.id) {
            await initializeUserBoard(user.id);
          }
        },
      },
    },
  },
});

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function signOut() {
  "use server";

  const result = await auth.api.signOut({
    headers: await headers(),
  });

  if (result.success) {
    redirect("/sign-in");
  }
}