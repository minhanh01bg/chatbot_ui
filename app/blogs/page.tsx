"use client"

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Star,
  Sparkles,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Zap,
  Target,
  Award
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CustomDropdown } from "@/components/ui/custom-dropdown";

// Enhanced mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "The Future of AI Chatbots: What to Expect in 2024",
    excerpt: "Discover the latest trends and innovations in AI chatbot technology that will shape the future of customer service and business communication.",
    author: "AI Team",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "AI Trends",
    slug: "future-of-ai-chatbots-2024",
    image: "/images/blog-ai-future.jpg",
    featured: true,
    views: 12450,
    rating: 4.8,
    tags: ["AI", "Chatbots", "Technology", "Future"]
  },
  {
    id: 2,
    title: "How to Build Your First AI Chatbot: A Complete Guide",
    excerpt: "Step-by-step tutorial on creating your first AI chatbot using modern technologies and best practices for optimal user experience.",
    author: "Developer Team",
    date: "2024-01-10",
    readTime: "8 min read",
    category: "Tutorial",
    slug: "build-first-ai-chatbot-guide",
    image: "/images/blog-tutorial.jpg",
    featured: false,
    views: 8920,
    rating: 4.9,
    tags: ["Tutorial", "Development", "AI", "Guide"]
  },
  {
    id: 3,
    title: "10 Ways AI Chatbots Are Transforming Customer Service",
    excerpt: "Explore how AI chatbots are revolutionizing customer service across industries, from retail to healthcare and beyond.",
    author: "Customer Success",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Case Studies",
    slug: "ai-chatbots-customer-service",
    image: "/images/blog-customer-service.jpg",
    featured: true,
    views: 15680,
    rating: 4.7,
    tags: ["Customer Service", "AI", "Business", "Transformation"]
  },
  {
    id: 4,
    title: "Understanding Natural Language Processing in Chatbots",
    excerpt: "Deep dive into how NLP works in modern chatbots and how it enables more human-like conversations.",
    author: "AI Research",
    date: "2024-01-01",
    readTime: "7 min read",
    category: "Technical",
    slug: "nlp-chatbots-explained",
    image: "/images/blog-nlp.jpg",
    featured: false,
    views: 7340,
    rating: 4.6,
    tags: ["NLP", "Technical", "AI", "Machine Learning"]
  },
  {
    id: 5,
    title: "ChatAI Pro vs. Traditional Chatbots: A Comparison",
    excerpt: "See how ChatAI Pro's advanced features compare to traditional chatbot solutions and why it's the better choice.",
    author: "Product Team",
    date: "2023-12-28",
    readTime: "4 min read",
    category: "Product",
    slug: "chatai-pro-vs-traditional",
    image: "/images/blog-comparison.jpg",
    featured: false,
    views: 11230,
    rating: 4.8,
    tags: ["Comparison", "Product", "AI", "Features"]
  },
  {
    id: 6,
    title: "Best Practices for Training Your AI Chatbot",
    excerpt: "Learn the essential tips and techniques for training your AI chatbot to provide accurate and helpful responses.",
    author: "AI Training",
    date: "2023-12-20",
    readTime: "9 min read",
    category: "Tutorial",
    slug: "ai-chatbot-training-best-practices",
    image: "/images/blog-training.jpg",
    featured: false,
    views: 6780,
    rating: 4.5,
    tags: ["Training", "Best Practices", "AI", "Tutorial"]
  },
  {
    id: 7,
    title: "The Psychology Behind Effective Chatbot Conversations",
    excerpt: "Understanding human psychology to create more engaging and effective chatbot interactions.",
    author: "UX Research",
    date: "2023-12-15",
    readTime: "6 min read",
    category: "Technical",
    slug: "psychology-chatbot-conversations",
    image: "/images/blog-psychology.jpg",
    featured: false,
    views: 5430,
    rating: 4.4,
    tags: ["Psychology", "UX", "Conversation", "Human Behavior"]
  },
  {
    id: 8,
    title: "Chatbot Analytics: Measuring Success and ROI",
    excerpt: "Learn how to track and measure the success of your chatbot implementation with key metrics and analytics.",
    author: "Analytics Team",
    date: "2023-12-10",
    readTime: "7 min read",
    category: "Case Studies",
    slug: "chatbot-analytics-measuring-success",
    image: "/images/blog-analytics.jpg",
    featured: false,
    views: 4560,
    rating: 4.3,
    tags: ["Analytics", "ROI", "Metrics", "Business"]
  }
];

