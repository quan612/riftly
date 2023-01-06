const { PrismaClient, EquipmentType } = require("@prisma/client");
const Enums = require("../enums");
const prisma = new PrismaClient();


/* 


*/
async function main() {

    /* phase 1 mint list spot ~ 5447  */
    //et remaining = await assignMintListSpotPhaseOne(Enums.MINT_LIST_SPOT, 5500); // 7000 - 1500
    //console.log(remaining)

    /* 
        GIFT_MINT_LIST_SPOT, everyone on Mint List + had MintListSpot from above
        Run these two together 
    */

    // let rewardedGiftMintList = await assignGiftMintListSpotPhase1(Enums.GIFT_MINT_LIST_SPOT, 3000);
    // await assignGiftMintListSpotPhase2(Enums.GIFT_MINT_LIST_SPOT, rewardedGiftMintList);

    // assign everyone Downloadable wallpaper or BOOTS
    // await assignEveryoneBootsAndART(Enums.BOOTS, Enums.ANOMURA_DOWNLOADABLE_STUFFS, Enums.ANOMURA_PFP)


    /* GREEN REWARDS */
    // await assignSingleReward(Enums.OCTOHEDZ_VX_NFT);
    // await assignSingleReward(Enums.OCTOHEDZ_RELOADED);
    // await assignSingleReward(Enums.COLORMONSTER_NFT);
    // await assignSingleReward(Enums.MIRAKAI_SCROLLS_NFT);
    // await assignSingleReward(Enums.ALLSTARZ_NFT);
    // await assignSingleReward(Enums.ETHER_JUMP_NFT);
    // await assignSingleReward(Enums.META_HERO_NFT);
    // await assignSingleReward(Enums.EX_8102_NFT);
    // await assignSingleReward(Enums.EX_8102_NFT);
    // await assignSingleReward(Enums.EX_8102_NFT);
    // await assignSingleReward(Enums.EX_8102_NFT);
    // await assignSingleReward(Enums.NAME_INGAME);

    /* PURPLE REWARDS */
    // await assignMultipleRewards(Enums.ADOPT_ANIMAL, 5);
    // await assignMultipleRewards(Enums.FREE_MINT, 10);
    // await assignMultipleRewards(Enums.ONE_TO_ONE, 30);
    // await assignMultipleRewards(Enums.ANOMURA_STICKER, 30);
    // await assignMultipleRewards(Enums.EARLY_ACCESS, 30);

    /* BLUE REWARDS */
    // await assignMultipleRewards(Enums.ANOMURA_PFP, 100); // avatar
    // await assignMultipleRewards(Enums.ANOMURA_DOWNLOADABLE_STUFFS, 200); // crab swag

    // At this point, there 417 users with 1 reward

    /* RED REWARDS */

    await customRandomWallet();
}

const assignSingleReward = async (rewardName) => {
    const whiteListUserRedeemed = await prisma.$queryRaw`
                select distinct wl."twitterUserName", wl."discordUserDiscriminator", wl.wallet, srd."rewards"
                   from public."Reward" rw 
                   join public."WhiteList" wl on wl."wallet" = rw."wallet"
                   left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
                   left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
                       where 1=1
                            and	( wl."discordUserDiscriminator" is not null or wl."twitterUserName" is not null)	
                            and srd.rewards is null
                               order by 2 desc
            `;
    // console.log(whiteListUserRedeemed)
    let walletToReward =
        whiteListUserRedeemed[Math.floor(Math.random() * whiteListUserRedeemed.length)].wallet;

    // create reward in shell redeemed table
    await prisma.shellRedeemed.upsert({
        where: { wallet: walletToReward },
        update: {
            rewards: {
                push: rewardName,
            },
        },
        create: {
            wallet: walletToReward,
            rewards: [rewardName],
        },
    });
};

