import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import TourList from "../../components/tours/TourList";
import CreateTour from "../../components/admin/CreateTour";

export default function AllTours() {
  const { user } = useContext(UserContext);

  const [showCreateTour, setShowCreateTour] = useState(false);

  const toggleCreateTour = () => {
    setShowCreateTour(!showCreateTour);
  };

  return (
    <div>
      <h1 className="text-4xl pb-10 text-center">All Tours</h1>

      {user && user.role === "admin" && (
        <div className="pb-10">
          <button onClick={toggleCreateTour} className="submit-button">
            Create New Tour
          </button>

          {showCreateTour && <CreateTour onClose={toggleCreateTour} />}
        </div>
      )}

      <TourList />
    </div>
  );
}
