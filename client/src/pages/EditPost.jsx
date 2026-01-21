import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Loader2 } from "lucide-react";




const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  // Protect route
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);




  // Load existing post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setFetching(true);
        const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("posts:  ", data.data.data)
        setTitle(data.data.data.title || "");
        setImageURL(data.data.data.imageUrl || "");
        setContent(data.data.data.content || "");
      }
      catch (err) {
        console.log(err);
        toast.error("Could not load post");
        navigate("/");
      }
      finally {
        setFetching(false);
      }
    };

    fetchPost();
  }, [id, token, navigate]);



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
      toast.loading("Updating post...");

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`,
        { title, imageUrl: imageURL, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss();
      toast.success("Post updated!");
      navigate(`/posts/${id}`);
    }
    catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.error?.message);
      setErrors({ server: err.response?.data?.error?.message });
    }
    finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-300">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-gray-800 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Edit Post</h2>
            <p className="text-gray-400">Make your changes and save them.</p>
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
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400?text=Invalid+Image";
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="relative">
            <textarea
              placeholder="Enter Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-gray-800 text-white min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil size={18} />
                  Update Post
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 p-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition text-white font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;