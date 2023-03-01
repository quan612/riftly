import type Prisma from "@prisma/client";

export interface WhiteListAggregate extends Prisma.WhiteList {
  userQuest: Prisma.UserQuest[],
}