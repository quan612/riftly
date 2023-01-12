import Link from "next/link";
import { useRouter } from "next/router";

function AdminAnalyticsMenu() {
  const router = useRouter();
  return (
    <>
      <ul className="settings-menu">
        <li
          className={
            router.pathname == "/admin/user" ? "active" : ""
          }
        >
          <Link href="/admin/user">
            <a>Single User</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/admin/user-bulk"
              ? "active"
              : ""
          }
        >
          <Link href="/admin/user-bulk">
            <a>Bulk</a>
          </Link>
        </li>
      </ul>
    </>
  );
}
export default AdminAnalyticsMenu;
