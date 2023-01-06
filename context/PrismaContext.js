// import * as Prisma from "@qhuynhvhslab/anomura-prisma-package";
// export const { prisma } = await Prisma.createContext();

// if (process.env.NODE_ENV !== "production") global.prisma = prisma;

import { PrismaClient, EquipmentType } from '@prisma/client'

export const prisma =
    global.prisma ||
    new PrismaClient({
        // log: ['query']
    })

export const equipmentType = EquipmentType

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
