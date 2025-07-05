// Modal showing while clicking a button to book a tour

import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function TourBooking({ tourId, dates, onClose, onBooked }) {
  const [selectedDateId, setSelectedDateId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/registrations`,
        {
          tour_id: tourId,
          date_id: selectedDateId,
        },
        { withCredentials: true }
      );

      onBooked();
      onClose();
    } catch (err) {
      setError("Failed to book the tour. You may have already registered.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Book Tour</h2>
        {error && <p className="text-red-500">{error}</p>}

        <label className="block mb-2">Choose date:</label>
        <select
          className="select select-bordered w-full mb-4"
          value={selectedDateId}
          onChange={(e) => setSelectedDateId(e.target.value)}
        >
          <option value="" disabled>
            Select a date
          </option>
          {dates.map((date) => (
            <option key={date.id} value={date.id}>
              {new Date(date.tour_date).toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="btn btn-secondary font-semibold rounded-md border hover:border-purple-300 transition duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn bg-purple-700 font-semibold rounded-md border hover:border-purple-300 transition duration-300"
            onClick={handleBook}
            disabled={!selectedDateId || loading}
          >
            {loading ? "Booking..." : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
