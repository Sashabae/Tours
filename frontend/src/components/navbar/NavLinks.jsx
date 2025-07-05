import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { logout } from "../../utils/logout";

export function NavLinks() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <>
      {/* Tours */}
      <div className="dropdown dropdown-hover">
        <div tabIndex={0} className="btn bg-base-100 hover:bg-gray-700 m-1">
          Tours
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm"
        >
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
      </div>

      {/* Registration */}
      {user ? (
        <>
          <button
            onClick={handleLogout}
            className="btn bg-base-100 hover:bg-gray-700 m-1"
          >
            Logout
          </button>

          {user.role === "admin" ? (
            <Link
              to="/registrations"
              className="btn bg-base-100 hover:bg-gray-700 m-1"
            >
              All Registrations
            </Link>
          ) : (
            <Link
              to="/mytours"
              className="btn bg-base-100 hover:bg-gray-700 m-1"
            >
              My Tours
            </Link>
          )}
        </>
      ) : (
        <>
          <Link to="/login" className="btn bg-base-100 hover:bg-gray-700 m-1">
            Login
          </Link>
          <Link to="/signup" className="btn bg-base-100 hover:bg-gray-700 m-1">
            Signup
          </Link>
        </>
      )}
    </>
  );
}
