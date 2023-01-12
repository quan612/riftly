import Link from "next/link";
import { useRouter } from "next/router";

function SettingMenu() {
  const router = useRouter();
  return (
    <>
      <ul className="settings-menu">
        <li
          className={
            router.pathname == "/admin/settings-config" ? "active" : ""
          }
        >
          <Link href="/admin/settings-config">
            <a>Config Variables</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/admin/settings-discord"
              ? "active"
              : ""
          }
        >
          <Link href="/admin/settings-discord">
            <a>Discord Channels</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/admin/settings-reward-types"
              ? "active"
              : ""
          }
        >
          <Link href="/admin/settings-reward-types">
            <a>Reward Types</a>
          </Link>
        </li>
      </ul>
    </>
  );
}
export default SettingMenu;
