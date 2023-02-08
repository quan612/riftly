import { prisma } from "context/PrismaContext";
import Enums from "enums";
import { questUpsert } from "repositories/quest";
import adminMiddleware from "middlewares/adminMiddleware";
import axios from "axios";

const AdminQuestUpsertAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    /*  
            @dev Create a new quest for user
        */
    case "POST":
      try {
        const {
          id,
          type,
          description,
          text,
          completedText,
          rewardTypeId,
          quantity,
          isEnabled,
          isRequired,
          extendedQuestData,
        } = req.body;

        // look for quest type id of this type
        let questType = await prisma.questType.findUnique({
          where: {
            name: type,
          },
        });

        if (!questType) {
          return res
            .status(200)
            .json({ isError: true, message: `Cannot find quest type ${type}` });
        }
        let newExtendedQuestData;

        if (id === 0) {
          // add new quest

          newExtendedQuestData = { ...extendedQuestData };

          let existingQuests = await prisma.quest.findMany({
            include: {
              type: true,
            },
          });

          let walletAuthQuest = walletAuthCheck(existingQuests, questType.name);
          if (walletAuthQuest) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type.`,
              isError: true,
            });
          }

          let smsQuestCheck = smsVerificationAuthCheck(
            existingQuests,
            questType.name
          );
          if (smsQuestCheck) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type.`,
              isError: true,
            });
          }

          let unstoppableAuth = unstoppableAuthCheck(
            existingQuests,
            questType.name
          );
          if (unstoppableAuth) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type for same auth `,
              isError: true,
            });
          }

          let existingDiscordTwitterAuth = discordTwitterAuthCheck(
            existingQuests,
            questType.name
          );
          if (existingDiscordTwitterAuth) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type for same auth `,
              isError: true,
            });
          }

          let existingJoinDiscord = joinDiscordCheck(
            existingQuests,
            extendedQuestData,
            questType.name
          );
          if (existingJoinDiscord) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type`,
              isError: true,
            });
          }

          let existingTwitterRetweet = retweetCheck(
            existingQuests,
            extendedQuestData,
            questType.name
          );
          if (existingTwitterRetweet) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type for same tweetId "${extendedQuestData.tweetId}"`,
              isError: true,
            });
          }

          let existingFollowTwitter = followTwitterCheck(
            existingQuests,
            extendedQuestData,
            questType.name
          );
          if (existingFollowTwitter) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type for same twitter "${extendedQuestData.followAccount}".`,
              isError: true,
            });
          }

          let existingFollowInstagram = followInstagramCheck(
            existingQuests,
            extendedQuestData,
            questType.name
          );
          if (existingFollowInstagram) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type for same instagram "${extendedQuestData.followAccount}".`,
              isError: true,
            });
          }

          let ownNftCheck = owningNftCheck(
            existingQuests,
            extendedQuestData,
            questType.name
          );
          if (ownNftCheck) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type to quest list `,
              isError: true,
            });
          }

          let existingCodeQuest = codeQuestCheck(
            existingQuests,
            extendedQuestData,
            questType.name
          );
          if (existingCodeQuest) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type of code quest for same event "${extendedQuestData.codeEvent}".`,
              isError: true,
            });
          }

          let existingImageUploadQuest = imageUploadQuestCheck(
            existingQuests,
            extendedQuestData,
            questType.name
          );

          if (existingImageUploadQuest) {
            return res.status(200).json({
              message: `Cannot add more than one "${type}" type of image quest for same event "${extendedQuestData?.eventName}" or same discord channel "${extendedQuestData.discordChannel}".`,
              isError: true,
            });
          }

          // send web push
          let payload = {
            text,
            description,
            action: "open_riftly_url", //maybe able to custom open a different link later on web push
          };

          let questVariable = await prisma.questVariables.findFirst();
          let pushOp = await axios.post(
            `${questVariable.hostUrl}/api/user/web-push/push-notification`,
            payload
          );
        } else {
          // update quest, we need to get original extendedQuestData and create a new object to avoid data loss
          console.log(`** Upsert a quest **`);
          let originalQuest = await prisma.quest.findUnique({
            where: { id },
          });

          if (originalQuest) {
            newExtendedQuestData = {
              ...originalQuest.extendedQuestData,
              ...extendedQuestData,
            };
          }
        }

        let newQuest = await questUpsert(
          id,
          questType.id,
          description,
          text,
          completedText,
          rewardTypeId,
          quantity,
          isEnabled,
          isRequired,
          newExtendedQuestData
        );

        if (!newQuest) {
          res.status(200).json({
            isError: true,
            message: `Cannot upsert quest ${id}, type ${type}`,
          });
        }

        res.status(200).json(newQuest);
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const walletAuthCheck = (existingQuests, type) => {
  if (type != Enums.WALLET_AUTH) return;

  let walletAuthQuest = existingQuests.filter(
    (q) => q.type.name === Enums.WALLET_AUTH
  );

  if (walletAuthQuest?.length >= 1) {
    return true;
  }
  return false;
};

