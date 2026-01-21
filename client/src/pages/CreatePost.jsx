import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus, CheckCircle } from "lucide-react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  // protected route
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);
  
  


  const validate = () => {
    const errs = {};
    if (title.length < 5 || title.length > 120) errs.title = "Title 5-120 chars";
    if (content.length < 50) errs.content = "Content min 50 chars";
    if (imageURL && !/^https?:\/\/.+/.test(imageURL)) errs.imageURL = "Invalid URL";
    return errs;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    try {
      setLoading(true);
      toast.loading("Creating...");

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/posts`,
        { title, imageUrl:imageURL, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss();
      toast.success("Post created!");
      navigate("/");
    }
    catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.error?.message || "Error");
      setErrors({ server: err.response?.data?.error?.message });
    }
    finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-gray-800 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Create New Post</h2>
            <p className="text-gray-400">
              Write something amazing and share it with the world.
            </p>
          </div>
        </div>

        {errors.server && (
          <div className="mb-4 text-red-400 text-sm">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="relative">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="relative">
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.imageURL && (
              <p className="text-red-400 text-sm mt-1">{errors.imageURL}</p>
            )}
          </div>

          {/* Image Preview */}
          {imageURL && /^https?:\/\/.+/.test(imageURL) && (
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <img
                src={imageURL}
                alt="preview"
                className="w-full h-60 object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="relative">
            <textarea
              placeholder="Enter Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-gray-800 text-white min-h-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
          >
            {loading ? (
              <>
                <ImagePlus size={18} />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Create Post
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
