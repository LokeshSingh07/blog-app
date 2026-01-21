import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Edit2, Trash2 } from "lucide-react";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
    
  // protected route
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  },[]);



  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/ownerPosts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response.data)

        setPosts(response.data.data);
        setLoading(false);
      }
      catch (error) {
        setLoading(false);
        console.error("Error fetching posts:", error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchMyPosts();
    
  }, [navigate])




  const handleDelete = async (postId) => {

    const previousPosts = posts;
    setPosts(posts.filter((p) => p._id !== postId));

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Post deleted successfully");
    }
    catch(err) {
      setPosts(previousPosts);
      console.error("Delete error:", err);
    }
  };


  

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-40 bg-gray-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Posts</h1>
          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition"
          >
            Create New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-slate-900 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-gray-300 mb-2">No posts yet.</p>
            <Link to="/create" className="text-blue-400 hover:underline">
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-slate-900 border border-gray-800 rounded-2xl p-5 hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-300 line-clamp-3">{post.content}</p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex gap-2">
                    <Link
                      to={`/edit/${post._id}`}
                      className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;