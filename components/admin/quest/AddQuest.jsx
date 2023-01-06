import Enums from "enums";
import React, { useEffect, useState, useContext } from "react";
import {
    DiscordAuthQuest,
    TwitterAuthQuest,
    TwitterFollowQuest,
    InstagramFollowQuest,
    TwitterRetweetQuest,
    FreeLimitedShell,
    CollaborationFreeShell,
    DailyShellQuestForm,
    ImageUploadQuest,
    CodeQuestForm,
    WalletAuthQuestForm,
    UnstoppableAuthQuestForm,
} from "./index";

import { withRewardTypeQuery } from "shared/HOC/reward";
import { withQuestTypeQuery } from "@shared/HOC/quest";
import JoinDiscordQuest from "./Forms/JoinDiscordQuest";
import ClaimRewardForOwningNFTForm from "./Forms/ClaimRewardForOwningNFTForm";

const AddQuest = ({ closeModal, rewardTypes, questTypes }) => {
    const [selectedType, setSelectedType] = useState();

    useEffect(async () => {}, []);

    const handleOnSelectChange = (e) => {
        setSelectedType(e.target.value);
    };

    return (
        <div className="row d-flex ">
            <div className="col-xxl-12">
                <div className="card">
                    <div className="card-body">
                        <div className="col-6 mb-3">
                            <label className="form-label">Quest Type</label>
                            <select onChange={handleOnSelectChange}>
                                <option value="Select">Select Type Of Quest</option>
                                {questTypes &&
                                    questTypes.map((item) => (
                                        <option key={item.id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        {selectedType === Enums.UNSTOPPABLE_AUTH && (
                            <UnstoppableAuthQuestForm
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {selectedType === Enums.OWNING_NFT_CLAIM && (
                            <ClaimRewardForOwningNFTForm
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.WALLET_AUTH && (
                            <WalletAuthQuestForm
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.DISCORD_AUTH && (
                            <DiscordAuthQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.TWITTER_AUTH && (
                            <TwitterAuthQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.TWITTER_RETWEET && (
                            <TwitterRetweetQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.FOLLOW_TWITTER && (
                            <TwitterFollowQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.FOLLOW_INSTAGRAM && (
                            <InstagramFollowQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {selectedType === Enums.IMAGE_UPLOAD_QUEST && (
                            <ImageUploadQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.LIMITED_FREE_SHELL && (
                            <FreeLimitedShell
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.JOIN_DISCORD && (
                            <JoinDiscordQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.COLLABORATION_FREE_SHELL && (
                            <CollaborationFreeShell
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.DAILY_SHELL && (
                            <DailyShellQuestForm
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.CODE_QUEST && (
                            <CodeQuestForm
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
const firstHOC = withQuestTypeQuery(AddQuest);
export default withRewardTypeQuery(firstHOC);
