import { prisma } from '@context/PrismaContext'

export const getVariableConfig = async (property) => {
  const config = await prisma.questVariables.findFirst()
  if (!config) {
    return ''
  }
  const configProperty = config[property]
  if (!configProperty) {
    throw new Error(`Cannot find property of `)
  }

  return configProperty
}
