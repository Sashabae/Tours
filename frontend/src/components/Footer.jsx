import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <aside>
        <img src="/tour.svg" alt="bus icon" className="w-12" />
        <p className="text-lg font-bold">Tours</p>
        <p>Easy tour booking website</p>
      </aside>

      {/* Tours */}
      <nav>
        <h6 className="footer-title">Tours</h6>
        <Link to={"/tours"} className="link link-hover">
          All Tours
        </Link>
        <Link to={"/tours/group"} className="link link-hover">
          Group Tours
        </Link>
        <Link to={"/tours/individual"} className="link link-hover">
          Individual Tours
        </Link>
      </nav>

      {/* Not functional links */}
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </nav>
    </footer>
  );
}
