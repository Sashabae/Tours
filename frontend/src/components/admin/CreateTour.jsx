import { useState } from "react";
import axios from "axios";

export default function CreateTour({ onClose }) {
  const [tourData, setTourData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    dates: [],
    duration: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTourData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setTourData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleDatesChange = (e) => {
    const { name, value } = e.target;
    setTourData((prevData) => ({
      ...prevData,
      dates: prevData.dates.map((date) =>
        date.id === parseInt(name) ? { ...date, tour_date: value } : date
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", tourData.name.trim());
      formData.append("category", tourData.category);
      formData.append("price", parseInt(tourData.price, 10));
      formData.append("description", tourData.description);
      formData.append("duration", parseInt(tourData.duration, 10));

      tourData.dates.forEach((date) => {
        formData.append("dates", new Date(date.tour_date).toISOString());
      });

      if (tourData.image) {
        formData.append("image", tourData.image);
      }

      // Debug:
      // for (let [key, val] of formData.entries()) {
      //   console.log(key, val);
      // }

      const response = await axios.post(`${API_URL}/tours`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Tour created successfully!");
      // console.log("Tour created:", response.data.data);

      setTourData({
        name: "",
        category: "",
        price: "",
        description: "",
        dates: [],
        duration: "",
        image: null,
      });
      onClose();
    } catch (err) {
      console.error("Error creating tour:", err.response || err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the tour"
      );
    } finally {
      setLoading(false);
    }
  };
  const addDate = () => {
    setTourData((prevData) => ({
      ...prevData,
      dates: [...prevData.dates, { id: Date.now(), tour_date: "" }],
    }));
  };

  const removeDate = (id) => {
    setTourData((prevData) => ({
      ...prevData,
      dates: prevData.dates.filter((date) => date.id !== id),
    }));
  };

  return (
    <section className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-xl shadow-md w-full max-w-lg overflow-auto max-h-[90vh]">
        <h1 className="text-3xl mb-5">Create New Tour</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="label-style">Tour Name</label>
            <input
              type="text"
              name="name"
              value={tourData.name}
              onChange={handleChange}
              className="input-style"
              required
            />
          </div>

          <div className="mb-4">
            <label className="label-style">Category</label>
            <select
              name="category"
              value={tourData.category}
              onChange={handleChange}
              className="input-style bg-black"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="individual">Individual</option>
              <option value="group">Group</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="label-style">Price ($)</label>
            <input
              type="number"
              name="price"
              value={tourData.price}
              onChange={handleChange}
              className="input-style"
              required
            />
          </div>

          <div className="mb-4">
            <label className="label-style">Description</label>
            <textarea
              name="description"
              value={tourData.description}
              onChange={handleChange}
              className="input-style"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="label-style mb-2">Dates</label>
            {tourData.dates.map((date) => (
              <div key={date.id} className="flex gap-2 mb-2">
                <input
                  type="datetime-local"
                  name={date.id.toString()}
                  value={date.tour_date}
                  onChange={handleDatesChange}
                  className="input-style"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeDate(date.id)}
                  className="btn btn-red"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDate}
              className="btn btn-blue mb-4"
            >
              Add Date
            </button>
          </div>

          <div className="mb-4">
            <label className="label-style">Tour Duration (h)</label>
            <input
              type="number"
              name="duration"
              value={tourData.duration}
              onChange={handleChange}
              className="input-style"
              required
            />
          </div>

          <div className="mb-4">
            <label className="label-style">Tour Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="input-style w-full"
              accept="image/*"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary font-semibold rounded-md border hover:border-purple-300 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-purple-700 font-semibold rounded-md border hover:border-purple-300 transition duration-300"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
