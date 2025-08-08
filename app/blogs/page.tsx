"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User, Tag } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Mock data for blog posts
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
    image: "/images/blog-ai-future.jpg"
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
    image: "/images/blog-tutorial.jpg"
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
    image: "/images/blog-customer-service.jpg"
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
    image: "/images/blog-nlp.jpg"
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
    image: "/images/blog-comparison.jpg"
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
    image: "/images/blog-training.jpg"
  }
];

const categories = [
  "All",
  "AI Trends",
  "Tutorial",
  "Case Studies", 
  "Technical",
  "Product"
];

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="blog" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Insights, tutorials, and updates about AI chatbots, machine learning, and the future of conversational technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  category === "All"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Tag className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with AI Insights
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Get the latest articles, tutorials, and AI chatbot news delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
              />
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
} 