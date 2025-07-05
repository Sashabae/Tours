import TourList from "../../components/tours/TourList";

const IndividualTours = () => {
  return (
    <>
      <h1 className="text-4xl pb-10 text-center">Individual tours</h1>
      <TourList category="individual" />
    </>
  );
};

export default IndividualTours;
