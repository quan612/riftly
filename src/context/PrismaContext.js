import { PrismaClient, EquipmentType } from '@prisma/client'

export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: ['query']
  })

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

export const equipmentType = EquipmentType

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
