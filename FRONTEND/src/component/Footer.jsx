
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FaLinkedin, FaInstagram, FaGithub, FaEnvelope } from "react-icons/fa";

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-black text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Logo + Description */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 border border-gray-700 rounded-lg shadow-sm" />
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">V-LMS</h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            A next-generation AI-powered learning platform designed by <span className="text-white font-bold italic">Vibhu Suneja</span> to help you grow smarter. 
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em]">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("/allcourses")}>Explore Courses</li>
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("/about")}>About Us</li>
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("/login")}>Login / Sign Up</li>
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("/profile")}>My Profile</li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em]">Connect With Me</h3>
          <div className="flex flex-col gap-3">
            <a href="mailto:vibhusun01@gmail.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
              <FaEnvelope className="text-red-500" /> vibhusun01@gmail.com
            </a>
            <div className="flex gap-4 mt-2">
              <a href="https://www.linkedin.com/in/vibhusuneja08?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                <FaLinkedin size={20} />
              </a>
              <a href="https://www.instagram.com/o_.vibhu._o?igsh=enFnaGNuNDQ5OWpo" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 rounded-full hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1">
                <FaInstagram size={20} />
              </a>
              <a href="https://github.com/VibhuSuneja" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 rounded-full hover:bg-gray-700 hover:text-white transition-all transform hover:-translate-y-1">
                <FaGithub size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em]">About Platform</h3>
          <p className="text-xs text-gray-500 italic leading-relaxed">
            Crafted with precision for Major Project 2026. This platform integrates AI, Real-time collaboration, and Modern UX to redefine learning.
          </p>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-[0.2em]">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("/terms")}>Terms & Conditions</li>
            <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("/privacy")}>Privacy Policy</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900 mt-12 pt-8 text-[11px] text-center text-gray-600 uppercase tracking-widest">
        © {new Date().getFullYear()} Vibhu Suneja. All rights reserved. 
      </div>
    </footer>
  );
}

export default Footer;
