import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, AtSign, Lock } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);




  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!username.trim()) errs.username = "Username is required";
    if (!email.includes("@")) errs.email = "Invalid email";
    if (password.length < 6) errs.password = "Minimum 6 characters";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        { fullName, username, email, password }
      );

      console.log("Register success:", data);
      localStorage.setItem("token", data.data.accessToken)
      localStorage.setItem("username", data.data.username)

      toast.success("Account created")
      navigate("/");
    }
    catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed")
      setErrors({
        server: err.response?.data?.message || "Registration failed",
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-1 text-white">Create Account</h2>
        <p className="text-gray-400 mb-6">
          Join the community and start writing your first post.
        </p>

        {errors.server && (
          <div className="mb-4 text-red-400 text-sm">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div className="relative">
            <User className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-gray-800 text-white pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-gray-800 text-white pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <AtSign className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-gray-800 text-white pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-gray-800 text-white pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