const unstoppableAuthCheck = (existingQuests, type) => {
  if (type != Enums.UNSTOPPABLE_AUTH) return;

  let unstoppableAuthQuest = existingQuests.filter(
    (q) => q.type.name === Enums.UNSTOPPABLE_AUTH
  );

  if (unstoppableAuthQuest?.length >= 1 && type === Enums.UNSTOPPABLE_AUTH) {
    return true;
  }
  return false;
};

const discordTwitterAuthCheck = (existingQuests, type) => {
  if (type != Enums.DISCORD_AUTH && type != Enums.TWITTER_AUTH) return;

  let discordAuthQuest = existingQuests.filter(
    (q) => q.type.name === Enums.DISCORD_AUTH
  );
  let twitterAuthQuest = existingQuests.filter(
    (q) => q.type.name === Enums.TWITTER_AUTH
  );

  if (
    (discordAuthQuest?.length >= 1 && type === Enums.DISCORD_AUTH) ||
    (twitterAuthQuest?.length >= 1 && type === Enums.TWITTER_AUTH)
  ) {
    return true;
  }
  return false;
};

const smsVerificationAuthCheck = (existingQuests, type) => {
  if (type != Enums.SMS_VERIFICATION) return;

  let smsVerificationQuest = existingQuests.filter(
    (q) => q.type.name === Enums.SMS_VERIFICATION
  );

  if (smsVerificationQuest?.length >= 1) {
    return true;
  }
  return false;
};

const joinDiscordCheck = (existingQuests, type) => {
  if (type != Enums.JOIN_DISCORD) return;

  let joinDiscordQuest = existingQuests.filter(
    (q) => q.type.name === Enums.JOIN_DISCORD
  );

  return joinDiscordQuest.some(
    (q) => q.extendedQuestData.discordServer === extendedQuestData.discordServer
  );
};
const followTwitterCheck = (existingQuests, extendedQuestData, type) => {
  if (type !== Enums.FOLLOW_TWITTER) return;
  let followTwitterQuest = existingQuests.filter(
    (q) => q.type.name === Enums.FOLLOW_TWITTER
  );

  return followTwitterQuest.some(
    (q) => q.extendedQuestData.followAccount === extendedQuestData.followAccount
  );
};
const followInstagramCheck = (existingQuests, extendedQuestData, type) => {
  if (type !== Enums.FOLLOW_INSTAGRAM) return;

  let followInstagramQuest = existingQuests.filter(
    (q) => q.type.name === Enums.FOLLOW_INSTAGRAM
  );

  return followInstagramQuest.some(
    (q) => q.extendedQuestData.followAccount === extendedQuestData.followAccount
  );
};
const retweetCheck = (existingQuests, extendedQuestData, type) => {
  if (type !== Enums.TWITTER_RETWEET) return;
  let twitterRetweetQuest = existingQuests.filter(
    (q) => q.type.name === Enums.TWITTER_RETWEET
  );

  return twitterRetweetQuest.some(
    (q) => q.extendedQuestData.tweetId === extendedQuestData.tweetId
  );
};

const owningNftCheck = (existingQuests, extendedQuestData, type) => {
  if (type != Enums.OWNING_NFT_CLAIM) return;

  let owningNftQuests = existingQuests.filter(
    (q) => q.type.name === Enums.OWNING_NFT_CLAIM
  );

  // false if same nft name existed
  return owningNftQuests.some(
    (q) => q.extendedQuestData.nft === extendedQuestData.nft
  );
};

const codeQuestCheck = (existingQuests, extendedQuestData, type) => {
  if (type !== Enums.CODE_QUEST) return;

  let existingCodeQuests = existingQuests.filter(
    (q) => q.type.name === Enums.CODE_QUEST
  );

  return existingCodeQuests.some(
    (q) => q.extendedQuestData.codeEvent === extendedQuestData.codeEvent
  );
};

const imageUploadQuestCheck = (existingQuests, extendedQuestData, type) => {
  if (type !== Enums.IMAGE_UPLOAD_QUEST) return;

  let existingCodeQuests = existingQuests.filter(
    (q) => q.type.name === Enums.IMAGE_UPLOAD_QUEST
  );

  return existingCodeQuests.some(
    (q) =>
      q.extendedQuestData.eventName.toLowerCase() ===
        extendedQuestData.eventName.toLowerCase() ||
      q.extendedQuestData.discordChannel === extendedQuestData.discordChannel
  );
};

export default adminMiddleware(AdminQuestUpsertAPI);
