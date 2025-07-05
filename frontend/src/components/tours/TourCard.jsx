// Card for a tour preview (image, title, rating)

import StarRating from "../reviews/StarRating";
import { Link } from "react-router";

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function TourCard({ tour }) {
  return (
    <Link to={`/tours/${tour.id}`} key={tour.id}>
      <div className="card w-full mx-auto max-w-sm bg-base-100 shadow-2xl hover:border-purple-500 border border-black transition duration-200">
        <figure>
          <img
            src={`${UPLOADS_URL}/${tour.image}`}
            alt="Tour image"
            className="w-full h-48 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{tour.name}</h2>
          <div className="card-actions items-center justify-end">
            <StarRating rating={tour.average_rating} />
          </div>
        </div>
      </div>
    </Link>
  );
}
