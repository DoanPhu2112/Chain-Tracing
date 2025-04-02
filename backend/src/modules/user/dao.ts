import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type User = {
    id: string,
    name: string,
    password: string,
}
export async function createUser(user: User) {
    const id = await prisma.user.create({
        data: {
            name: user.name,
            password: user.password,
        }
    })
    return id
}

export async function getUser({ name }: { name: string }) {
    const result = await prisma.user.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    })
    return result
  }
  