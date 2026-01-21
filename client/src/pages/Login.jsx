import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  // public route
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const errs = {};
    if (!email.includes("@")) errs.email = "Invalid email";
    if (password.length < 6) errs.password = "Minimum 6 characters";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        { email, password }
      );

      // console.log("Login success:", data.data);
      localStorage.setItem("token", data.data.accessToken)
      localStorage.setItem("username", data.data.username)

      toast.success("Login successfully")
      navigate("/");
    }
    catch (err) {
      toast.error(err.response?.data?.message || "Login failed")
      setErrors({
        server: err.response?.data?.message || "Login failed",
      });
    }
    finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>

        {errors.server && (
          <div className="mb-4 text-red-400 text-sm">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
