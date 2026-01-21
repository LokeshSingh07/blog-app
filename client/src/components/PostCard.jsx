import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const thumbnailBg = post.imageUrl
    ? `url(${post.imageUrl})`
    : "url('https://images.unsplash.com/photo-1557682224-5b8590cd9ec5')";

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-2xl p-5 hover:shadow-xl hover:border-blue-500 transition duration-200">
      {/* Thumbnail */}
      <div
        className="h-40 rounded-xl mb-4 overflow-hidden bg-cover bg-center relative"
        style={{
          backgroundImage: thumbnailBg,
          backgroundBlendMode: post.imageUrl ? "multiply" : "normal",
        }}
      >
        {post.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>

      <p className="text-gray-300 line-clamp-3">{post.content}</p>


      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-400">
            {post.author || post.username || "Unknown Author"}
          </span>
        </div>


        <Link
          to={`/posts/${post._id}`}
          className="text-sm inline-flex items-center justify-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-medium group"
        >
          <span>Read more</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
}