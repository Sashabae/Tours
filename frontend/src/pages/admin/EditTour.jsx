import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function EditTour() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    duration: "",
    dates: [],
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTour() {
      try {
        const res = await axios.get(`${API_URL}/tours/${id}`);
        const data = res.data.data;

        setTour({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          duration: data.duration,
          dates: data.dates,
          image: data.image || "",
        });
      } catch (err) {
        setError("Failed to load tour data");
      } finally {
        setLoading(false);
      }
    }
    fetchTour();
  }, [id]);

  // Handle normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTour((prev) => ({ ...prev, [name]: value }));
  };

  // Handle individual date change
  const handleDateChange = (e) => {
    const { name, value } = e.target; // name is id of the date item
    setTour((prev) => ({
      ...prev,
      dates: prev.dates.map((date) =>
        date.id === Number(name) ? { ...date, tour_date: value } : date
      ),
    }));
  };

  // Add a new date field
  const addDate = () => {
    setTour((prev) => ({
      ...prev,
      dates: [...prev.dates, { id: Date.now(), tour_date: "" }],
    }));
  };

  // Remove a date field
  const removeDate = (id) => {
    setTour((prev) => ({
      ...prev,
      dates: prev.dates.filter((date) => date.id !== id),
    }));
  };

  // Handle image file change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit PATCH request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", tour.name.trim());
      formData.append("description", tour.description);
      formData.append("price", tour.price);
      formData.append("category", tour.category);
      formData.append("duration", tour.duration);

      tour.dates.forEach((date) => {
        formData.append("dates", new Date(date.tour_date).toISOString());
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.patch(`${API_URL}/tours/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("Tour updated successfully");
      navigate(`/tours/${id}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to update the tour. Please try again."
      );
    }
  };

  if (loading) return <p>Loading tour data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl mb-4">Edit Tour</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        encType="multipart/form-data"
      >
        <label>
          Name:
          <input
            name="name"
            value={tour.name}
            onChange={handleChange}
            required
            className="input-style"
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={tour.description}
            onChange={handleChange}
            required
            className="textarea input-style"
          />
        </label>

        <label>
          Price:
          <input
            name="price"
            type="number"
            value={tour.price}
            onChange={handleChange}
            required
            className="input-style"
          />
        </label>

        <label>
          Category:
          <select
            name="category"
            value={tour.category}
            onChange={handleChange}
            required
            className="input-style"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
          </select>
        </label>

        <label>
          Duration (hours):
          <input
            name="duration"
            type="number"
            value={tour.duration}
            onChange={handleChange}
            required
            className="input-style"
          />
        </label>

        <label>
          Dates:
          {tour.dates.map((date) => (
            <div key={date.id} className="flex gap-2 items-center mb-2">
              <input
                type="datetime-local"
                name={date.id.toString()}
                value={date.tour_date}
                onChange={handleDateChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => removeDate(date.id)}
                className="btn btn-error"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDate}
            className="btn btn-primary mb-4"
          >
            Add Date
          </button>
        </label>

        <label>
          Image:
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
          />
        </label>

        {/* Show current image only if no new file selected */}
        {tour.image && !imageFile && (
          <img
            src={`${UPLOADS_URL}/${tour.image}`}
            alt="Current tour"
            className="w-48 h-32 object-cover mt-2 rounded"
          />
        )}

        <button type="submit" className="submit-button">
          Update Tour
        </button>
      </form>
    </section>
  );
}
