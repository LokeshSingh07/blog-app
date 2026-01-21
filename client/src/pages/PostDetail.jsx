import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  // open route
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/", { replace: true });
  //   }
  // }, [token, navigate]);
    

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`,
          { 
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
          }  
        );

        console.log("response : ", response);

        setPost(response.data.data);
      }
      catch(err){
        console.error('Error fetching post:', err);
        setError(
          err.response?.data?.message ||
          'Failed to load post. It may have been deleted or you lack permission.'
        );
      }
      finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  

  const estimateReadingTime = (content) => {
    if (!content) return 0;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / 225);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4">Oops...</h1>
        <p className="text-gray-300 mb-8 text-center max-w-md">{error || "Post not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const readingTime = estimateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-8 transition cursor-pointer"
        >
            <ArrowLeft className="w-5 h-5" />
            Back to feed
        </button>

        {/* Hero Image */}
        {post?.imageUrl && (
          <div className="relative rounded-2xl overflow-hidden mb-10 shadow-2xl">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>
        )}

        {/* Title & Meta */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-10">
          <span>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span>•</span>
          <span>{post.username || 'Anonymous'}</span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          {post?.content?.split('\n')?.map((paragraph, idx) => (
            <p key={idx} className="mb-2 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>


        {/* Footer => Back */}
        <div className="mt-16 pt-10 border-t border-gray-800 text-center">
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to all posts
            </Link>
        </div>

      </div>
    </div>
  );
}