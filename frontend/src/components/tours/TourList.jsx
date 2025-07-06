import { useEffect, useState } from "react";
import TourCard from "./TourCard";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function TourList({ category }) {
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState(""); // Search
  const [date, setDate] = useState(""); // YYYY-MM-DD format
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced value

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search (wait 300ms after user stops typing)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page when search changes
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        let endpoint = `${API_URL}/tours?page=${page}&limit=9`;

        if (category) endpoint += `&category=${category}`;
        if (debouncedSearch)
          endpoint += `&search=${encodeURIComponent(debouncedSearch)}`;
        if (date) endpoint += `&date=${date}`;

        const response = await axios.get(endpoint);
        setTours(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch tours", error);
      }
    };

    fetchTours();
  }, [category, page, date, debouncedSearch]);

  // Reset page to 1 (to avoid invalid page)
  useEffect(() => {
    setPage(1);
  }, [category, date]);

  return (
    <>
      {/* Search & Date Filter */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tours by name or description"
          className="input input-bordered w-full max-w-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="btn btn-outline disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="btn btn-outline disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
