export const BuildCsv = (csvData) => {
    const csvString = [
        ["Wallet", "TwitterUserName", "Followers", "Discord User ", "ETH"],
        ...csvData.map((item) => [
            item.wallet,
            item?.twitterUserName,
            getDiscordUserDiscriminator(item?.discordUserDiscriminator),
            item.whiteListUserData?.data?.followers_count || 0,
            item.whiteListUserData?.data?.eth || 0,
        ]),
    ]
        .map((e) => e.join(","))
        .join("\n");

    return csvString;
};

const getDiscordUserDiscriminator = (discordUserDiscriminator) => {
    if (discordUserDiscriminator === null) {
        return "";
    }
    let str = discordUserDiscriminator.split("#");
    return str[0] + "#" + str[1];
};