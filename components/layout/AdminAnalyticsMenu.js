import Link from "next/link";
import { useRouter } from "next/router";

function AdminAnalyticsMenu() {
  const router = useRouter();
  return (
    <>
      <ul className="settings-menu">
        <li
          className={
            router.pathname == "/admin" ? "active" : ""
          }
        >
          <Link href="/admin">
            <a>Google</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/admin/place-holder"
              ? "active"
              : ""
          }
        >
          <Link href="/admin/place-holder">
            <a>Placeholder</a>
          </Link>
        </li>
      </ul>
    </>
  );
}
export default AdminAnalyticsMenu;
