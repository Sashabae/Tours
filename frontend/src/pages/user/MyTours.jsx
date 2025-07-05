import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function MyTours() {
  const { user, loading: userLoading } = useContext(UserContext);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/registrations/user/${user.id}`,
          {
            withCredentials: true,
          }
        );
        setRegistrations(response.data.data);
        setError(null);
      } catch (error) {
        setError("Failed to load your tours.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRegistrations();
    }
  }, [user]);

  if (userLoading || loading) return <p>Loading your tours...</p>;
  if (error) return <p>{error}</p>;

  if (registrations.length === 0) {
    return <p>You have no registered tours yet.</p>;
  }

  const handleCancel = async (regId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.delete(`${API_URL}/registrations/${regId}`, {
        withCredentials: true,
      });

      setRegistrations((prev) => prev.filter((reg) => reg.id !== regId));
    } catch (err) {
      console.error("Cancel failed", err);
      alert("Failed to cancel the booking.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {registrations.map((reg) => (
        <div
          key={reg.id}
          className="card w-full mx-auto max-w-sm bg-base-100 shadow-2xl hover:border-purple-500 border border-black transition duration-200"
        >
          <Link to={`/tours/${reg.tour_id}`}>
            <figure>
              <img
                src={`${UPLOADS_URL}/${reg.tour_image}`}
                alt={reg.tour_name}
                className="w-full h-48 object-cover rounded-t-[0.5rem]"
              />
            </figure>
          </Link>
          <div className="card-body">
            <h2 className="card-title">{reg.tour_name}</h2>
            <p>
              {" "}
              Date:{" "}
              {new Date(reg.tour_date).toLocaleString(undefined, {
                hour12: false,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>Price: {reg.tour_price} $</p>
            <p>
              Status:{" "}
              <span
                className={`font-semibold ${
                  reg.status === "pending"
                    ? "text-orange-500"
                    : reg.status === "confirmed"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {reg.status}
              </span>
            </p>
            {reg.status !== "cancelled" && (
              <button
                className="btn btn-sm btn-error mt-4"
                onClick={() => handleCancel(reg.id)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
