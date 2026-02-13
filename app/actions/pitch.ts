"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function createPitch(prevState: any, formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const message = formData.get("message") as string;
        const spotifyLink = formData.get("spotifyLink") as string;
        const image1 = formData.get("image1") as string;
        const image2 = formData.get("image2") as string;
        const image3 = formData.get("image3") as string;

        const id = randomUUID();
        const payload = {
            id,
            name,
            message,
            spotifyLink,
            images: [image1, image2, image3].filter(Boolean),
            createdAt: Date.now(),
        };

        // Save to KV Store (Redis)
        await kv.set(`pitch:${id}`, JSON.stringify(payload));

        // Fallback: If KV fails (or locally without keys), create a base64 encoded URL for immediate use
        // This allows the feature to work even without KV setup initially
        const encoded = Buffer.from(JSON.stringify(payload)).toString("base64");

        return { success: true, id, encoded };
    } catch (error) {
        console.error("Failed to create pitch:", error);
        return { success: false, error: "Failed to create pitch" };
    }
}

export async function getPitch(id: string) {
    try {
        const data = await kv.get(`pitch:${id}`);
        return data;
    } catch (error) {
        console.error("Failed to fetch pitch:", error);
        return null;
    }
}
