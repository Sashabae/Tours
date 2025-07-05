import { useEffect, useState } from "react";
import TourCard from "./TourCard";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function TourList({ category }) {
  const [tours, setTours] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const endpoint = category
          ? `${API_URL}/tours?category=${category}&page=${page}&limit=9`
          : `${API_URL}/tours?page=${page}&limit=9`;

        const response = await axios.get(endpoint);
        setTours(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch tours", error);
      }
    };

    fetchTours();
  }, [category, page]);

  // Reset page to 1 when category changes (to avoid invalid page)
  useEffect(() => {
    setPage(1);
  }, [category]);

  return (
    <>
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
