import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const userTypes = await prisma.userType.createMany({
    data: [
      { id: 1, name: 'NEW' },
      { id: 2, name: 'REGISTERED' },
      { id: 3, name: 'AUTHOR' },
      { id: 4, name: 'BLOCKED' },
    ],
  })

  const streamTypes = await prisma.streamType.createMany({
    data: [
      { id: 1, name: 'ANNOUNCEMENT' },
      { id: 2, name: 'LIVE' },
      { id: 3, name: 'RECORD' },
    ],
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
