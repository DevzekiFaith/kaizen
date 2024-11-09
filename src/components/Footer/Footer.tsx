// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Import social media icons

export const Footer = () => {
  return (
    <div className="bg-black p-6 text-center mt-[2rem]">
      <div>
        <h1 className="text-xl font-bold">Welcome!</h1>
      </div>
      <div className="mt-4">
        {/* <p className="text-gray-700">
          Contact us:{" "}
          <a
            href="mailto:contact@example.com"
            className="text-slate-500 hover:underline"
          >
            unovaconsultingfirstafrica@gmail.com
          </a>
        </p>
        <p className="text-gray-600">
          Phone: <span className="text-orange-400">+(234) 7014441418</span>
        </p> */}
        <p className="text-gray-600">
          © {new Date().getFullYear()} Yonan Technologies. All rights reserved.
        </p>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Follow Us</h2>
        {/* <div className="flex justify-center space-x-4 mt-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Facebook"
          >
            <FaFacebook className="text-orange-600 hover:text-blue-900" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Twitter"
          >
            <FaTwitter className="text-orange-700 hover:text-blue-900" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Instagram"
          >
            <FaInstagram className="text-orange-500 hover:text-blue-900" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on LinkedIn"
          >
            <FaLinkedin className="text-orange-700 hover:text-blue-900" />
          </a>
        </div> */}
        {/* <div className="mt-4">
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <div className="flex justify-center space-x-4 mt-2">
            <a
              href="https://wa.me/2347014441418" // WhatsApp direct link
              target="_blank"
              rel="noopener noreferrer"
              title="Message us on WhatsApp"
              className="text-orange-500 hover:text-blue-800"
            >
              WhatsApp Us
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
};