const assignMultipleRewards = async (rewardType, numberOfReward) => {
    let whiteListUserRedeemed;

    if (
        rewardType === Enums.FREE_MINT ||
        rewardType === Enums.ADOPT_ANIMAL ||
        rewardType === Enums.EARLY_ACCESS ||
        rewardType === Enums.ONE_TO_ONE ||
        rewardType === Enums.ANOMURA_PFP
    ) {
        whiteListUserRedeemed = await prisma.$queryRaw`
            select wl.wallet, srd."rewards"
               from public."Reward" rw 
               join public."WhiteList" wl on wl."wallet" = rw."wallet"
               left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
               left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
                   where 1=1  
                   and	( wl."discordUserDiscriminator" is not null or wl."twitterUserName" is not null)
                   and srd.rewards is null
                           order by 2 desc
            `;
    } else {
        whiteListUserRedeemed = await prisma.$queryRaw`
        select wl.wallet, srd."rewards"
           from public."Reward" rw 
           join public."WhiteList" wl on wl."wallet" = rw."wallet"
           left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
           left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
               where 1=1  
               and srd.rewards is null
                       order by 2 desc
        `;
    }

    let walletList = whiteListUserRedeemed.map((el) => el["wallet"]);
    // console.log(walletList.length);
    for (let i = 0; i < numberOfReward; i++) {
        let walletIndexToReward, walletToReward
        walletIndexToReward = Math.floor(Math.random() * walletList.length);
        walletToReward = walletList[walletIndexToReward]

        await prisma.shellRedeemed.upsert({
            where: { wallet: walletToReward },
            update: {
                rewards: {
                    push: rewardType
                }
            },
            create: {
                wallet: walletToReward,
                rewards:
                    [rewardType]

            }
        })

        walletList.splice(walletIndexToReward, 1)
        if (walletList.length === 0) {
            break;
        }
    }
    // console.log(walletList.length)
};
const assignGiftMintListSpotPhase1 = async (rewardType, numberOfReward) => {

    let whiteListUserRedeemed = await prisma.$queryRaw`
        select wla."wallet" from public."WhiteListAddress" wla
        `;
    let walletList = whiteListUserRedeemed.map((el) => el["wallet"]);

    let remaining = numberOfReward;
    // console.log(walletList.length);
    for (let i = 0; i <= numberOfReward; i++) {
        let walletIndexToReward, walletToReward;
        walletIndexToReward = Math.floor(Math.random() * walletList.length);
        walletToReward = walletList[walletIndexToReward]

        await prisma.shellRedeemed.upsert({
            where: { wallet: walletToReward },
            update: {
                rewards: {
                    push: rewardType
                }
            },
            create: {
                wallet: walletToReward,
                rewards:
                    [rewardType]

            }
        })

        walletList.splice(walletIndexToReward, 1)
        remaining--;
        if (walletList.length === 0) {
            break;
        }
    }
    // console.log(walletList.length)

    console.log("done assignGiftMintListSpotPhase1")
    return remaining;
};
const assignGiftMintListSpotPhase2 = async (rewardType, numberOfReward) => {

    let whiteListUserRedeemed = await prisma.$queryRaw`
            select srd."wallet" from public."shellRedeemed" srd
                where 1=1 
                    and array_to_string(srd."rewards", ',') like '%Mintlist Spot%'
        `;
    let walletList = whiteListUserRedeemed.map((el) => el["wallet"]);

    for (let i = 0; i <= numberOfReward; i++) {
        let walletIndexToReward, walletToReward;
        walletIndexToReward = Math.floor(Math.random() * walletList.length);
        walletToReward = walletList[walletIndexToReward]

        await prisma.shellRedeemed.upsert({
            where: { wallet: walletToReward },
            update: {
                rewards: {
                    push: rewardType
                }
            },
            create: {
                wallet: walletToReward,
                rewards:
                    [rewardType]

            }
        })

        walletList.splice(walletIndexToReward, 1)

        if (walletList.length === 0) {
            break;
        }
    }
    // console.log(walletList.length)

    console.log("done assignGiftMintListSpotPhase2")
};
const assignMintListSpotPhaseOne = async (rewardType, numberOfReward) => {
    // do not assign to existing mint list address
    let whiteListUserRedeemed = await prisma.$queryRaw`
    select  wl."twitterUserName", wl."discordUserDiscriminator", 
            wl.wallet, srd."rewards",
            rw."quantity", rw."createdAt" as shellFirstCreate, rw."updatedAt" as shellLastUpdate
        from public."Reward" rw 
        join public."WhiteList" wl on wl."wallet" = rw."wallet" and rw."rewardTypeId" = 5
        left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
        left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
            where 1=1
            and wl."wallet" in ( -- distinct twitter, then get wallet, get first wallet if more than 1 twitter
            
                with walletToBeAward as 
                (
                select distinct wl."twitterUserName", wl."wallet", ROW_NUMBER() OVER(PARTITION BY wl."twitterUserName" ORDER BY wl."wallet") AS "RN"
                from public."WhiteList" wl
                    where 1=1 and wl."discordUserDiscriminator" is not null or (wl."twitterUserName" is not null and wl."twitterUserName" != '') 
                )
                select wa."wallet" from walletToBeAward wa where wa."RN" < 2
            )   
            and srd.rewards is null -- do not reward user that had reward from previous step
            and rw."quantity" >= 1300 
            and wla."wallet" is null -- not in whitelist yet
                order by rw."quantity" desc
        `;

    let walletList = whiteListUserRedeemed.map((el) => el["wallet"]);

    let remaining = numberOfReward;
    for (let i = 0; i < numberOfReward; i++) {
        let walletIndexToReward, walletToReward;
        walletIndexToReward = Math.floor(Math.random() * walletList.length);
        walletToReward = walletList[walletIndexToReward]

        await prisma.shellRedeemed.upsert({
            where: { wallet: walletToReward },
            update: {
                rewards: {
                    push: rewardType
                }
            },
            create: {
                wallet: walletToReward,
                rewards:
                    [rewardType]

            }
        })

        walletList.splice(walletIndexToReward, 1)
        remaining--;
        if (walletList.length === 0) {
            break;
        }
    }
    // console.log(walletList.length)
    return remaining;
};
const assignMintListSpotPhaseTwo = async (rewardType, numberOfReward) => {
    // do not assign to existing mint list address
    let whiteListUserRedeemed = await prisma.$queryRaw`
    select  wl."twitterUserName", wl."discordUserDiscriminator", 
            wl.wallet, srd."rewards",
            rw."quantity", rw."createdAt" as shellFirstCreate, rw."updatedAt" as shellLastUpdate
        from public."Reward" rw 
        join public."WhiteList" wl on wl."wallet" = rw."wallet" and rw."rewardTypeId" = 5
        left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
        left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
            where 1=1
            and wl."wallet" in ( -- distinct twitter, then get wallet, get first wallet if more than 1 twitter
            
                with walletToBeAward as 
                (
                select distinct wl."twitterUserName", wl."wallet", ROW_NUMBER() OVER(PARTITION BY wl."twitterUserName" ORDER BY wl."wallet") AS "RN"
                from public."WhiteList" wl
                    where 1=1 and wl."discordUserDiscriminator" is not null or (wl."twitterUserName" is not null and wl."twitterUserName" != '') 
                )
                select wa."wallet" from walletToBeAward wa where wa."RN" < 2
            )   
            and srd.rewards is null
            and rw."quantity" >= 1400
            and wla."wallet" is null -- not in whitelist yet
                order by rw."quantity" desc
        `;

    let walletList = whiteListUserRedeemed.map((el) => el["wallet"]);

    let remaining = numberOfReward;
    for (let i = 0; i < numberOfReward; i++) {
        let walletIndexToReward, walletToReward
        walletIndexToReward = Math.floor(Math.random() * walletList.length);
        walletToReward = walletList[walletIndexToReward]

        // await prisma.shellRedeemed.upsert({
        //     where: { wallet: walletToReward },
        //     update: {
        //         rewards: {
        //             push: rewardType
        //         }
        //     },
        //     create: {
        //         wallet: walletToReward,
        //         rewards:
        //             [rewardType]

        //     }
        // })

        walletList.splice(walletIndexToReward, 1)
        remaining--;
        if (walletList.length === 0) {
            break;
        }
    }
    // console.log(walletList.length)
    return remaining;
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* 
Assign everyone boots and downloadable art
1. Some would have nothing so far
2. Some would have 1 reward, either mintlist or gift mintlist
3. Some would have 2 rewards, mintlist and gift mintlist
*/
const assignEveryoneBootsAndART = async (boots, arts, avatar) => {

    let whiteListUserRedeemed = await prisma.$queryRaw`
            select wl.wallet, srd."rewards" from public."WhiteList" wl 
				left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
				where ARRAY_LENGTH(srd."rewards",1) < 3 or srd."rewards" is null

        `;

    for (let index = 0; index < whiteListUserRedeemed.length; index++) {

        let rewardsArrayToBeAdded = [];
        let random = getRandomInt(0, 5)
        let walletToReward = whiteListUserRedeemed[index]["wallet"]

        if (whiteListUserRedeemed[index]["rewards"] === null) {

            if (random === 0) {
                rewardsArrayToBeAdded = [arts, boots, avatar]
            }

            if (random === 1) {
                rewardsArrayToBeAdded = [arts, avatar, boots]
            }

            if (random === 2) {
                rewardsArrayToBeAdded = [boots, arts, avatar]
            }

            if (random === 3) {
                rewardsArrayToBeAdded = [avatar, arts, boots]
            }

            if (random === 4) {
                rewardsArrayToBeAdded = [avatar, boots, arts]
            }

            if (random === 5) {
                rewardsArrayToBeAdded = [boots, avatar, arts]
            }
        }
        else if (whiteListUserRedeemed[index]["rewards"]?.length === 1) {
            if (random === 0) {
                rewardsArrayToBeAdded = [arts, boots]
            }

            if (random === 1) {
                rewardsArrayToBeAdded = [arts, avatar]
            }

            if (random === 2) {
                rewardsArrayToBeAdded = [avatar, arts]
            }

            if (random === 3) {
                rewardsArrayToBeAdded = [avatar, boots]
            }

            if (random === 4) {
                rewardsArrayToBeAdded = [boots, avatar]
            }

            if (random === 5) {
                rewardsArrayToBeAdded = [boots, arts]
            }
        }
        else if (whiteListUserRedeemed[index]["rewards"]?.length === 2) {
            rewardsArrayToBeAdded = random === 0 || random === 2 || random === 4 ? [avatar] : [arts]
        }

        await prisma.shellRedeemed.upsert({
            where: { wallet: walletToReward },
            update: {
                rewards: {
                    push: rewardsArrayToBeAdded
                }
            },
            create: {
                wallet: walletToReward,
                rewards:
                    rewardsArrayToBeAdded

            }
        })
    }
};

const customRandomWallet = async () => {
    let whiteListUserRedeemed = await prisma.$queryRaw`
    select wl."wallet" from public."WhiteList" wl where wl."wallet" in 
	(
        '0x3d909b6cB958a32f1A6e0D016C387A3a2C8DeCd1',
        '0x0281208eD5739Fa208e9ed895481ca8D2830Ada2',
        '0xF949695F07a442A0243Fc0F459011815d2603b58',
        '0x341Be7de686295d15603A0a2Eb895a3729324a92',
        '0x7ad5B0328F69356E7DED82d238e67714630D559F',
        '0xC055fe5B545F4FDCF55C4d010aB4eE4972319b92',
        '0x448BC8B5f99C45D6433698C8a11D589aE28Af73D',
        '0x91d00b76fb2633B811C69A56c062268e58bab1E1',
        '0x0DD5dBf07138A6F6abE986EBcFaDc5569f95150b',
        '0x4226f83B6761fe3259505A5edf31aE4657582d15',
        '0x583bB5640b6f363E158A6DdCf5b279DD2938d6d6',
        '0x2fe1d1B26401a922D19E1E74bed2bA799c64E040',
        '0x4D6EAEd5a1d1E631bbB6B3b4c6bedc4251d2DDF6',
        '0xc08f1F50B7d926d0c60888220176c27CE55dA926',
        '0x42865E41f69A020f490BDB34BA4be6BC7B846Da2',
        '0x2Cf94E5F9c7820cabEA82EB0c2CCA7B772B4A17c',
        '0x20Bfd85C389A85551A02C3feFDEb8B74402a79cA',
        '0xe8F25FBD6aa4dc03D7fd125ecD32194b547fA225',
        '0x8FfbD66933d1138ccA21c660Cc80b631D038880c',
        '0xF9132814b9CAc452d5FE9792e102E7Dde41807e3',
        '0x11b8b4B5c6D29f35a965031ABe19ee84C4E6DD7d',
        '0x2f00bC9AcDCDaB4168c51A2EB6AAB939F85B8eB6',
        '0xb61193014Fc983b3475d6bF365B7647c2E52b713',
        '0x11D4C5A046b9aC9fde5eaA4C72bfC24387cB08Cf',
        '0x90B849a22C0075417B85740C599FF66551F395c9',
        '0x2C3B79b4FB76B2BDE07D457ecE647f1c63885418',
        '0xb461AB17dBD0e122f38763E00cC0748DdF4cBaAE',
        '0xD111886cb7eFF60F390E8F4C4F7c288C21988d51',
        '0x4Dd38d3a4505877bcb0050C2a2Cd464826878A37',
        '0xC47145A82F21C5Bb731e0Dd419a668a5014A7037',
        '0x6f516734e860E97ad2a78583BF3aab648C5973ef',
        '0x1e55D5c09bEb9F97e55809E5a9a00f209fdF3671',
        '0x4d2132c5C7602009Bb35796415838b92fA0cDA9e',
        '0xd3c8A21abdDFAB10C4e24c148Da6E5937e81d1Ce',
        '0x98b6F3750568b8923efB831213FEcFeBCadaCD2D',
        '0xcCC93c66c6e80Bf3d68BC63F546cbb42AB4895d6',
        '0x510D98A49f727D27fbB7FEADE9dc842D8e54D521',
        '0x1D9Fc050bc8BdDE9Ca783Cd54A329Bc4607C67ae',
        '0xF8b92fe3869281220119553d03544c6266892ffe',
        '0x5eAB792104b1722220c89aea9ba7c8Ab159E91C2',
        '0x0eD613B9e35472847fdF38A36624083457C47fBb',
        '0xA8E71923dFc7E5075Ca5CB047Bdbec182d446C5e',
        '0xF5096aF5C7B002537A9b38DC530009d3eE1756b3',
        '0x934095B9ed5f71F0d075C0a5d664f4f311423B67',
        '0x8DDf34b2924185458B82e94A7C698964b6C8bC85',
        '0x6E5C10F5B5363fcD1762b846024BB43629337836',
        '0x389CD9450Eafd2DcF7596Edae17580910378ebA8',
        '0xC05444251077C989b15D5460490538c983277163',
        '0x1C7c7b93F7D17a0FaaBfe6f99557C89493CcB9e4',
        '0x4dd7c8C07287574c843191de391ce26f943D5A3B',
        '0xb704061A9F2AC19Ec811cb7A887CBA6803d9f5c5',
        '0xb54196b753cDC25FA8d00AFA224BF975D8BF97Ae',
        '0x29eC5c8e31179138a3cB3354Aa1592E6C03D012b',
        '0x4cf0AAfdA3E2dF6e32C9e1Cb0623f6C13c772a7a',
        '0x344e63C83A6fB76E85D0C13976ecFC151869b163',
        '0x6E4cd1a58e0d1309dA36f1cE1e456E5B93483175',
        '0x7feD743Cab969D2d540f97E4Ac52FEa4A0D64044',
        '0xa51669b31Cd43ce69b7d324763115f4B00823A89',
        '0x3AA6605d87f611E43aD0a64740d6BeF9b80FCD2C',
        '0xa18c58d8925c27b76fb57Ff819d11222c1189775',
        '0x12B492b683EE40724851533eA48256650FCD555f',
        '0xbd275e2d5DacF74180e2EfF45C89AA9D16eA8988',
        '0x7578b4e84DC3C568C55E57ccbA067c3488137B79',
        '0x79Ccebd81405DcF325A6420090B67cAc8A8Ad2E0',
        '0xe56FCa16Ee8f76A87483c1378C7F2D4fb5C011cE',
        '0xF258CB952407142cf9022295756e8f378d0CD32D',
        '0x16d7DAa110BBc643d2DEEbC2fed0766b01c1c445',
        '0xB75BCC788e8df6c73043073391dd7A2972aC2958',
        '0xF16F92E33b0B75a4d11fe901DA6B8E9B948DEf29',
        '0x082893f7FADE4cC11902E85525041E059fFc00ea',
        '0x6d17b4b4aA621938CAD28e68c2acb00fF4051958',
        '0x8F19afE49a55ab5767798785013c88eB51B37497',
        '0x8985D10166FfbF3B9a3272b0324849d01Dc8cAA5',
        '0xc5d3F8E7F580Dd9A6A4C02d6eD5Bc5bDAEb171d0',
        '0x76E4f864bbEb60Bee66Ff5BbcD32dEcAF7FBDE71',
        '0xAbD8Cee5a93265fc7D1F9e45f0169294d01B8802',
        '0x6CfcBB7BAB66b8749628D81C4AB1f03120835350',
        '0x471637654518901631c3E5cc4fE7CFf93bcB0873',
        '0x25F731a163B2E7D8602aC45AAe4EF6109E81C0F1',
        '0xF6c719DC30FD8a3b8f23D075DDc4e4B00fA2736D',
        '0xa559D5cEC55F4A2cc5C8fb572222cFB7d9b9955D',
        '0x67F61FC380eee61468521Aa2E43F212711BC0d48',
        '0x73Ea22c8501Dd1D51aF1a9ED2cCa9552a75BB3a4',
        '0x93aC8efBe88E7e067FDb67037B874E6c2031623E',
        '0xf8dfc159378C7608E0EB4574B041458E9dC4Af96',
        '0x45dAA72ae474f834601D4D73b7c49F7C5284F8C8',
        '0x7EE76929409585ffE8e528d5dCd13Df087712f74',
        '0x4B7fC11F00E4eb79b9c6a4EA00F28d08B3750D1E',
        '0x8f045eb8AC4b03783310Ea5b718C5d3879bfb323',
        '0x422F3A64832B7d0ed251a8B3c0508FcF7DD694F0',
        '0xc6b6FD6B2a9fE4a02aB16D59844b3D5771B3E758',
        '0x112beC76F75f0615Ba7019Bd3AC3e2d40337401F',
        '0x6bd36454BFB94b5B22A95b06Ddb9f1550886f238',
        '0x300119cE7B62e1c9387b18f5006Aa539Cc00e3Ff',
        '0xBC3CB9B6d72C3B87e964797379956c26CD6Ad732',
        '0x0A4e95f14D852E5ed4112688d06D14eb33155eA4',
        '0x81B26F0698424E4B6206e7C36685C5E085bdfB08',
        '0x530eD6851C201D790FafBA1E26de30950a0B187D',
        '0x7425157B19259E7A2efB6bfB5CA6d818b6D2e2dC',
        '0x1AE8C729Fd245afC227D2ABDc953AD6b3264BD21',
        '0x39722c43A24C7798255f9C9FD3CBc627e8620eFB',
        '0x044916C6D978e4f98f2a6941944B43728421Ce0B',
        '0xC69aFa846B4A939b31DBC4a70427b58Ecc6C241C',
        '0x152ec4500984170C8D5D17142A3866bA5f85253A',
        '0xf95Dd3596607e518d8eF61CfBc7E573a141C9dEb',
        '0xbdcA8494017a1f359C3289378409400dc47f1457',
        '0x4A748e193ae554D6F722609eD257D3F812Bbb74A',
        '0xb2aB46918620464C770FffC43B5F7aB1c51e7dAB',
        '0x1b2cDbc0A9D060AfA451cDb8b861e414F3B2F361',
        '0xeeA789a41de3Deec01b342f64b6dC56b409Fa9f2',
        '0xE15E9C197357Ac36AE98A6C804E85c701BAd2257',
        '0x3CF6eC874d168c125e1b6e845BBeCE2b8eB2f863',
        '0x80390592343AF45bAd74fdBB08Dd5b738fa1Fc06',
        '0xAA0D7c757322f356E0308C723E6Cbe1CA60C4c39',
        '0x9589D8df1620Fe48276634E21B4F7f69a98cd9b6',
        '0x8Ed785cC46a932E05Bd1559Fda1D0fb3aA05Da24',
        '0x35D591ea1824B195fd8788dde715d608E011C986',
        '0x73E45dAf0b9E5e67072F7410b2261A60d07e4bC9',
        '0xe6D1Ee72f836F9B1DD5E238325bA302cB6631209',
        '0x62efEB6785E1BffB71c50D14a39969Dc5Af69eb1',
        '0xb99D2e1293F78D92C57C16b5aBff6ba6b1880473',
        '0xc9cfDF68215f0357d31a53A8f8E2B0A5064F658E',
        '0x92a0805821de631152677d32489229a244451B17',
        '0x77B6080a12cF31e2F83E57076806B9daA30f8b56',
        '0xeAAF3aBD53972611a1604F1AA85096768e7cfe14',
        '0xc1fa5a930dd524168b89a18686636D3c3b098D30',
        '0xE903b731a65696747CE1cBb92Ac1467Fb1Ee768F',
        '0x377bd40c7BfEF4627Ca6fD0Dc06eceAa667a28da',
        '0x4d477F1aabcFc2FC3FC9b802E861C013E0123AD9',
        '0xde1Ba7199fC608d7187a1ef435Bb0D5312027903',
        '0x00928D0baC54E6A7171d26fE41A988b657E68eEc',
        '0x30278eCde9827369408edb26Fa9861f8f065A896',
        '0xd4E4dD144071E1cE5051c69FbA3b4f1cF63c7b33',
        '0xf85660505e58a141F47f1b82b2a68Bd0F6E49d76',
        '0x344547db5563f147686B775F17071f2A44146864',
        '0x48535861C6c3086D3E837613B7Ac8da5A07AEfA9',
        '0x5b197E3eE6770518f6F2735274522F48aBd69864',
        '0x567FDfa5C177987B9baB22E9EaE42ce7aC788816',
        '0x5342B5f92f858AF3aCE546792c8DEe0845221Afa',
        '0x7a71aA2B2adfA4Cccb84E2E7BC226dDbF90cccbb',
        '0x0933e58414E5772113cCa71b3c13964d682435D6',
        '0x4995a1853494a33Cf02b73974b543cf3274F4466',
        '0xaa9c45077b0F1CdB50F648C3A8CcFA0d72ACaCc2',
        '0xdc00D011852E6090a3867eb0F1a24E2C4FF91B7C',
        '0x2900106152Fa4aCe1A055E829d0b50aff1085155',
        '0x355B8f25df7377B0777B1FB3409757aD4279B224',
        '0x6C067926dece192631B92F43A5aC3E29B5d02b0D',
        '0x47397643956e981c090a612aEEecb4F09F36b5ea',
        '0xA38bE9d248b3eCa900d135cdFbaC44aD2a1421B6',
        '0xD929A733705417593642D9767770e339ecAce749',
        '0x05f7F81Ef8b158be44b96A3a3Bd5351BdF28946c',
        '0x2808e370B1beBfBD5c8c036190576FCe3b3Cf8e7',
        '0x95bc3A7c1b7D73081dF6adAC70b2bf0e4F730c84',
        '0x8Df6630B911Fb255fD26fe4773887b56ef9A264d',
        '0x5b3c9ef7402F439633E18A5eE158733d3eEbe0D8',
        '0xDE3bE0CD3c2d6589e7f6fE9640127710aF6DBB9c',
        '0x073311d9631747904e79632C0e4A51481a5F1D73',
        '0x9243FEd0055c8AeAA31Baf425C3e96c19DE9Cd43',
        '0x3A704C0c8Cb3B08D56606Df42c6BAbe8387a6B09',
        '0x1420c3d6dFE514060Ce85b2Ecbb192Ae8511bD9f',
        '0x941c479a6AD50c41E4bf8da2F4F353a509Ea73cC',
        '0x80a2b397882b86C9474B1BF437fEf00EFDE50D1D',
        '0xdE07867BBdcBb0ffc65E185686E9f1214aeDdE25',
        '0x4DB8383ebDEb2a3Fee44D0a501719C9AB98cCdEf',
        '0xf69dd638C735512cB42e9C98AF3223D9Ae5e1fD4',
        '0x6d14eCd12663E1114eC3534d374ED598509DF199',
        '0x5CE1336f4d714766452Da9BEDf55DeF65f2F66a1',
        '0x77Ed46C3577EA9214dA565cE9B93720E474e08Cc',
        '0x3C852b75aE42ee502f571322668b3a3A1134D5cF',
        '0x5E9B144FA34aC9886E2Fe0F0fbe098e9dAD0Cf57',
        '0x53aA991b2A2a1b6Ce7b54747b9bEA230C61603Bf',
        '0x310C58A54A13a4975BA5D27530Ea8a8fF6F2FCa5',
        '0x8131d9b33cd265C55D442C536Ed5Da56Cb1BEacB',
        '0x87a6d196177Ab8b800BBf4218f6dC382920fe39b',
        '0xa227f861cA3260315b0Cf12eeeF04F09Ee88cC15',
        '0x85684C11FD750506CD8783a7cDC19Bc583ce62f8',
        '0x649502ea8f4721BBA97C2888B96c65af06dd22C2',
        '0x21ee30f2DB2Daf7D61798c7043a2f02b66B56C7B',
        '0x0286a22F655F84c36Ff6C80eB566a5a4A8F07541',
        '0xB1A362a130A302EbC6caC0370Bbc80a406B78282',
        '0xBe13084Cea1e3C8615f781b85B995c4d95947080',
        '0xE6cC5e3EBB07B5156ba3aF510B8c6cA19804d88E',
        '0xc52ec2Aea5E8d58841A37c338834Cd0BBeaDC99E',
        '0xD25B0DBcf6FD24D05EE90d64042C79ba290c6D19',
        '0xd1a5b91957530E1B3e9cfac1543467C60c352F69',
        '0xA1ed36FE9e4a32737472Ea0dd632825E73cB2943',
        '0x18e1e9F337d8bb00ADF012082aD598E2a8f5F568',
        '0x44D6fa50b6A15215e6C589d528A68b48095A43fd',
        '0x9FfE162b9B7FBCa991840B936F95B40808A1a998',
        '0x9ee4b2A21Eb94f887B9f89A3D163f44458888888',
        '0x0c9e25F360807DA04549a69baEC94c9fda1D41a7',
        '0xb1f2DCB2Bb1c678b1E947fFaa99DEa4279f81D9e',
        '0x02F19f9D76f37d98e451cbA0407d31724D562D00',
        '0x6A6743B85899cC2571C8034e209f74f5a92A0e9B',
        '0xAC5fd8abBfb2efdB330f627d9d69D1C0909d6316',
        '0xB7a88772F5BF81EAe6549aA3D29b6Ba4f62e71C9',
        '0x243FE9cde4F7840029dc954e62714D19279C6303',
        '0x5d5cB832E9FA0a29B1261d4cd8d5d1dc54AE954c',
        '0xd57382000334E2dE0419e85E5eC7aCABD32557B0',
        '0xe9Aa1980d6bb0a9b0eB25E2F766D4c589D8dCBe0',
        '0x2beD7A1dAE1c444aE0411BA365E7979Aa299D7ce',
        '0xF89AA70CF27b2bB306c01b060eBd933732df22b4',
        '0x9b976F9d030E8E1Ae624bC2972F51da634729af4',
        '0x094945cD1eCF5a1CB807B60E47DBd1741D17Ece2',
        '0x322e128453EFd91a4c131761d9d535fF6E0CCd90',
        '0x0b81347Ec5D389AF37677ea44f42f42a0D0CEe0a',
        '0x27C84e414784291493A80eD677C0Aa7C4d4eFF6c',
        '0xb689D496ebcd3C21590A2E7CBbde33564887aa63',
        '0x6008Fd486b7B85Ff82150C85F6CE80a2632B6762',
        '0x77423e36686420cFACe92D57e488E954C65bcb16',
        '0xd508153492F9bc15fF3348DD84ecAba3B3182810',
        '0x400A6bE4399Bb0F27575f10c07e2551Bd0Eba952',
        '0xFAdc1D4FA467CF3c37d8A26aa35D95b612659C27',
        '0x62E0b8E2EAaD2Dda2dd5927e840D681cd569e279',
        '0xb80463fbD5EEb52d7DD27aF39655AAb92c84a92D',
        '0x8c97B171738aA8fdbD0bb73a440Be2424F840635',
        '0xad79E2EA4424781EC61C52CD2464F6AD525E2a5D',
        '0xeB28FeA2F102E8099F33CB3054261f41C010d510',
        '0x9A41aBEe1477745AB8004ce129AD60F1231Ef85b',
        '0x0680cC6a4d7F7b9A3c3f584eF2d5DF04d6931c32',
        '0x5f45f8296BE3f38119D0c56ad339f6BF66154b9b',
        '0xbd20acA57f9664F47546E9F206C9b8020719802F',
        '0x418Ea8E4aB433aE27390874a467A625f65F131b8',
        '0xa7fB80b759Ea191C19720f531398663b298455fD',
        '0xC38C08AF3eb33F1456813fcdE15132Ede83eCfD9',
        '0x68d11EF12638B9036Db699F851774256ed45569c',
        '0x8a9be49c0af67af46b48892c2d3160696fbf772a',
        '0xa7fb80b759ea191c19720f531398663b298455fd',
        '0xd129F8023C58edaaa6aE4ef272d4F456B3030102',
        '0x4DBb28C28463233988e2eE133A6E46FEaCe3e9d8',
        '0x006f55EEfE91933a36f0533E2D971312d9b320da',
        '0x288e55b2f3af18e051b3d4840c04b24c40867e32',
        '0x61d20712851C797a5aCA1eA7Cb2134cDEbaa32EC',
        '0x9ddAe7a058d2d8940d83B90E2538f72CBfBDE206',
        '0xC65328a9e842f22643332733a479fd63f179Ab4d',
        '0xD789E2EC9F7b7b46AdB54c8C750236234f3Cab7d',
        '0x9b57f42818ca392bca342fe039ee78ac323e1739',
        '0xA36D96670e02Aa6D4d95d056BD233a6cA921D1cC',
        '0x4B9Ae694378b28654A1dcdB48B798c12C5cD61CD',
        '0xdf61f047bdd83deab18544751a22b1a43b946473',
        '0x7C58300662666734B9754Ea633089f6Ed5359481',
        '0x0c15C31Df4D9c4667376C0cCDf8fF7D4f9ff2e5D',
        '0x24601B7E73BC5fCed9d3771717DD5834CF467238',
        '0x5acCCaD1932174a7DF449905316679f4d6dc6748',
        '0xAa197d202E973aC76f41fc44e8Ad9512a219576C',
        '0xE3F0Ac6b03c2c751F9520074aa33DA8EaD84001b',
        '0xBE2d26169CB6e25deFa9209934ce0BbEDa42f03D',
        '0x085F3d0c47698c95fD496F032dFAf569aC47b299',
        '0x97B84241Ba2255569d1140eC4333b9eE013AFE3f',
        '0x101aBFe9d8CE8f1170f866D319EDFD649fD466E4',
        '0x01A1C72bF9547D1E6aBd8486AE3CAd64E781Cd7C',
        '0x99Ba59c639442b3844DED96B6E2A17088b43dbB4',
        '0xcF03D94502b8461815664305c9CF4b7d6124959a',
        '0x756FD0A0951559Ed44cF9A70F310937916a63115',
        '0xC519106c25E1F9D6a085318837F03c88BE27486B',
        '0xc8784800fb538B8b21aF9CA1085c2B8A13a93e64',
        '0x86583Ee03D584cFf6d271266168A279Fd99b4fD1',
        '0x57eE7F1d4Ca1f9429C9786c52Cd70363b2689335',
        '0x418d7595819C5Fb452D300Ea5072888b69D1F5e4',
        '0x85cC79807C28ea3b8Bc799D11Fb65E7F8ebbfD82',
        '0x0aBC057403e56F447db037927f6751d79792D8F4',
        '0x67af665a5c953eCb6C5ee5Cccc4645BB9F43e81A',
        '0x15D23970F2ea629213276265F5C80E364aA0909d',
        '0x1ad565DEF980F34C1eB357268A92A54a75f2405e',
        '0x073f75068AE43B8500D54CC0AB42F48518FA1fbD',
        '0x38E19046bf951f80f228F4C92983B3aC4f853546',
        '0xa96b151fce6478f6062B8E0De21459A09b7E0d62',
        '0x9489958F4B6Fa864d62CdA47677E94384847BA55',
        '0xb67ba3df9562014fED96844B664043b88e4b51d5',
        '0x549EDcd177Cc66FC2622A7ffF7eefC4AF0022087',
        '0x4F402029Eb441C9844bdF18e3ab6b31761481e57',
        '0xbA16836fb9e7b51384F7d5D8f0E322D505b2dE8d',
        '0x1b4eA81ceD99d6e09Ed4fab58A16aAe145595881',
        '0xefb17007a1C9479A60DD20d75dda81e653bfD0b9',
        '0xCA620CD153B9E3517B38dE0A83B6eE12558e2fe8',
        '0x0928AE0e403514895B692476F052CeCBbDAd9EC8',
        '0xC35a531E0B7255bCA372aD22AE94E743eaA72A4C',
        '0xfD271f71917Ee8b21E4DdC098489224d129F1D19',
        '0x5cb96bD14AB1aAE1B6eEaFdf1Ce3C428Df8A7862',
        '0x636E81878C6f4df92a18749dAB4C1B709a6a97ab',
        '0x92e7e59D6b83bfff7B0b82c62272470B46490D0D',
        '0x07c1E4527224bda7f4A5542e1acdb69bD71419e7',
        '0xFfD80C1f5792D80AF2aC42F9DB21F40a8C82ef9E',
        '0x1933c0886f9fd2a5c4f511a218D620C97571c526',
        '0x0390dA6623230eE40d224d91B60a98CE5A2f4233',
        '0x3c9bA54b63ef49143F2aab29843Deb7CdFC920De',
        '0x1deAF5E80b6C8dA6FDD2a09ECaFD1F9ed7d02Ae4',
        '0x100C1d0220016fd8496c53e742A91Cf6B053a79A',
        '0xa2237756a5Dd0b3bd8D6e87269210412484C41Ef',
        '0x00E514900a0E22d6E8ccBe170dB5986Dc8396f8F',
        '0x46B268e1f867A9eF4e487a915b66F5073461aA21',
        '0x565Ef6Cd1d7aE856ff3D8A52607b8A0d81bF7E0C',
        '0x5c5EC6FBACa326979690E69C7e0996EC31BA61bB',
        '0x7954D48123D17d720856E16512e5A938C7c05b1E',
        '0x782BF96f6024192409c885Db45ff7168f8F59013',
        '0x9c78f568A5a2d93F1b4Ac3258b9B6aF2F6e3D848',
        '0x4CBAc48dB439F1f712a508Cd717D0154443Af700',
        '0xe3F97E97576b4EDAF30008a2586f9fDd417a745f',
        '0xd29A5b54a737Cc95aE7ab81B8CcC1BF47a83E620',
        '0xD8cf3e31820ceEC940C69f462FC047d306BcB984',
        '0x67B9098416Cf1F647Db2d66b98de5219e6Cb6B2b',
        '0x11140a44eA288Db5BbCcb6718248a9418E360950',
        '0x3023179C9b4e971e4C115C48a58390689Da6400f',
        '0x300ff02eC5F686604c6ca38AF152404e806F9909',
        '0x115a6708Da88484C18C89150Ed58a835B775bE3c',
        '0xB3627134EbB3fE793950bdB4DEe168808C201Ca5',
        '0x5697aC8fd6874668eb52e76Aa99E190EB3DA71e1',
        '0xF412137c1dD2da8f3F4ac68C14F1496f7ec4B35A',
        '0xD4F4c485B3DA432A0cEB4FC92850EA5755548644',
        '0xC9051C9A40Ca68a6bD4e8C85f539e88Dd2c05005',
        '0xda844a4C50c1577048aDCb59f99dB10247cffed2',
        '0xF173aD71191E58357ACC5696c2Ad2849fe249B6B',
        '0xF61e0e69d7210A44e438977090BD5bdEE8E80dD7',
        '0xE5caDC526cfEE7D894a93E6dA638f746CB12F355',
        '0x51D7c791689a292218C896Ed320E74bF3537CdA7',
        '0x95df0617f664357edb016D6FF02e78AC1CE70661',
        '0x454185C1DC44090A4c3D8e82F86011c34aB09DF5',
        '0x41a5aB4B637dc21A9c541163F46D9727Aa839e70',
        '0xa2b1bf7a0e446166D435dC04a1674fB31Ee8d5A5',
        '0x56B52AeCBa7c1ccE9007bf28F446F47B54a79282',
        '0x2d5A308cDF80cF0208c158a353422F8D4FA06A15',
        '0x4235e74EE170ff3B7f3b78FFf45dDDbA6cEdB09A',
        '0x267EAE876D050B245cc4b84b289F496539782065',
        '0x15f5FEcE078c5b6DbF3758AE8A32A3b6aa88208B',
        '0xDf07b9f4394CbE97A8f1c89e910155c71fC1Ece7',
        '0x98567BD08fD9b8D4f06a7Bdc10c1dD31dc9Bdc35',
        '0xF71f3eb0FFe57A1E70408558EcfFC2688d81738d',
        '0xC2161Ca9232Bc7D15Eda90FA35f64C9219e01250',
        '0xEa62985CeF8823d9dD121aCb7D6fb023C8888888',
        '0x594Ee9372B6401a2875A7EdE858163CafE953a7E',
        '0x13E35b33b929BD96A004ea88d1fec552B205a23B',
        '0x94bC3F0ff283a1c65a8652588869b68d57b892c3',
        '0x037DBeb376900653E8b1744ccfD30f074f9F282A',
        '0x83f7321a05876f0bF973bEc3033858bb0b91e37f',
        '0x5ee49d02D52b277a8612e712FAf4dC4D0a579573',
        '0x4390eF1C661240414b669C1F9005652096b8Ee35',
        '0xCEcB8569542c204e69b78fb58a0B85dc479dDd79',
        '0xffF8BF28973F64c1553f89F7847228Ae987514cd',
        '0x9261624d3EFef21f36c13cE12EA01E951dFB20Bc',
        '0x3722C12aF38Da3cf90A77861A36a756807888888',
        '0x3f0267B2fE7fdEA3d2Ae0105FD8f115C8c1e121a',
        '0x48BA5955e9d19b91Ff51aC5aA083BC4B4756b84A',
        '0x93D9a9f35d5281D124161406888dD0dBed82079c',
        '0xdaF23fD17bE61c3c5303cB236eAb0BE6Aa49aA49',
        '0xB2F8fc22389Cd76D2c0169A43D5Dc20443640511',
        '0xFfdcEd0d6e1Ae5866A21282893CD2ce79333b7f9',
        '0x487b7115b825047407001199126ecDF26146472F',
        '0x15A4e5C46f10f999C7B2a8F0a73ED9A1228F4796',
        '0x3C9Ca0ac124FbBcECb7C04E7D914D0517B9ad672',
        '0x754367eC4Bed1Dd7798b622b1118104421868710',
        '0xade67f40249B4d7fFB2Fc61c97cFEAB5921962b1',
        '0xFFE0d9AB633b980753dCE63Eea4440b0330E09Ea',
        '0x90E417EA9a9a20c2A2f0dA4EA6C7539c23b9740c',
        '0x296f42Ae77c18d9B8494B5238F70958cF3568560',
        '0x191E9b7eac595546FE633ed106b6e0A27231eB38',
        '0xd13781eeE029C5F16CAE67b76c5399C9178Fdaef',
        '0x58cE1D0Ff94ef29a9bDBA9a7658029dC912891cd',
        '0x99d965cCfc5121b1A868A55a77d56d15a4B158C9',
        '0xa3f4C522e450DE244e3b9D6bec165E16D4A4522E',
        '0xcd0F3Abf0b6DaDD4837A5a60d86916B23577a186',
        '0x5A958B1EcE08192e98d268CbF1f34eecDFE0Ba95',
        '0xF886d7cF5ec6B6e2Dc301d4503E05ed59c9139F0',
        '0x7670B8a7734b1cF9FC16C0082f86799a638efe66',
        '0x903Fc3e674C455610422d66470FAD495F8E0e8a7',
        '0x995efFd76a982b5eA87b97d0dDDc0381c12f3c0F',
        '0x95746b6f6033DFCB98fE6FA6202Ff4Ee15D11300',
        '0xF27c55010c24e4d7d3dA0170E9F04a8dbE4cA1e8',
        '0xdD9b1F57b29BEf35d0360A25F0DcAcfD3B9dDE0a',
        '0x7D82a9181c3d270ea8B8F1b68794053aa4609313',
        '0x7812AdF412Dcf1430297139E5FdA589A91458a05',
        '0xD344dd7Ee34Ec6c11C30F6A9ba6F5d778135d5c7',
        '0x1b2d7CD649DcEf457451A7E703e0eB86BFe1871d',
        '0x282c2D2F2a91f2Ca4E9B42463E85af4d831b789C',
        '0xccB8650F4F7f335af05eb430F5F661Bc37880d17',
        '0x8262848eF928Dbfd864243dc76AF47385fC83895',
        '0x38152B4c623503C138D5ba2970E850Fb779B85B2',
        '0x4216FCCDdE0C43ac491819218Cf32D2a04f13f5f',
        '0xe751Ca437Df88004226cb1B208023800012D06cE',
        '0x700c7445F4869448D4105f7Ba241Af9EaCdB5094',
        '0x26BcF98065732aA638D3F1e1624DC386961A1c81',
        '0xA062696EF66eABd30D864d3895A0d6Cd908699a5',
        '0x66B5dE745DCC0Eb82081082b83782861234a3780',
        '0xC9EC6828BBC041f61C2a952830420f97c346E1d0',
        '0x9cC429d25D3b7B610e64c8Fd3B66D3C4C0652B0d',
        '0x032CC9D2B6AA9017f4189F19b49CfBa56f9B2D39',
        '0x4DcEE3ef9d4BFf7C385AaA30c45633ba72Fc0Ad7',
        '0xdD5409c383977284D4FA042ad6362837C0428834',
        '0xc7c5AbC64C4Eb781f604288d4657eEd64e9DECc1',
        '0xd3addbb98D1C9B8C1c6ac6e73cf9cbd9390aEEFA',
        '0x24C4aB0600E18a789a077Efc1AF354766f437e15',
        '0xC655E66A835cAF725E11A6bBE32dDB510BE97acD',
        '0xd67484A3398F9fBeA5CAEd467BA7e7503D796E87',
        '0x315F8eA109dd7fCDa2b0e6b7FA4d7a4AB0e16De3',
        '0x57748eCB251f2ec36027Bf8b7B2C13B69b8e5222',
        '0xc9CE4b3026A6a1F521DDc48de496e689B7478e57',
        '0xdC369e387b1906582FdC9e1CF75aD85774FaC894',
        '0x5bde1964a0496420Ee352f6ae3dcd86B9B5E5fDA',
        '0xb4789cBB840421fD2f89c891C9E821d544546B43',
        '0xaE15Ec56fFd8CFe46565C672F306Bd28DF5306a7',
        '0x194DdDeC520215cA7a25787D4D59fdc797131F98',
        '0x648226a5E8aeC464E98B64ef2cc00ff4360caeA9',
        '0x2026526a60a12a950cA610245600a07650E71abf',
        '0xD9f24C9AABE5C2629fdA3dC6BD8137Bc34373022',
        '0x37f19516AA72c6242d25Fc6400464Db0F17e86c1',
        '0xcAc52075067d0EA77F3D53d95eD6d9E75AF16869',
        '0xcA288eabaDc6Ed48CdA2440A5B068cdA8ae9995e',
        '0x00E423fe275AA3e9bE138d19B204f4ae6b4B88c6',
        '0x4554fF8056685d0D32FFe035Fe5e19A3C479E339',
        '0x8e79701B6D082b97B043fd5fb2731BA58745E779',
        '0x94E36b2e844e102097daCe895A63Ce1F8b985f63',
        '0xe0d72134721C83b9601Bd8bC2B398fCB7eDc596d',
        '0xD17fD20Ba8A23eAdC85Ecb55A2b554C132d05B68',
        '0x4476C24193ce5421A6573CaeC413C0bF9c2B4075',
        '0x331248f7e2a8Ff4694F14E3226F0cE60345E8BDe',
        '0xc4bFE6FD9b39c0309Ee4BA23EFD190DAd08A4f74',
        '0xecdC03E093977F14556dC41d6B9E85E087733F3D',
        '0x17352524e755AE92cd81f8E8245207362Fa5B41a',
        '0xbb9d34daaa808d72B992DBa73Fd91438878C0D9E',
        '0x8E59Ea61f5d9FF64fA0684FD4C277DE4337C38b9',
        '0x367884F55E9d4332d3069A50B8c8E97291be4E80',
        '0x22Ed84f5501b44Ba98eE8d47D4Edb1bF95622835',
        '0xf8975a57960c2b505ce392a46ac5ed0c5d432998',
        '0x9aE26f9F6ED6723763De5F63B87C785383f47676',
        '0x70E1480279b741FD387770D7963b7d781f534854',
        '0xE31890855cb257f2a130a2c1547B6802120AE0dE',
        '0x21Ca199dcE6a032909fe758495cDbf0E8ACAcD62',
        '0x9BF8497d801DAD2a878fD54a0894e834547872b2',
        '0x0570746e9D026f52ffb3512fE86B1436D38a5456',
        '0x7443280372A830e23Ebe162Bd2d0695934d6a825',
        '0x6F436B61A4cad4940b19a9Ef4C7a1E1e4f4DD365',
        '0xE10dE308fcEF293915CD8f97093aD19f8Cf2B317',
        '0x99eEFd23b9623931BEBd33dd8eaAFCbEa3B677c7',
        '0xF7C77498A4a065488b6a7B9413F311f11eE79783',
        '0xd18C66FD8019062F2Af58C370Cb55FF0B8aF4dbC',
        '0x38fFC1BA00005bA6D5294A364fB583df16d09F9b',
        '0xfb11EAFa478C6D65E7c001a6f40a79A7Ac0E663e',
        '0x7bfdbaeb2d1ecdddf8349c1f21ca27988d029345',
        '0xd5e8a9a3839ba67be8a5ffeacad5aa23acce75bb',
        '0xbddae6936532796afd4346c207d9d87c9b65ea4c',
        '0x3a1c538518099a5d0287ce23dd82313e3bf4b038',
        '0x035ebd096afa6b98372494c7f08f3402324117d3',
        '0x1b9197a61c8679b6e8ab19f191c29b498e4b112d',
        '0x661a7a4452210f1e28bb5869424cfdd8176ef2a3',
        '0x38345b9d3b617e6125082963af9fc4255157366e',
        '0xbc856dad4b3715057699dbf6ff8a372a663456b6',
        '0x843aa999827ae6d187f8a5b6ab4afb1b1597551d',
        '0x04a5e8c4a44780d115adda776b04bcf1c4f3254e',
        '0x984b18b1823fef04a4ca7cf1e8a0ef5359fa522f',
        '0x1e60ea5200012eeab20585ee930373b779291c00',
        '0x3872c604efd3cddaec3ddef8c28d94fcd3385d02',
        '0x243fe9cde4f7840029dc954e62714d19279c6303',
        '0x355d5d5081944681bcd11cfe06c18cf332178be8',
        '0xd958aeee9393958400309144ddcf8c9ade42ddc1',
        '0xdce62b21a8b1a9b39dd3ded27c876d416cc91b3e',
        '0x7aac8291d995b626558250d24fea8a02222b5f2b',
        '0x32cde1a4c5a1344bd555c90bd864b8248bf00aef',
        '0x0133f65ecb4e7560805457809e36229513151650',
        '0x63d68173f546b07bcff6b2d36d747cab122dee4d',
        '0xa427fa55945b55665258da177c533b960ef00169',
        '0x634ffd24513c0def2127e2d086a81968f948c7d7',
        '0x22a6c7eae21e6197d2f180673b8f939e0b2fae8b',
        '0xf94ba062308ea92f7ab3cf55c4b410339717c74d',
        '0x5de6a1d6b6fb803b4225bf72f96896b62aeb300b',
        '0xCE3802264a932480C02E6fe03BE3A5Da33d355fA',
        '0x24726bb1c7996dbe80dae1e87799034125577144',
        '0xf502e1bbb3cf5c35cc5a9c583d24b82d5341cc06',
        '0x7b94c0244fb3f5b5dc269a85f04cc1b7ed437d2c',
        '0xe518ad3fbb62c6771e8349af7cd666029786aa0c',
        '0x64224af4345dc0bfa6bb01f73c8d2c3bb1c6d869',
        '0xd34788e2f96758972c27678725808e50ef843f01',
        '0x9CB4c0044cd96FCcfaA80D116D94e3605e4bf4BE',
        '0xe79e09ffa6ac702d15c8bb71b136df55997c4a69',
        '0x053cba8511f4ec58f175057162a31eb7bd0d812f',
        '0x57e812bded6a782da9462ad48153f2dfb3fcf42c',
        '0x058eb53b19316d56f46550955b73b489d6b1c236',
        '0x4efeb0df030457272609fc32ed167ce27d1a521c',
        '0x8E3eD672f4D5d6bbC119f9acE561AeDa190AB446',
        '0x02d9ea14cf47562a2f1d2d2d744e628a60a1e5f8',
        '0x92fd2b261020ccb259069e602f08e1cf8782b684',
        '0xa7497e7bc15ed31d5dc108328bd7c6e61a08d20b',
        '0x8df50ed0e72d90b5b86eeedb12b30f517b8cb04b',
        '0x9197f339cca98b2bc14e98235ec1a59cb2090d77',
        '0x21438493531dfd9ff94c9eee6786d5c22ec287cc',
        '0x14ae9035d52ff038efb22d0f442f836cfa0e82bf',
        '0xd7598f1e7fa1563cbdc692f4bd0d15ef7f977537',
        '0x6da59b626af5d0b5b1619e10783adb7f9b7de1f3',
        '0x4c3715e74d562dbf245b6b99fec1ef8697b9a20f',
        '0xcb36fd9bf9e6be4bb1af8e47dbf1f0e120f08435',
        '0xff13cbc9f9b94f3c47c1008a52585287985c3d8f',
        '0xd422e83efaac0211b3837b95e256a986ac035808',
        '0x0c2405c6475e0e6165a9a66d04a87e78fa0a79ff',
        '0x522f42f519c06bb5c0c67a1c1630530062fe6459',
        '0xdc8971eea5228d0af229cc1a73cafcd7b25573da',
        '0x496d8ea7a37ad6b5ba066eb5da715585dd0fa24c',
        '0xf394c6c31ef2b04ca71eb5e58b0fffa80455fd23',
        '0x89d88fFA2Ba72bA029C7040e3Cd26caa7E7678d1',
        '0xb7399b1c53e051eff873fe343b5dadfb617056dc',
        '0x52d5e9133510fbc6d8209f8df4b806e43cf8f235',
        '0xd280ebacc47e4eb9b5df34913c6af0932e9d3849',
        '0x10fbec46f97087503b7c535ba645f33ef1eb692f',
        '0x77424437e320fc70ab04d983e259ca6e6e205c86',
        '0x0cfd5a68cb2053cac2feaffa89c7f7592d5e4a7b',
        '0x76cbf9384820848a9a40286e503cb342dd3c8b07',
        '0xae0fe8b7510a3d69eedfa4b77a9d134d3dc506e9',
        '0xa5e199c6a83346b34b71cb258f7357bcf15920c1',
        '0x7e4133255a9b798a414f841ade5e90d6fc644217',
        '0x13eee41d67b8d99e11174161d72cf8ccd194458c',
        '0x7704b95d00e01016be164a32ad37a20ae8234b89',
        '0x48766b6e4bcde79ad8134d338851e4d6739de113',
        '0x81b55fbe66c5ffbb8468328e924af96a84438f14',
        '0xa5d981bc0bc57500ffedb2674c597f14a3cb68c1',
        '0xfc5a25e29e5d11de2cbb4d1f93a0e7f381a1dcc5',
        '0xcb61dca3e03307d3654759fb83de34426d0ea09e',
        '0x4c48d00997c6d23d6b47a9ce8caa6027d0068e42',
        '0x17410ac8e1e7c0296d3d1ee82c2bce9cf5250a5c',
        '0x12adc0cfb830f71d52ee600d952976054557e5c2',
        '0x67db5e582632a8981b02a74a75110a3db7950a21',
        '0xfc3622d7ad1c261a9b17dbe08b603c537ce0f9d4',
        '0x163c29e5d553b3ecb5f31c2b7fb9714f66ebb8d9',
        '0x7e4a82326dcb5f40851dcf67b145a3ee68fb1d19',
        '0x36410ae136e07af5c99ccf97c8e9398558f82b54',
        '0xe8e84ec3116659067ac8a95acc56415ca42a7e57',
        '0x2bbad01f50eae735f95050b62e3a7d0c4cf8f6ca',
        '0x605deca13a61788dde7b4acfd32e9101da6fc6fd',
        '0x78ff56fecd3359e773857a45eb89579d5d1290d7',
        '0xa7eb5feaafaa2198a86f73f00594ade094c776d4',
        '0x08679fb863e0b509310104657800bb05375d5fdc',
        '0x8f505b39a533cE343321341e8CA7102E6b9571e3',
        '0xf6dF8128E3B7A579C2daC631B1DAdB12A4fbF0b2',
        '0x0e6f80103d7cc1d1e59068810c08474b6b6e921b',
        '0x1c00e5aecb22744bb5968e3307c2b76cb221ff66',
        '0x3a384dd773c968d4dbb7ce3d61af26b186e0475f',
        '0x6576c40fb9173a508a4b446a7895d7344ca40247',
        '0x5e176e4eb5217933b56994f5873bdac0ae29f85e',
        '0xb604adf39e054243aa08840f66226a78feedd4b0',
        '0xd4d16949a90d50ea1b3f670426fe11e9da956143',
        '0xdc31533db9ca48f9056f8a45672ad48b8c66731b',
        '0x7e8B97340F2cD42cba3aB7f207235C57cF89370a',
        '0x9Ce0128809b347B85e714FA26c477b71761B5E20',
        '0x41F422d760099cA0BD94B3Ecae71B42E8C8f9A74',
        '0x32273f5f668e0d94ed7db7eb9908efc3a17e7483',
        '0xb15d585cd5a9253d85eae9ec1c3e0a197628ebdf',
        '0xe0e3f91fd96beaa9991707b6f388555449bf40a1',
        '0x7BfdBaeb2d1ecDddF8349c1F21Ca27988d029345',
        '0xb4edd0c29032dca454abd96b1d3ea71b08b4c0c4',
        '0x2292c64C3BB8D68efFb8fB9904E29E426c91622f',
        '0x77bf350a791cf3b166e0f38b41cec390d37d3f63',
        '0xd1380a4e089950ee3a23d818e24ccbbef003a432',
        '0x152289a1a16403eecfdd8f99512a1c8dc4c390bd',
        '0x8f771c38fe9c081f1ff24ee8dff422adf34a0690',
        '0x78e55c6a3b60a903eb0d57104706b5d69fbdf4fc',
        '0x1cbaafea429dd0fcbe77e6320b47d0444d3ec97f',
        '0x33fa703be206e476da229988eb3a818e9fc65952',
        '0xbdf7ecd3938bc86373d15709fe09dcf9bb677ca7',
        '0x42ad947c3afe0887dcaaeaf54c715e215b4e3426',
        '0xccdc08484bb52cfbc73c8288858e406776424b2e',
        '0x68d11ef12638b9036db699f851774256ed45569c',
        '0xa6b443766ca03a35e39c9207ae1e499ac3b41662',
        '0x1156a767b4de8af9f77adc8f30313bbe7946b14d',
        '0x0febb3fb06d174167a0296c8fb8709ff468a182c',
        '0x2422efb8642c373f5000f36d80255607dbba53ba',
        '0xb8a9e697757b3767047e27c9b1cdaa2a2ef0c0d8',
        '0xb79710fad5ae4e8009f17e04982ae1960b511144',
        '0x886478D3cf9581B624CB35b5446693Fc8A58B787',
        '0x3e4f7448f272daa612235d348340d06c4988da18',
        '0xf606507ae2e57c1c9cd67a0afd2674160b5f3547',
        '0xdb9986bd0596b8a4873b09b4a10b81b13f2c9ddd',
        '0x4b988bec23246c237e2980c78c95a3d99c82e70b',
        '0xa0c6c0c6045ea5f6efed8dcbe907e8d0c8207b2e',
        '0x320ebf9016cb0e0994960b694fb5ce22cbdc947d',
        '0x8a6961e70f15c308b15dd84c9cc319da8fbb6fdd',
        '0xc0d188c16736e617abec6d35267fb1ac94ec0dfb',
        '0x1d842fa7b6e657ec7aa31af4d1c0d6bcd2336dfe',
        '0xbdaa89369c71f081a7c8b0f952a19e9e21f93736',
        '0x49c638a5450cc3dd5c1f1619f535efb5883aead7',
        '0xc1ace7eee6e758955b8937edd2e84d664b85e5e5',
        '0xf71196d24f26b94ec146619aa590abe96a91ed5e',
        '0xdf441583e2f978aebeefcd6232f525f8885aba32',
        '0xbdb438b7a8ca8827b2515309264797680e10a27a',
        '0x7bfedd0f21c3d9124b33eeb0fb711746a75a35fd',
        '0x77e2e00aef1699dfd9fde2b8f6d60fd7f009de09',
        '0x16e78427136498d2d0d6082c7cc536d7f8d9f59a',
        '0xB91aeEBC91feba2121C1800F5Fa8E35A78B7e124',
        '0x0effb1a2a1828e6418b49d4f31d96b2b52b00582',
        '0x041749557d93932d34f8852c292456b859f5a835',
        '0x1eb1fe371cfd35d56e4660ecd93b825669b1d4b3',
        '0x9d03c8919f9b4dc975b152dca3cfc27fc3806986',
        '0xd8e639508b9b946ff83c5c2239ea90922bc7984e',
        '0x1ed128e2bf0ba9f74baf07dad57fcec4c4290229',
        '0x0c16d08cdd114f9830d3cbb1045df4e8da6bae8c',
        '0xda2a2acdb2ee22ce276f9bbed943cc82350c4b94',
        '0x2e6d9adba8164dd78190ed387ee17dea4322e447',
        '0x992f2aed51676e8d5bace95232992425b5091afc',
        '0xe4e63529ad410f62c0e0c61a7cd3f3f07ce5239a',
        '0x70eb0bf3ea4880816235db1e77276dcaf0326283',
        '0x460fb22248a4d9aa4edfcc8361001b92d3beb4af',
        '0xd8961e1c2b639ccdd741f7ae0f45212e76f68eb3',
        '0x05bf72a25e8a11895648f78c093cf2f38c2feae4',
        '0x68435ce7f47f976628f547316b9b5407b58bdad0',
        '0x3df9d238f6e583508c3af0e5bb84f4308ec0d245',
        '0x1eff4f9836f34f9618df4491d0bae051f07ef2d6',
        '0xd87ea7892324dbe4992cc807b0dda9c6760f6003',
        '0xe6fbf9fa20b2c4b9051ea630f3ed2ffcc0752061',
        '0xa0c21283a2ace939590a1f611005035168e71216',
        '0x12595d697f354b290d09937f5ab880495b2e7ebc',
        '0x60a62dbe855d4c22d65e4fdb2513ef2853e3f565',
        '0x79052cec1793db27569f0f166a27763340827a46',
        '0x68c3352a46808d38606Aa73A586a5F2B67D4867D',
        '0x66a081f2ca3cd6d950e9640c4e34d10bba032521',
        '0xa15408ce9aad2d43dfef391c59bd866577ea714a',
        '0x6078f86ae3bFC1b6A7509fc516f7575aF0631091',
        '0x11c8b90bd843b6f1f30ec85a04fb2aa4aa39fd0b',
        '0x6022535728aee06c234903c41eefa731aaf77c46',
        '0xecac190067178329d8dbc90d81a3798d6c05c03c',
        '0x34bdfeb975c13d1dfc8b919ca6c2c40480d74cbf',
        '0x9f3c44a7331ca9da2d3432bcb0df91186a27e3d7',
        '0xecbf2d79797c0adfdc790a4d6183422c5d48fa24',
        '0xab470b66c068a0891dd20b0ecb15ab6a4e9f6bed',
        '0xB52CBf961630b7795e998b4Cb19971Ea514547Af',
        '0xaA984ea051cdadbCdC481Be26d7Cc4427f8Bd735',
        '0xF6DBA08f0B9C10eF0dcE188b515C8aE4486d2f29',
        '0x591304bECd943A8B93fC382D2d5cab34b5609B97',
        '0x939691EfE759213e5598d2887B10d2558C71c5EB',
        '0xEE66e82f17748D34f6d928cb5946dA3e5a83c0f3',
        '0xa4d3316B09125C0d1Bbfe757f43D3Aae4e4e9D8f',
        '0xD62EDd3F91E8B5AF7aa371AC93AdF374D9d6F5Fc',
        '0x281fD28Edc934bE39f38a78C59a0fE9daA0803Bb',
        '0xDc6024f610b5875304f6e6CB6252E0bB459Bd9f8',
        '0x272602914aA2e903b180d7a572E3AbAE339A3539',
        '0x872E1BB0598742F4351006EDACD834ca93747376',
        '0xe6154E96ED9DA65f05AbC3360f376E1a01E6164E',
        '0x9381dc79760eabfF5Cb76A810Dd468FC8f6c7CA2',
        '0x6c0d7D13a8a1472e0E16Bcb87725D76d108c9aA5',
        '0x2005695A023a3ef2B4f3703C96d29970fCac5975',
        '0x1410954922a9836F7273834ea1Bb31Db1d8E93c8',
        '0x029836A12e084B93E8059fc7a84d4c8C676E8363',
        '0x7C3CCA6cc0eB7505daeFd210F5f9888aFf9b981A',
        '0x2C3b3338543EC85A98f4cFae089d1821453BB62f',
        '0x56C348405C7d06B4a9A2983CF6E1Ec05c9C192ad',
        '0x96acce565D74358e38578378b93B83e95DB44C2a',
        '0x14Cbc196161758Ce33a3201357672EFCF99a9e55',
        '0x381a466a96ac5E23362B470D3aE1E67560d4cd12',
        '0x0683F080414aB2E0E1EEfC2898a6f0Dc1abefaaB',
        '0x7A8A43380eb0dF2856999F469FA2ef03B932e8c3',
        '0x67A966dB83ED082985B0af8bFA2B78D0d147e4F9',
        '0xcB66A1cf5F1926B6Fb4c18B024b3d4056af75a67',
        '0x2697a63A8F937CCaFB3825c42B514cAA6a450061',
        '0x24Dd0D84fB12F5c1dEcd8826fa1F459a5A7bF5BB',
        '0x417D073679a722988ad636E816f37a982ad4bdd7',
        '0x9e50db953210a5291d4Ab984166aBF21B5355054',
        '0x07508F96b3d07AaE0FE1A411dE301628D9F9FfBB',
        '0x6FB0f001ada93d5b24c8E569124C1b945D16F035',
        '0x64e86A7043ee781CBA6864BCB014Cd2CbF8c1434',
        '0x762f77A63A7ECad4A64f264B2a59631EBaDCf4de',
        '0x1bC8AA1Bf513D84450cCa75Ce0Be158D72E11f38',
        '0xbee2593AaeF3fbda50F7f8D6E420467222765025',
        '0x69f4011B1C8b32Ca7FB2DfB6d35Ee44661e6bd82',
        '0x48C96F8Ed81C12bd78848f49Dd8fafA3b3C68976',
        '0x5913BDf57145F16aa72c52B709DABe9345B52c2A',
        '0x33e5b450cF37108327848500aF75991D07C360bA',
        '0x177Fb3A12b00dEBD4D4B884fEe347be7B391dD6D',
        '0xB89c8AC1B4D21A7C6243e4CE66C60EF8c8782554',
        '0x603dF36eF79B730800a097Edc4840137cce9e180',
        '0xb3D255Dc6040c7296F63234dF23547cC9b5c7936',
        '0x651ff69A67e095a00AB1aC143A6512FA63266AC2',
        '0x99B4Ce6C6fA93Bf50ed20484dd32B99777eD22a1',
        '0xAdFff5eFCedBE62cE3B4F41c05681B92cf642DB3',
        '0x118DDD603d9077eC0f972def82D6D22788B8d4BA',
        '0x5840182E3773f733A3732f43a4bc397Fe802709A',
        '0x7F6629Ec8A28a05C8A1BC6B71c55f8Eb3634F482',
        '0x3fD82768E7A4E6A9A482863b194375920669Fc55',
        '0x0651e9A26c92300d937E344c76f508817e20B16B',
        '0x4Dc8343D8496e625943584425D4D5Ba1b2cD8Bcd',
        '0x01793896B811a56C6C2D195CF496D2dfBc8d9520',
        '0xe0EED5455aA3d005bDbaA06aCdd6844a1500aA99',
        '0x769237FF047dc48780E330F6F43402fe60f1962a',
        '0x639755E9c3cDD390Ded358220829e11f08403f56',
        '0x330d11B5DE17B7b664b653136C21B069a583e934',
        '0x4D161F60e0E22fc819Fe37B186D5B8EDD625DfdA',
        '0x462EcFc9d3247947B073D77982C33f30D7b9c168',
        '0x54C38215591200Efa46770354bcDBd0f55377Fc3',
        '0x13ff7B1EB1E0C9B8135398C7CdfA81F5DcedF03D',
        '0x1E372D919Fa97242aa89eb0C6aad4778eD45e57f',
        '0xe13d71149Eb6b7a5E1E7Be0F3849318Bc52A5231',
        '0xD4B8bb20B92Bce89bCcc5D1082Dac5b0Ae6d0713',
        '0x5623592b0a957384d589Cc59f8720611f2e2e486',
        '0xCef44C2B83c4795803e02b3196d3e559679FD5f2',
        '0x8003bEf886b51cBF9489775A107ec1d8cF907Bf5',
        '0x96eE49D020655AE66D5C678A238E48c44e5f65Dd',
        '0xB88134248F30334d65D2CE56fA6B73D9d3c97900',
        '0x0B57A9c028A146191e7FA07fF4722F8a1b3F2417',
        '0x3B039a85aF2f03CAa4e938a8136243C53458BD4D',
        '0x9B736f7c5D8C9E763187A63C10Cc66fb25ED7d29',
        '0x61D38D3457f1c43F2aeA2209f9db0E59BC56f820',
        '0xE56377fE61e92e6Ae28663f682692e0c4d3fdd4F',
        '0x903bc13fa3b9c9e5eF7d8371966f6c68F51f36D2',
        '0x3e2285B0eD4eB6aA3A319b93aF61A0Ab054A6781',
        '0xE0E78a2001BAa707A83508644163f95b2fE5DE0A',
        '0xB615B95965242d475977a0E500F423C2A5b925c9',
        '0x7E9F9f69ddee7216CF55Fa8889EdFFAd9c89Ee74',
        '0x6167404460BBc5d11030F4bE25EEe65FDDdc2036',
        '0x7077545D42222aCCCFCf4B51553F35A8AC42d6f6',
        '0x86249d94DECe5f5e41a3ab022c3650139246c719',
        '0xb171F2FbCD69515A1Ce049cA877445e078ca662E',
        '0x31AB10cDca318589AEb3c09a7db06c7f39a2b308',
        '0x43B18799aEb4045A560661C4712D39C149776Aa0',
        '0x9f8322bBc6D512F431a0a2Aca2d732956c62de80',
        '0xc0B30F73db74C68f88918ECF7511eC1ec9AD6537',
        '0x8Ad1C9D1473BcC8BAEE69AD2b7F0B30C248A4e2D',
        '0x316Bedce56e2d474634a2F6Fc9CD95F1e9857973',
        '0x68292357E9b0B35E08861CcDb53290BDB92999C5',
        '0xcC0d8f409B149b92c089B5a9177331338671501c',
        '0x5bB16B1A4C11478bEAe10413af3c2fF47E64c03C',
        '0x9DaDc07238254950031a3FA45a4812DCEA32133f',
        '0x5F6bdca4F573FF1713D8A7726f8e3f0539c099FA',
        '0x0F71cA78EFa7bc202EcB5d2BB10125F41c7a1911',
        '0xF8971D48aC34C4434DEc5Cd2Da76E0fb37e6C8b2',
        '0xFAdfe7192a09dd7d53f4C6619F6c382e583Ec025',
        '0xf758FD6452578A26a4F6C122b625dC8D9ef0EDcd',
        '0x67e98602B5Ad8BB6bf506A5b9593AC6C11D927F7',
        '0x81197F9Cf13Cc1eF3Bb5e6496fe9ec026B86b032',
        '0x3a9e5E90B35C13F271b4FC1DBdf3BecF7b37Ec69',
        '0xb15d8dfEd0060f0Cd80B1b04aFbCB5e1b1d06A3F',
        '0x9AEec7612Bb25a181e391489AcAfdba98b9dd804',
        '0x5c8cA92BA116b2ac36a19fa8fEabA729AD5188e0',
        '0x2B1007D08508b3cD4ba5DA08b87789c676d0dc83',
        '0x360cEBaC3453204D44032d4E4d2c9896DE48a85c',
        '0x9174776085365154CF6893F7088008CEd8C0A826',
        '0xd45892B505af19Ddae3fd4b620b30afdBE8A6184',
        '0x0678e836C26AbcFcd2b7e49559aA1a8B0f3ad36A',
        '0x5c8A7b88dd1d867b8AE773b3cbC3eFFC5d21081b',
        '0xa4fcB78A748b911998128876E2Aff5Dd5244679b',
        '0x868fA84ee420f7A3F7beB984c62c4b77A05fB8aC',
        '0x9C85Ea98bC61d754e267bDed4Dd9c0b596514b64',
        '0xBCeEE1340dC0b1946c7C3eeacbF0094db8380335',
        '0xb5Fcc1C11653566B83fD2eE849a3337592d28f76',
        '0xA58e46F99903847C7bab24530c105581823D15d1',
        '0xa2E4e2407f6128DF7a063e91f2a396A22dbB5989',
        '0xae61FFDaA9b1B0834dC228C541f316b43AE187cA',
        '0x46fF2Af9C8C3c4ca90149225785Bd09A80EEa5A1',
        '0x4cD4580F0046ddE16588cAA18B31aE01022b6a67',
        '0xCd4378878D9D5c6b834cf0e6BaafEE5567A09e0E',
        '0xF0b9e162a711F0dbE461B579Bf1E3F5614b54154',
        '0x12765A49f045e05651A630FB93448d920E8Dabc0',
        '0x08BDc9EA71603106d933F86b642aD571e7686854',
        '0xeA0A790df481b31146801247d392E2b754944638',
        '0xeB64FAE393b301362A40820267770d5e3EEb19E9',
        '0xD0dfC932C5FB11957721Ff3BB868B67673E34e22',
        '0x5E9F90F1B20Af04f4C31CaF0A8Ba58a72fC3C583',
        '0x828085063B465c4EF83a07B37e1Ab8291dD0bA42',
        '0x3361E898665936073BB403C623fd99824E0664d2',
        '0x278Ad7662AA4739864D3c2D8578368bdB83b27be',
        '0x048A8BB49aC39C7a31ffBa9f9b6522396Df26B2B',
        '0xd360b14A3C7237Ae0E03164552Fd914b275A0679',
        '0x133B2f8476af944c434454695313082215d5c4b3',
        '0x9e97BEF0A1B29ae991846c3DE9a1Ad5b1a5d7c0D',
        '0xCD266b9e1709343C6AE8614d1fc12f71565BF37D',
        '0x9882954D15f500Ea7A63A33479CBE0132B584Eb0',
        '0x870E3d869d89011Eb6e7d1317338E12d6dDe9aAc',
        '0x7db3d080DE992B1E2d6dbb4517362C26979a2770',
        '0x3Da4978Ae204cFb0e15295b7dcA7D516c777c655',
        '0x86A5EA7FdBD608445fAA9Aa2Ae997194CbD1Ba44',
        '0x6bA9da6a340B195fa3dAc3f7f9820056196dF3EC',
        '0x837e5669D40EdF74495708F696503a086f8f53F1',
        '0xe08c0696882d92abD7DA977886C7BCE136397DE7',
        '0x3D9255959DD4c1E7a6D7Bff8c2395cb4b7e903Cd',
        '0xb4E746DBc960E8F9D3731eACC916Bc67c3deBffc',
        '0x3531Adf05efa9d69bdf8555e3301E7F95816CFeC',
        '0x46182F34A4f1635748de801A61E052E2D6BD7DdF',
        '0x098694365CDFEC040b8294890351562c072f768A',
        '0x2007B494F848A4c564E01fa4d93659FeA83BcE23',
        '0x4B923F3d9cdD7EebccFFBad653ced4786c168205',
        '0x6F265522b3ac80f4d3c98f5073bd21f6f48fF4aa',
        '0x967f77602ac822E8ED6c64A4e3EA343E052EEa2A',
        '0x610E453A13fc37d924c74EA9deb8e1C655f27841',
        '0xc7bf6D5967e6e8D2aB6cd4b9F9AAe9eFaB184910',
        '0xf74B4540947F9bA97dDE1fe269360202ba2eb5aa',
        '0x8b8c34C8dcA4617aD2e235ee3a7EC4EA4EA84c14',
        '0x5E3eB320a6EC6dcf2CcDACCDF2aa7A7d1a00AB8D',
        '0xBd7851d902FBa36ee1ff05Af2d5E750276F9Afaa',
        '0x904C0FdED758511Ba2537BF19026E66ef7426FEA',
        '0xB9e37bf5CD4394c1cDf242736eA7D2B49Ee55b00',
        '0x9273BE2D68639eF82007077Ee556280D2CD2eF36',
        '0xe47904D721862e94e5f3E26C50399c20F57F031d',
        '0xCb4129CD60d05B1D991D0aa2428fDcA90bd5c8af',
        '0x3BC86eF5627F0Ae96D3cED5e4c3Ff2D2390E3c02',
        '0x25934f67e3F515306660D96e98a20a3F360dF1C4',
        '0xd8819b8C0E6e63e70Ad656a88A760F05e67164Cf',
        '0xF08A8E38Afb44a498B3f7b9d9bDF21a94060F337',
        '0x9bB91449079F671033f4c2B0Cf51D137A68D1EC5',
        '0xCC2FFE1D0a460c00DfC8e6666f80E4246cA537e8',
        '0xBA96BBCe76ca7A183FA11D142d6Cd5210da997CE',
        '0x8D5D71B75849e5863FF29aA40e0CAb27BBAa2f17',
        '0x216CD831Dd293Dcd7a305c4146A164c074774902',
        '0x299B151F961ec2f47EBb288086aF1071924302E8',
        '0x7520F47F69b2442469aa87eE98Ac5F6E9e765a2C',
        '0x28e5d92148aA12b0fCcd268ff643bE86Bbb5265e',
        '0x64FC8C50d3Ae974Bf9a32AFb7232AE96bCFBb35B',
        '0x8BfbAA24C27C6309A95e0aA22801bc1D61a52558',
        '0x1AA89609009D69F55730954Eb9430c4cf928deC0',
        '0x6EE35feb19E50c79635201452995a0aE6A0b1223',
        '0x58b0741e13AbCe29474B523AeB38Ab0111aa8f69',
        '0x09fFEb2Cc8488C20C6E10027C814E24739e2Be3C',
        '0x099C64FFD77889553Cf820b9FF83eE62549C3963',
        '0x2E2fCC97b7bf16dcdD8fF50f26F652A2896AB7fC',
        '0x744BDf0DF4bc5Df1817EE1084908E96EE515B1B7',
        '0xE6CFa26899F6E1101471F8f0dbDa495f9dDf48B0',
        '0x9fD8de0E6f2902Ed35A4bDb2d75ACc05A43330FA',
        '0xa7c85ce7D129D8BaC5b325B54312d6196254F7E8',
        '0x637Bb85f830CFae4b5f1Ae83919cCA896c1fB6cC',
        '0x800E5934bb3CbD7cDA02946805d6CeA8fff76083',
        '0xF2e8f75EaA752f7C64f1F8a9A5a77517243dB990',
        '0xe8C0Fe3699dB673486C391A4eEfA5a18c7CFD4d6',
        '0x0111Dcc6fc2dF10B1145FDCFEd2bCF1b1C00de91',
        '0xBB7f57AE7716eE58C62100aBa3ed87D460e1B288',
        '0x71124FFCcC0b3ef102e092680CF173AC8fDf1bB8',
        '0x165c135B7aE5081321BfA475C01560efE728966F',
        '0x3c6E78A279ca78088a939d80968feFfcd517190A',
        '0x1562A3dcC2459D9cDA1cCbb4053642B7e8893823',
        '0xFb408FA20c6f6DA099a7492107bC3531911896e3',
        '0xcC0Abb28B5a713f6dE46C7317378C52e224a41A7',
        '0x941fC4A776a9832871c41Db624ae8Be7EA7a3f00',
        '0x3265Ce8629d108A1781E87C7A86E5C43b626368F',
        '0x2600544F150Db80438004BE4Bbc7114aa21615A9',
        '0xf82bBcDEC1CdCaF609750a2304d70F497279Bfb1',
        '0xf4bA8e97d59284ebfc7ab33a509bb8938748d492',
        '0xACf1222153e2B795Cc35c57C32edD8B8Eae86279',
        '0x80f408703c04e03e6F6b3FB5C524443B1255A632',
        '0x0888A60957B55e4C23e66852A0D17290E7cED7e1',
        '0x2a381a41627De73C9285DE8f5b74791aD18Bd292',
        '0xA884A2F1A5Ec6C2e499644666a5E6Ef97B988888',
        '0xEE9cA24FB62BFc021e1A46E09e1C1CbECD3341B5',
        '0x40aB7aa71578Dbf4FDcE2F2ccF57D71d491be00c',
        '0xba29Cf7c95538Bbc07fdE94A5918fE8f507cAD9B',
        '0x3EFfCABDDe27072a47f14ab98b8213863c5dA207',
        '0xeb18aB518389EF480102a12a6C9072a99DcCe9bC',
        '0xe17E85E91B3c04025bAF4dd23AdCEdC7a7e7cE12',
        '0x4FA4167b3C94A80416bBc768fB919BF3AcE9F8C2',
        '0x416365993481e52e0472e7417656276d4E147A00',
        '0xf6188284965343fA067ed4BC8D930386316211e7',
        '0x52F82B262F370CcA157D3208Ffa8a9116f714D4E',
        '0x7ce61a127a62cb70B0ad47DD07DD91E4392E3498',
        '0x3CBF036d6C709FD723d3Bcc0B4123C603260fddE',
        '0x2D2538CEa6A3B72fEE404CFB320269aA51920A1E',
        '0x3e2971524AAa11e4dD950E087b5abFa68E7cFc17',
        '0x92a0c51A0d514e144DBb3C30911570A986aFF26e',
        '0x6882F12587Dce566c3cfD165DCF7dc6Bc35812F4',
        '0x2E82f8bbEe3Be3D0e3e4497CFA4DE372cF5DE088',
        '0xd422e83EFAaC0211B3837b95E256a986ac035808',
        '0x02736d5c8dcea65539993d143A3DE90ceBcA9c3c',
        '0x810c3243032F3ac57E9351812F116c3eE6953C18',
        '0x4d001ffF9086a15F2BBF12Ba9ECC4a641eED2AAD',
        '0xD89863049aABCd4626590fdebD00aF11D8233173',
        '0xa42f6c5Cf7871560a77f2FF9fd96B60B3180bA31',
        '0x25C8FfD4D659A041fF46517240cFA47481099792',
        '0xf8fd9c25d2E4F676DC61b01daa0481AE46bA9871',
        '0x3234D4E615F011526c36c8C2b2f5b89f5fbAEE2a',
        '0xBa23Cd29a0D0A50716e613AC4eEa49c04c10d6D8',
        '0x26b4DceA7895B4d3D8d846B3545bAF6C4a90BB5F',
        '0x9f981188b0B4cbdB62a6a62d9bF04171a932851e',
        '0x0D8eA512830639A297d3c7d353386982C47F74AA',
        '0x4F4C3a3AB3423866849B986B60Eb53Df2E8602E4',
        '0xEB1Ea19734615D614566Ed1B9cec874554678C3e',
        '0x706e5f14eb633F72Ed49C1CFEcc7BfAe52c95709',
        '0xF83abc519E046c5391d219fabF1A3C87dd5924D3',
        '0xaf6a60363d48E6c489DBfFAD9bB9EF9589700335',
        '0xD6A8723D1e07c36B0006cd5406e5a4F859813531',
        '0x0d448A793916d1268320608B4264123a5Fdf1A19',
        '0x0cF5C3cBC8649b18Ff1D63aE2f556662A06Ca446',
        '0x3EcFBA75d5a113241ec899888319A9e1E456EE9A',
        '0x1a6f342e7a0cd2a0FFBf044d7BCfbD8E0306B8b8',
        '0xaeD5d3c5b6e659C6462c112ACD1D31AE49EF6BFf',
        '0xaFd35b6352528E0CD871951EBF1a257c32612F41',
        '0x1f0ae022BA0192e9C8eaf4b6509236136C2BF5b9',
        '0xbcdE3581274e2BE57AF8788f90502706Da1650d8',
        '0xBf274AAbd8716a9A322FC4464259C310F4D0B840',
        '0x97ac71def35a693cA1c92FBeaCd40495b4D9a4A2',
        '0xA67b03DBB74c8a8DBb8Fb93C5d554275817acbF5',
        '0x4e7d9D8a5F7B0f08FCB37D07eC85e2eA95dfE40B',
        '0x2aE8512b8F0399fd4348B2F4b9a50D03a5a62AF5',
        '0x91b4ADe96e8d0eEfdf2a57cef161D13DC633E0d7',
        '0x8fE97d8bb0904142E807758e864704972Ef45dca',
        '0x921EBC5a739bB6B89E21da04edcB94Cbcf101865',
        '0x1F3B00363a447c88a255EA329C3E8E96c8872196',
        '0x8ff30fEe309B2014740442b786928797D635ec33',
        '0x84B744a80E91cfBafE787Eb360326C4E21CbB3CA',
        '0xDe54227dC7cb1dE999979f21548096D92B64827f',
        '0x4b504CB8fF38c0Bd123A45B3A352722D04018f0D',
        '0x7493dcA4eB307A78D388B998eAda53d6629cFA2a',
        '0x495643BE728133C9a8CAD0B86Cd92EADb7F1d494',
        '0x118e6ADbE6e937Fdb2F0802dE12b4082736Bbe83',
        '0x3246d76957F584e238D8052636d8453fEc2C1AC5',
        '0xEA1B056043Bb0B03451f40eF0ae8566409952284',
        '0x217c87B8A169cb36DA1fe435a72120C75478a74F',
        '0x1b7Ebd42D4869CD7865E2f939aDd07854c5466c3',
        '0x118aa4EBdd545a6A0Ed32b14614F51e8be371aE1',
        '0x32118F02fB9Fc6A3Fb47C70De1945b39cFAed519',
        '0x01466e9A475cFD5f23Cb48C731154b1034Efb3A9',
        '0xAa069eF57EF3362417604624Fa5ae80311Ac463b',
        '0x6A257DC60B1EF1c0061338bad8fe1d8A9500ea38',
        '0xAeBE56e07aa32eb4dE14F884cc25D396e5e773e0',
        '0x5D735d1ce929c5E2d11956E37c9634cf25ae8025',
        '0xe726aab4F99C90cC1175d83A2310Fdb966676a47',
        '0x54F385B21241e90b5e66c2A1FCd120bf0ba59279',
        '0xF48A431a1da2CBcC0e83C89E69b57D60aBBFb95C',
        '0x58437C988bDcBDfAcC8Ae9cbB86E85E45ee8d84f',
        '0x3582B20606cf576C50cCFb1577585608F645446A',
        '0xe813e844D1e27492607e076C7C99922Ef4A454cb',
        '0x675C7f0CF365eF76E3A0fA5aDb1eE489CF222154',
        '0xa4dd277A7405a5d7faDDA3540746a4ccD8d07073',
        '0xEbD99A8A55F4A2b5362327d4ca368d1f34bb03c2',
        '0x2fC901A1B89ac76dA2AE81297A531e3051f718ED',
        '0x6e8eC19b1943C41af62ae2a882e5Fd322e83ADCA',
        '0x06A59CcA88a3b80b860D03258138eD6f52A1D293',
        '0xa3DeEe4b3b837d1d6de79bCb418358720023F13A',
        '0x19d25F6151F2F4B81c9a53c46225A8270ACA44c7',
        '0x3de3A80c122a24028d5FA40db379dB4C2E8781dC',
        '0x0f17BCbB017A49a98c6A0096b0a225143741ccfb',
        '0x0d92D2d2Bc727469553f86638613314B98989628',
        '0x2d4A9D6d9D6D623c6a3285976D7beCA43F81bF8e',
        '0x6471AF7969DEaeA74C2B53ACf73DBC15C0f85904',
        '0xF2DBB54408c51Ac076E9e942354f4bD1429328D1',
        '0xe5C16858B425203536c2337cD4B88265f016b662',
        '0x8C404165DdCe289a0a58521E881AfB096a0D9550',
        '0x99a7ee4FAc3E28DCf0c02569dDAd34129D9b7E7c',
        '0xf79BE8884034B483Ab81d55d562122CCe0192Ac7',
        '0x14AC328Ef3345f2c23bdE5801f56139A309C5d60',
        '0xeb34C7f839Ab4B1321448d61f282EBaaC0681109',
        '0x13e0AE1A13B76029d48e658cd3aF4A4538888888',
        '0x955613f2EeDf3e9Ca0a8ecaA2CD9a9b13226F1f5',
        '0x5b5B1582fb17033cA82c8D52e202CAd55a2C005D',
        '0x5B66d58242476d7EB26bA35E5797F44D7D73e650',
        '0x67149c6a2aa490636948b084d88DDE8A958CA269',
        '0x72c62C06f0F684Aa70803F4858e8EEf92b917542',
        '0xef84098d14B86B022f16C20da6B21011CE4961bD',
        '0x5aFDeFbe665527512C9202c7a0dC96A88FcfE583',
        '0xd2Df586A872923266a3e88e3Eec0Dc0CBcFb28C8',
        '0x76474310d54A843bfFFE49f5b3d89296bF1C9A1e',
        '0x8FbEB0a5ed6c3088293835D4AAC006029621f463',
        '0x94C32cD334bFFd44Cb28Dca3699c781b3C73495F',
        '0xE7E5eCFF0e23a235b07AAf49E7EA8c16D38FF9dC',
        '0xC24CA1596ffcedC7664ff8e07eaf0BD6E3Fd9C79',
        '0x609B3b72c4A0237887Af18F05dDB06C77288Ce0A',
        '0x10408AD1aB8A3ecEf36C16e56305d24C60559aC4',
        '0x4A19379c3242F7A0843612ac251f172BB86dEFa7',
        '0x4ff89A056990169C806c02f7cC9b40e0Cf16Fc55',
        '0x438E85D541B4F095E3658f5DAfa45d3eDcC91e25',
        '0xFC6dcAcA25362a7dD039932e151D21836b8CAB51',
        '0x91F5F79c7EA0eBA35d5A1538B2563B85ec31dab7',
        '0x27ee28301f455AD1532F78d3C075Dd826f872176',
        '0x6e311C67E5e5476d6bBF87226038514c3eD11EbE',
        '0xc473eee5FF7218D5831D2D969950Eb78F386f5a4',
        '0xDe47E22Ea57Cc8981779d2523F085703eA83C08C',
        '0x22c073a7CEBbCD316ADE203793bE9FaF0cf63Cf3',
        '0x53aC8C104F9D34F5A61d5627d258a37BfA0eFd9B',
        '0x510623f885E859C400d1792bE4AE22718E6FaC0c',
        '0x1EEbf4c9550db3E82D20F965d79d06e589532733',
        '0x3BffB0f1e06D6A02df4824723AA68204043c61b9',
        '0xad792bc1455163f27018d33E02fc24e5943A9873',
        '0x164B4c5F9ca1A1BC0Fe0Fa39A76a12aAb85683e1',
        '0x929019Bc79c2d41F6fF3103cF815626a9d426Bf7',
        '0x172D991F950cF42D33b6C9993d1C49EB307e8ef7',
        '0xf9DAE1C00f78508bA6048f35aa4a752502EB4107',
        '0x4423225b1EC18F4156355425FCf29B1f59cAFfEB',
        '0x2245bE89Fc8faB94ed982e859Aa3212A4e4eB7e5',
        '0x171C8bE8b92674F7d7B0593ACA4619a25a40b6F0',
        '0xD65b7682D41Dfc3949B6A84671C2E7838AA94E6d',
        '0x90e017f8c915ba7f72e22849de9FAf91C4124fe9',
        '0x7E32784DfACb68C0e38C97928054D16c9e4f5aDC',
        '0x2A3Ffb6787171255fd3dc84362782d412b84286d',
        '0x62C05D0567FCAC135d94eEfdF54E55Bc896eFa62',
        '0xDd47D3dB30809a107c1DD59417A61230458d278e',
        '0xa475A14DDF8bAE5465793b5b04F2d0E5B68BcF14',
        '0x69659e74A4735f55667d42D1fd0368870Cd92528',
        '0x03894d4ac41Dd6C4c2f524eD4417C90fA46972c6',
        '0x5C63b361cD0476d3706e1064B112F671de0dc23f',
        '0xB1E8897458e06bC542Af612ac440b9edFF4363B8',
        '0x61d203D91ac812F491F365C306e50E0801550723',
        '0xf8538c8aaD9fd577Bed893ef439aBD69f02d44A7',
        '0xC91C423ca9163d5E842801DC40208314167cFa9B',
        '0x5CfDa873a5e84FC9D90e97D76b0F205C1AFD6aE6',
        '0xEf5C319151E83c3C53519aA5d75b43f826A3f66b',
        '0x8C59c23A1AB3b07e01Eefc03912C041f002b0f17',
        '0x859Da5457315eD979c121f00E5F4121f9D13b289',
        '0x98e4b7c089300a1ABF6206a01E56E30C656e94c4',
        '0x8Af968E17a753fC377030271A486Ce5081FFeE68',
        '0x9d052C2652173F25E5E548d521FFcb716b7613Ba',
        '0x5DBFA4c337CBdE8976BA932328bAAacFb3267B45',
        '0x7f7F715f6B9087176Fa9D72Ae29a210DE8EcdE3c',
        '0x468aB2Df12F00e01441d6F007b63fa1A3D3a5F25',
        '0x3A06d189e560878e55BAb5c78517F960f2826869',
        '0x5A7b394B42B184C71e63058062c966C0dfd8A91C',
        '0xE041074990883aD6C0A9b31Fb7C56f0063512A77',
        '0x8Da9793b566114a1D34c1C891A1996611c3857b2',
        '0xC151A8dab851498110018d0Ce9B199283FB37D2C',
        '0x18AEB1E5E6c8aE1922D129D0A347c4c43ef8f75e',
        '0xD9FA09F4EBD03e0B86853f0BA15a6c13fbf6A62A',
        '0x918c2bd5B2d302aaB6c9c0C9A73FFa99B76eF638',
        '0x75733f756F62C0FD80dF1aB0f47639834B216F98',
        '0x3c441C90092dFC04408f4009239a7CA7AFF7040F'
	) 
    `;

    let walletList = whiteListUserRedeemed.map((el) => el["wallet"]);
    let walletIndexToReward, walletToReward;
    walletIndexToReward = Math.floor(Math.random() * walletList.length);
    walletToReward = walletList[walletIndexToReward]
    console.log(walletToReward)

    console.log("DONE")
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });




