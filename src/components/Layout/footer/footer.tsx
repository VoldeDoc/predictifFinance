import {
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#001f80] text-white py-10">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 mt-32">
        <div className="col-span-1">
          <img
            src="assets/images/logo-white.png"
            alt="Predict.if logo"
            className="w-52 mb-4"
          />
          <p className="text-gray-300 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <div className="col-span-1 uppercase">
          <h3 className="font-bold mb-4">Top Instruments</h3>
          <ul className="space-y-5">
            <li>
              <Link to="#" className="text-gray-300 hover:text-white">
                Financial Times
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white">
                Bloomberg
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white">
                Associated Press
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white">
                The Economist
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-bold mb-4 uppercase">About Us</h3>
          <ul className="space-y-5">
            <li>
              <Link to="#" className="text-gray-300 hover:text-white">
                Free eBooks
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white">
                Development Tutorial
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white">
                How to - Blog
              </Link>
            </li>
            <li>
              <Link to="#" className="text-gray-300 hover:text-white">
                Youtube Playlist
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-bold mb-4 uppercase">Newsletter</h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full rounded-lg border border-gray-400 bg-transparent block pl-10 p-2.5"
            />
          </div>
          <button className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Subscribe Now
          </button>
        </div>
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center my-20 px-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-10">
          <div className="flex space-x-4 lg:space-x-10 mb-4 lg:mb-0">
            <Link to="#" className="hover:text-gray-400 text-white">
              <FaTwitter className="text-2xl" />
            </Link>
            <Link to="#" className="hover:text-gray-400 text-white">
              <FaFacebookF className="text-2xl" />
            </Link>
            <Link to="#" className="hover:text-gray-400 text-white">
              <FaInstagram className="text-2xl" />
            </Link>
            <Link to="#" className="hover:text-gray-400 text-white">
              <FaGithub className="text-2xl" />
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
            <Link to="#" className="text-gray-300 hover:text-white">
              About us
            </Link>
            <Link to="#" className="text-gray-300 hover:text-white">
              Contact
            </Link>
            <Link to="#" className="text-gray-300 hover:text-white">
              Privacy policy
            </Link>
            <Link to="#" className="text-gray-300 hover:text-white">
              Sitemap
            </Link>
            <Link to="#" className="text-gray-300 hover:text-white">
              Terms of Use
            </Link>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-8 lg:mt-0">
          © 2024, All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;