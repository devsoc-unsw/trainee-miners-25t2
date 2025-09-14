import { PrismaClient } from "@prisma/client";
import { templateBlocks } from "../src/lib/template-blocks";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clear existing template blocks (only predefined ones)
    await prisma.templateBlock.deleteMany({
        where: {
            isCustom: false
        }
    });

    // Insert predefined template blocks
    for (const block of templateBlocks) {
        await prisma.templateBlock.create({
            data: {
                id: block.id,
                name: block.name,
                description: block.description,
                category: block.category,
                fields: block.fields as any, // Cast to any for JSON storage
                isCustom: false,
                isPublic: true,
                createdById: null, // No creator for predefined blocks
            },
        });
    }

    console.log(`✅ Seeded ${templateBlocks.length} predefined template blocks`);
}

main()
    .catch((e) => {
        console.error("❌ Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
