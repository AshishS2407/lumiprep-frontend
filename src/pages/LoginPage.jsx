import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaGithub, FaFacebook, FaBars } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "user") {
        navigate("/dashboard");
      } else {
        setError("Access denied. Unknown role.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-white to-blue-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 md:px-10">
        <h1 className="text-xl md:text-2xl font-bold">
          <span className="text-purple-500">Lumi</span>{" "}
          <span className="text-gray-700">Prep</span>
        </h1>
        {/* <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="text-purple-500 text-2xl" />
          </button>
        </div>
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium items-center">
          <a href="#" className="hover:text-purple-600">Practice</a>
          <a href="#" className="hover:text-purple-600">Explore</a>
          <a href="#" className="text-purple-500">Login</a>
          <button
            className="block w-full text-white px-4 py-2 rounded-full transition-all duration-300 ease-in-out"
            style={{
              background: 'linear-gradient(to right, #B23DEB, #DE8FFF)',
            }}
          >
            Sign Up
          </button>
        </div> */}
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-2 space-y-2 text-gray-700">
          <a href="#" className="block hover:text-purple-500">Practice</a>
          <a href="#" className="block hover:text-purple-500">Explore</a>
          <a href="#" className="block text-purple-500">Login</a>
          <button
            className="block text-white px-4 py-2 rounded-full transition-all duration-300 ease-in-out"
            style={{
              background: 'linear-gradient(to right, #B23DEB, #DE8FFF)',
            }}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Responsive Container */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center h-[calc(100vh-80px)] px-4 md:px-10">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center h-1/2 lg:h-full mt-2 lg:mt-10 md:mt-1">
          <img
            src="/manBook.png"
            alt="Student"
            className="max-h-full w-auto object-contain"
          />
        </div>

        {/* Login Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center h-1/2 lg:h-full md:mt-14 mt-28">
          <div className="bg-white/90 w-[90%] max-w-[450px] rounded-3xl shadow-lg p-4 md:p-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-purple-600 mb-6">
                <span className="text-purple-600">Lumi</span>{" "}
                <span className="text-gray-700">Prep</span>
              </h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <input
                type="email"
                placeholder="Mail id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-400 text-sm"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-400 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full text-white font-semibold py-3 rounded-full hover:opacity-90 transition-all duration-300 ease-in-out"
                style={{
                  background: 'linear-gradient(to right, #B23DEB, #DE8FFF)',
                }}
              >
                Log In
              </button>

              {/* <div className="flex justify-between text-xs mt-2 md:mt-6">
                <a href="#" className="text-gray-500 hover:text-purple-600">
                  Forget Password?
                </a>
                <a href="#" className="text-purple-600 font-semibold">
                  Sign Up
                </a>
              </div> */}
            </form>

            {/* <div className="mt-6 text-center text-sm text-gray-500 md:mt-8">
              Or you can Signup with
            </div>
            <div className="flex justify-center mt-3 space-x-4 text-xl md:mt-6">
              <FaGoogle className="text-gray-600 hover:text-red-500 cursor-pointer" />
              <FaGithub className="text-gray-600 hover:text-black cursor-pointer" />
              <FaFacebook className="text-gray-600 hover:text-blue-600 cursor-pointer" />
            </div> */}

            <p className="mt-6 text-xs text-gray-400 text-center md:mt-10">
              For any issues, please reach out to <span className="underline">KnowLumi support</span>.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
