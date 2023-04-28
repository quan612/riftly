
import { Quest } from "./quest";

export interface QuestType {
  id: number,
  name: string,
  description?: string,
  quests?: Quest[],
}
