// Page with details of a single tour with it's reviews and booking button

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import Reviews from "../../components/reviews/Reviews";
import StarRating from "../../components/reviews/StarRating";
import TourBooking from "../../components/tours/TourBooking";

const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function TourDetails() {
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTour() {
      try {
        const res = await axios.get(`${API_URL}/tours/${id}`);
        setTour(res.data.data);
      } catch (error) {
        console.error("Failed to load tour details", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTour();
  }, [id]);

  const handleBooked = async () => {
    try {
      const res = await axios.get(`${API_URL}/tours/${id}`);
      setTour(res.data.data);
    } catch (error) {
      console.error("Failed to refresh tour data", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    try {
      await axios.delete(`${API_URL}/tours/${id}`, {
        withCredentials: true,
      });
      alert("Tour deleted successfully");
      navigate("/tours");
    } catch (error) {
      console.error("Failed to delete tour:", error);
      alert("Failed to delete the tour");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!tour) return <p>Tour not found</p>;

  return (
    <>
      <section>
        <h1 className="text-4xl pb-10 text-center">{tour.name}</h1>
        <figure className="p-5 flex justify-center">
          <img
            src={`${UPLOADS_URL}/${tour.image}`}
            alt="Tour image"
            className="w-120 h-72 object-cover rounded"
          />
        </figure>
        <div className="card-body gap-5">
          {tour.dates && (
            <div className="mt-4">
              <p className="text-lg">Dates:</p>
              <p className="text-xs mb-2">(Month/Day/Year)</p>
              {tour.dates.length === 0 ? (
                <p>No available dates for this tour</p>
              ) : (
                <ul className="list-disc list-inside">
                  {tour.dates.map((date) => (
                    <li key={date.id}>
                      {new Date(date.tour_date).toLocaleString(undefined, {
                        hour12: false,
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <p>Category: {tour.category}</p>
          <p>Price: {tour.price} $</p>
          <p>Duration: {tour.duration}h</p>
          <div className="flex flex-col gap-1">
            <p>Rating:</p>
            <StarRating rating={tour.average_rating} />
          </div>
          <p className="break-words">Description: {tour.description}</p>
        </div>
      </section>

      {/* Edit and Delete if user is admin */}
      {user?.role === "admin" && (
        <div className="flex justify-center pt-4 gap-4">
          <button
            onClick={() => navigate(`/tours/edit/${id}`)}
            className="btn btn-primary"
          >
            Edit Tour
          </button>
          <button onClick={handleDelete} className="btn btn-error">
            Delete Tour
          </button>
        </div>
      )}

      <Reviews tourId={id} user={user} />

      <section className="pt-10">
        <button
          className="py-2 mt-4 bg-purple-900 font-semibold rounded-md border hover:border-purple-300 transition duration-300 btn"
          onClick={() => {
            if (!user) {
              navigate("/login");
            } else {
              setShowModal(true);
            }
          }}
        >
          Book this tour
        </button>

        {showModal && tour?.dates?.length > 0 && (
          <TourBooking
            tourId={tour.id}
            dates={tour.dates}
            onClose={() => setShowModal(false)}
            onBooked={handleBooked}
          />
        )}
      </section>
    </>
  );
}