// const whiteListUserRedeemed = await prisma.$queryRaw`
//     SELECT  wl."wallet", srd."rewards"
//        from public."WhiteList" wl
//        left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
//        where 1=1
//            and wl."wallet" in (
//                '0xe90344F1526B04a59294d578e85a8a08D4fD6e0b',
//                '0xd77aB381e769D330E50d9F32ecdd216474F4e386',
//                '0x2C3B79b4FB76B2BDE07D457ecE647f1c63885418',
//                '0xb61193014Fc983b3475d6bF365B7647c2E52b713',
//                '0xBFF9B8D0aF518cb3d4b733FCa0627D7f3BbeEc42',
//                '0xF9132814b9CAc452d5FE9792e102E7Dde41807e3',
//                '0x6b2210bEd7E8f2d946C4258Cc3C0c19B7e4f397c',
//                '0xfb11EAFa478C6D65E7c001a6f40a79A7Ac0E663e',
//                '0x2E9ef3698E6CbDd14Ee73518407B2909952e0f50',
//                '0x102f6CED956fe9C9f7f499B61A2d38c0029e80d8',
//                '0xc08f1F50B7d926d0c60888220176c27CE55dA926',
//                '0x2fe1d1B26401a922D19E1E74bed2bA799c64E040')
//                and srd.rewards is null
//         `
