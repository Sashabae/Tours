import { Link } from "react-router";

export default function Home() {
  return (
    <>
      <section className="pb-10">
        <h1 className="text-4xl pb-10 text-center">Tours</h1>

        <div className="flex flex-col md:flex-row gap-10">
          <Link
            to={"/tours/individual"}
            className="border rounded-2xl w-full bg-base-200 hover:bg-base-300 hover:scale-105 hover:border-purple-500 transition duration-300"
          >
            <div className="p-5">
              <div className="flex flex-col items-center text-center p-5 gap-4">
                <h6 className="text-lg md:text-2xl text-center pb-2">
                  Individual tours
                </h6>
                <figure>
                  <img
                    src="/individual.svg"
                    alt="Person icon svg"
                    className="w-20"
                  />
                </figure>
                <p className="pb-5">
                  Tours for individual persons who want to join a forming group
                </p>
              </div>
            </div>
          </Link>

          <Link
            to={"/tours/group"}
            className="border rounded-2xl w-full bg-base-200 hover:bg-base-300 hover:scale-105 hover:border-purple-500 transition duration-300"
          >
            <div className="p-5">
              <div className="flex flex-col items-center text-center p-5 gap-4">
                <h6 className="text-lg md:text-2xl pb-2">Group tours</h6>
                <figure>
                  <img
                    src="/group.svg"
                    alt="Group of people icon svg"
                    className="w-20"
                  />
                </figure>
                <p className="pb-5">
                  Private tours for your group, celebration, or a fun leisure
                  activity
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
