import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "../utils/useDebounce"


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // open route
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/", { replace: true });
  //   }
  // }, [token, navigate]);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);


  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);


      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts`,
          {
            params: { search, page, limit: 10 }, 
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("data : ", data);

        setPosts(data.data);
        setTotal(data.total || 0);
      }
      catch (err) {
        console.error("Fetch posts error:", err);
        // navigate("/login");
      }
      finally {
        setLoading(false);
      }
    };


    fetchPosts();
  }, [debouncedSearch, page, navigate]);



  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Blog Feed</h1>

          <div className="flex gap-2">
            {
              token != null ? 
              (<div className="flex items-center gap-2">
                  <Link
                    to="/create"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg  cursor-pointer"
                  >
                    Create Post
                  </Link>

                  <Link
                    to="/profile"
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg  cursor-pointer"
                    >
                    My Posts
                  </Link>

                  <button
                    onClick={()=>{
                      localStorage.removeItem("token")
                      localStorage.removeItem("username")
                      navigate('/')
                    }}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg  cursor-pointer"
                    >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg  cursor-pointer"
                  >
                    Login
                  </Link>

                </div>
              )
            }
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full mb-6 bg-slate-900 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Posts */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-slate-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400">No posts found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts?.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}


        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Prev
          </button>

          <span className="text-gray-400">
            Page <span className="text-white">{page}</span>
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * 10 >= total}
            className={`px-4 py-2 rounded-lg ${
              page * 10 >= total
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;