import s from "/sass/claim/claim.module.css";

export default function BoardTitle({ session }) {
    return (
        <div className={s.boardLarge_title}>
            <div>Quests</div>

            {session?.provider === "discord" && (
                <div>{session?.profile?.username + "#" + session?.profile?.discriminator}</div>
            )}

            {session?.provider === "twitter" && <div>{session?.profile?.data?.username}</div>}

            {session?.provider === "unstoppable-authenticate" && (
                <div>{session?.user?.uauthUser}</div>
            )}
        </div>
    );
}
