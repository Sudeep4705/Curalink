import { useContext, useState, useRef } from "react";
import { AuthContext } from "../Context/Context";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Paperclip,FlaskConical} from "lucide-react";

const GREETING = (() => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; 
  const istTime = new Date(now.getTime() + istOffset - (now.getTimezoneOffset() * 60 * 1000));
  const h = istTime.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
})();

function OrbBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, #86efac 0%, #4ade80 30%, #bbf7d0 60%, transparent 80%)",
          filter: "blur(64px)",
          opacity: 0.45,
        }}
        animate={{ scale: [1, 1.08, 1], y: [0, 18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[260px] h-[260px] rounded-full"
        style={{
          background: "radial-gradient(circle at 60% 30%, #ffffff 0%, #d1fae5 40%, transparent 70%)",
          filter: "blur(20px)",
          opacity: 0.6,
        }}
        animate={{ scale: [1, 1.05, 1], y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}

function AnimatedOrb() {
  return (
    <motion.div
      className="relative mx-auto mb-5"
      style={{ width: 76, height: 76 }}
      animate={{ y: [0, -9, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="w-full h-full rounded-full shadow-xl"
        style={{
          background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #86efac 30%, #22c55e 70%, #15803d 100%)",
          boxShadow: "0 8px 40px 0 #22c55e55, 0 2px 8px 0 #15803d33",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export default function Chatbot() {
  const { User, setUser } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const handleLogout = async () => {
    try {
      const res = await axios.get("https://curalink-xe7y.onrender.com/auth/logout", { withCredentials: true });
      setUser(null);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleClick = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await axios.get(`https://curalink-xe7y.onrender.com/med/search/${query}`, { withCredentials: true });
      setResults((prev)=>[
        ...prev,
        {type:"user",text:query},
        {type:"bot",text:res.data.summary,
          papers:res.data.papers,
          trials:res.data.trials
        }
      ]);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-white via-green-50 to-white flex flex-col overflow-hidden">
      <OrbBackground />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 py-3"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #22c55e 0%, #86efac 100%)",
              boxShadow: "0 2px 8px #22c55e44",
            }}
          />
          <span className="font-bold text-gray-900 text-lg tracking-tight">CurALink</span>
        </div>

        <div className="flex items-center gap-2">
          {User ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-full shadow transition-all"
            >
              Logout
            </motion.button>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login" className="px-4 py-1.5 text-sm font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition-all">
                  Sign In
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="px-4 py-1.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-full shadow transition-all">
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow ml-1">
            {User?.username?.[0]?.toUpperCase() || "?"}
          </div>
        </div>
      </motion.nav>

      {/* Main */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <AnimatedOrb />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55, ease: "easeOut" }}
          className="text-center mb-2"
        >
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            {GREETING}, {User?.username || "there"}
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            Can I help you with anything?
          </h2>
          <p className="text-sm text-gray-500 mt-3">
            Write your query below and let CurALink help you
          </p>
        </motion.div>

        {/* Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease: "easeOut" }}
          className="mt-8 w-full max-w-2xl"
        >
          <div
            className="relative bg-white/80 border border-green-100 rounded-3xl shadow-lg px-5 pt-4 pb-3 focus-within:border-green-300 transition-all"
            style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 32px 0 #22c55e18" }}
          >
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="How can CurALink help you today?"
              className="w-full bg-transparent text-gray-800 text-sm placeholder-gray-400 resize-none outline-none leading-relaxed"
            />
            <div className="flex items-center justify-end mt-2">
              <AnimatePresence>
                {query.trim() && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClick}
                    disabled={loading}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white font-bold shadow-md transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="inline-block text-xs"
                      >
                        ⟳
                      </motion.span>
                    ) : "↑"}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between items-center px-1 mt-2">
            <p className="text-xs text-gray-400">
              CurALink can make mistakes. Please double-check responses.
            </p>
            <p className="text-xs text-gray-400 hidden sm:block">
              Use <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">shift + return</kbd> for new line
            </p>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4 }}
              className="mt-6 w-full max-w-2xl flex flex-col gap-3"
            >
            {results.map((msg, i) => (
  <motion.div
    key={i}
    className={`px-5 py-4 text-sm rounded-2xl shadow-sm ${
      msg.type === "user"
        ? "bg-green-100 text-right"
        : "bg-white/80 border border-green-100 text-gray-700"
    }`}
  >
    {msg.type === "user" ? (
      <p>{msg.text}</p>
    ) : (
      <>
       <ReactMarkdown
        components={{
          h2: ({node, ...props}) => (
            <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
          ),
          li: ({node, ...props}) => (
            <li className="ml-4 list-disc" {...props} />
          )
        }}
      >
        {msg.text}
      </ReactMarkdown>
        <div className="mt-4">
      <h3 className="font-semibold flex items-center gap-2 text-green-700 mb-2"><Paperclip /> Top Papers</h3>

      {msg.papers?.map((paper, i) => (
        <div key={i} className="mb-2 text-sm">
              <a 
      href={paper.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="font-medium text-blue-600 hover:underline"
    >
      {paper.title}
    </a>

    <p className="text-xs text-gray-500">
      {paper.authors?.slice(0, 3).join(", ")} • {paper.year} • {paper.source}
    </p>
        </div>
      ))}
    </div>
        <div className="mt-4">
      <h3 className="font-semibold flex items-center gap-2 text-green-700 mb-2"><FlaskConical /> Clinical Trials</h3>

      {msg.trials?.map((trial, i) => (
  <div key={i} className="mb-3">
    <p className="font-medium">{trial.title}</p>
    
    <p className="text-xs text-gray-500">
      Status: {trial.status}
    </p>

    <p className="text-xs text-gray-500">
      Location: {trial.location}
    </p>
  </div>
))}
    </div>
      </>
     
      
    )}
  </motion.div>
))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}