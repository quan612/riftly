import { prisma } from "@context/PrismaContext";

export const getVariableConfig = async (property) => {
  let config = await prisma.questVariables.findFirst();
  if (!config) {

    return "";
  }
  let configProperty = config[property];
  if (!configProperty) {
    throw new Error(`Cannot find property of `)
  }
  console.log("Getting variable config")

  return configProperty
};
