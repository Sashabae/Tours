import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { logout } from "../../utils/logout";

export function MobileNavLinks() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };
  return (
    <>
      <li>
        <details>
          <summary className="bg-base-100">Tours</summary>
          <ul>
            <li>
              <Link to="/tours">All Tours</Link>
            </li>
            <li>
              <Link to="/tours/individual">Individual</Link>
            </li>
            <li>
              <Link to="/tours/group">Group</Link>
            </li>
          </ul>
        </details>
      </li>

      {/* Registration */}
      {user ? (
        <>
          <button onClick={handleLogout} className="btn hover:bg-gray-700 m-1">
            Logout
          </button>

          {user.role === "admin" ? (
            <Link to="/registrations" className="btn hover:bg-gray-700 m-1">
              All Registrations
            </Link>
          ) : (
            <Link to="/mytours" className="btn hover:bg-gray-700 m-1">
              My Tours
            </Link>
          )}
        </>
      ) : (
        <>
          <li>
            <Link to="/login" className="btn hover:bg-gray-700 m-1">
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="btn hover:bg-gray-700 m-1">
              Signup
            </Link>
          </li>
        </>
      )}
    </>
  );
}
