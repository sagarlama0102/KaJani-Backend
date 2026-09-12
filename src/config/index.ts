// import dotenv from "dotenv";
// dotenv.config();

// export const PORT: number =
//     process.env.PORT ? parseInt(process.env.PORT): 4000;
// export const MONGODB_URI: string =
//     process.env.MONGODB_URI || 'mongodb://localhost:27017/kajani_backend';
// export const JWT_SECRET: string = 
//     process.env.JWT_SECRET || 'default_secret';
// export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "30d";

import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;

export const MONGODB_URI: string = requireEnv('MONGODB_URI'); 
export const JWT_SECRET: string = requireEnv('JWT_SECRET');   
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "30d";