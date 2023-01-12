import Link from "next/link";
import { useRouter } from "next/router";

function SearchMenu() {
  const router = useRouter();
  return (
    <>
      <ul className="settings-menu">
        <li
          className={
            router.pathname == "/admin/search" ? "active" : ""
          }
        >
          <Link href="/admin/search">
            <a>Search</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/admin/search-stats"
              ? "active"
              : ""
          }
        >
          <Link href="/admin/search-stats">
            <a>Stats</a>
          </Link>
        </li>
        <li
          className={
            router.pathname == "/admin/search-user-quests"
              ? "active"
              : ""
          }
        >
          <Link href="/admin/search-user-quests">
            <a>User-Quest</a>
          </Link>
        </li>
      </ul>
    </>
  );
}
export default SearchMenu;