const categories = [
  { name: "All", count: blogPosts.length, icon: <BookOpen className="w-4 h-4" /> },
  { name: "AI Trends", count: blogPosts.filter(p => p.category === "AI Trends").length, icon: <TrendingUp className="w-4 h-4" /> },
  { name: "Tutorial", count: blogPosts.filter(p => p.category === "Tutorial").length, icon: <Zap className="w-4 h-4" /> },
  { name: "Case Studies", count: blogPosts.filter(p => p.category === "Case Studies").length, icon: <Target className="w-4 h-4" /> },
  { name: "Technical", count: blogPosts.filter(p => p.category === "Technical").length, icon: <Award className="w-4 h-4" /> },
  { name: "Product", count: blogPosts.filter(p => p.category === "Product").length, icon: <Star className="w-4 h-4" /> }
];

const ITEMS_PER_PAGE = 6;

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date"); // date, views, rating

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views;
        case "rating":
          return b.rating - a.rating;
        case "date":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar variant="blog" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full mb-8"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-medium">Latest AI Insights & Tutorials</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold mb-6"
            >
              Discover the Future of{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                AI Chatbots
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Explore cutting-edge insights, tutorials, and case studies about AI chatbots, 
              machine learning, and the future of conversational technology.
            </motion.p>
            
            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search articles, tutorials, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center">
                <Star className="w-10 h-10 text-yellow-500 mr-4" />
                Featured Articles
              </h2>
              <p className="text-gray-400 text-center text-lg">Handpicked content you don't want to miss</p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 group-hover:scale-110 transition-transform duration-500" />
                      <div className="relative z-10 w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <Tag className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold border border-purple-500/30">
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="text-sm font-medium text-white">{post.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-3xl font-bold mb-4 group-hover:text-purple-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Eye className="w-4 h-4" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Heart className="w-4 h-4" />
                            <span>Like</span>
                          </div>
                        </div>
                        
                        <Link
                          href={`/blogs/${post.slug}`}
                          className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors group-hover:translate-x-1 transform duration-200"
                        >
                          <span>Read Full Article</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Filters and Controls */}
      <section className="py-12 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-2 group ${
                    selectedCategory === category.name
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "bg-white/10 backdrop-blur-xl text-gray-300 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.name 
                      ? "bg-white/20" 
                      : "bg-white/10"
                  }`}>
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Sort by:</span>
              </div>
              <CustomDropdown
                options={[
                  { value: "date", label: "Latest", icon: <Clock className="w-4 h-4" /> },
                  { value: "views", label: "Most Popular", icon: <TrendingUp className="w-4 h-4" /> },
                  { value: "rating", label: "Highest Rated", icon: <Star className="w-4 h-4" /> }
                ]}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Sort by..."
                className="w-48"
              />
            </div>
          </div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-gray-400"
          >
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} articles
          </motion.div>
        </div>
      </section>

      {/* Enhanced Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {paginatedPosts.length > 0 ? (
              <motion.div
                key={`${selectedCategory}-${currentPage}-${sortBy}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {paginatedPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                      <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10 w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Tag className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30">
                            {post.category}
                          </span>
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-xs font-medium text-white">{post.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Eye className="w-4 h-4" />
                              <span>{post.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                              <Heart className="w-4 h-4" />
                              <span>Like</span>
                            </div>
                          </div>
                          
                          <Link
                            href={`/blogs/${post.slug}`}
                            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium transition-colors group-hover:translate-x-1 transform duration-200"
                          >
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">No articles found</h3>
                <p className="text-gray-400 mb-8 text-lg">
                  Try adjusting your search or filter criteria
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setCurrentPage(1);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center space-x-3 mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {page}
                </motion.button>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="relative py-24 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-xl border-t border-white/10 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full mb-8"
            >
              <BookOpen className="w-5 h-5 text-purple-300" />
              <span className="text-purple-300 font-medium">Stay Updated</span>
            </motion.div>
            
            <h2 className="text-5xl font-bold text-white mb-6">
              Never Miss an AI Insight
            </h2>
            
            <p className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Get the latest articles, tutorials, and AI chatbot news delivered to your inbox. 
              Join thousands of developers and AI enthusiasts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </motion.button>
            </div>
            
            <p className="text-sm text-purple-300 mt-6">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
} 