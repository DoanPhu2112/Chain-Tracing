import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createGraph(graph: Prisma.GraphCreateInput) {
    const result = await prisma.graph.create({
        data: {
            description: graph.description,
            created_at: graph.created_at || new Date(),
            updated_at: graph.updated_at || new Date(),
        }
    })
    return result
}

