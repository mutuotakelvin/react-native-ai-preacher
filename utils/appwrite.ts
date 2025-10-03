import { Client, Databases, Models } from 'react-native-appwrite';

if (!process.env.EXPO_PUBLIC_APPWRITE_APP_ID) {
    throw new Error("EXPO_PUBLIC_APPWRITE_APP_ID is not set")
}

const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_APP_ID
const BUNDLE_ID = "com.bobak.aipreacher"
const DB_ID = "68df9c0f00149f2ca63c"
const SESSION_COLLECTION_ID = "session"

const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: PROJECT_ID,
    platform: BUNDLE_ID,
    db: DB_ID,
    table: {
        session: SESSION_COLLECTION_ID,
    }
}

const client = new Client()
    .setEndpoint(appwriteConfig.endpoint!)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

const database = new Databases(client)
export { appwriteConfig, client, database };

export interface Session extends Models.Document {
    userId: string;
    status: "in-progress";
    convId: string;
    tokens?: number;
    call_duration_secs?: number;
    transcript?: string;
    callSummaryTitle?: string
}
