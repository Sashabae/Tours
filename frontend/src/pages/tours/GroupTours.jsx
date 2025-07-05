import TourList from "../../components/tours/TourList";

const GroupTours = () => {
  return (
    <>
      <h1 className="text-4xl pb-10 text-center">Group tours</h1>
      <TourList category="group" />
    </>
  );
};

export default GroupTours;
