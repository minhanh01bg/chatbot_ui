"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Mock data for blog post
const blogPost = {
  title: "The Future of AI Chatbots: What to Expect in 2024",
  excerpt: "Discover the latest trends and innovations in AI chatbot technology that will shape the future of customer service and business communication.",
  content: `
    <p class="mb-6 text-lg text-gray-700 leading-relaxed">
      As we move into 2024, the landscape of AI chatbots is evolving at an unprecedented pace. 
      The convergence of advanced natural language processing, machine learning, and conversational AI 
      is creating opportunities that were unimaginable just a few years ago.
    </p>

    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Multimodal AI Integration</h2>
    <p class="mb-6 text-gray-700 leading-relaxed">
      The most significant trend we're seeing is the integration of multimodal AI capabilities. 
      Modern chatbots are no longer limited to text-based interactions. They can now process and 
      respond to images, voice, and even video inputs, making them more human-like than ever before.
    </p>

    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Emotional Intelligence</h2>
    <p class="mb-6 text-gray-700 leading-relaxed">
      AI chatbots are becoming increasingly sophisticated in understanding and responding to human emotions. 
      Through advanced sentiment analysis and emotional recognition, these systems can now provide 
      more empathetic and contextually appropriate responses.
    </p>

    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Personalization at Scale</h2>
    <p class="mb-6 text-gray-700 leading-relaxed">
      One of the most exciting developments is the ability to provide highly personalized experiences 
      at scale. AI chatbots can now learn individual user preferences, behavior patterns, and 
      communication styles to deliver tailored interactions.
    </p>

    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Industry-Specific Solutions</h2>
    <p class="mb-6 text-gray-700 leading-relaxed">
      We're seeing a surge in industry-specific AI chatbot solutions. From healthcare to finance, 
      retail to education, specialized chatbots are being developed with deep domain knowledge 
      and industry-specific capabilities.
    </p>

    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Enhanced Security and Privacy</h2>
    <p class="mb-6 text-gray-700 leading-relaxed">
      With the increasing adoption of AI chatbots in sensitive industries, security and privacy 
      have become paramount. Advanced encryption, secure data handling, and compliance with 
      regulations like GDPR are now standard features.
    </p>

    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Looking Ahead</h2>
    <p class="mb-6 text-gray-700 leading-relaxed">
      The future of AI chatbots is incredibly promising. As technology continues to advance, 
      we can expect even more sophisticated capabilities, better user experiences, and broader 
      adoption across industries. The key to success will be balancing technological innovation 
      with human-centered design principles.
    </p>
  `,
  author: "AI Team",
  date: "2024-01-15",
  readTime: "5 min read",
  category: "AI Trends",
  tags: ["AI", "Chatbots", "Technology", "2024", "Innovation"]
};

const relatedPosts = [
  {
    title: "How to Build Your First AI Chatbot: A Complete Guide",
    excerpt: "Step-by-step tutorial on creating your first AI chatbot using modern technologies.",
    slug: "build-first-ai-chatbot-guide",
    category: "Tutorial"
  },
  {
    title: "Understanding Natural Language Processing in Chatbots",
    excerpt: "Deep dive into how NLP works in modern chatbots and how it enables more human-like conversations.",
    slug: "nlp-chatbots-explained",
    category: "Technical"
  },
  {
    title: "10 Ways AI Chatbots Are Transforming Customer Service",
    excerpt: "Explore how AI chatbots are revolutionizing customer service across industries.",
    slug: "ai-chatbots-customer-service",
    category: "Case Studies"
  }
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="blog" />

      {/* Article Header */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/blogs"
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>

            <div className="mb-6">
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                {blogPost.category}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {blogPost.excerpt}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{blogPost.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blogPost.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{blogPost.readTime}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Social Share */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Share:</span>
              <div className="flex space-x-2">
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Related Articles
            </h2>
            <p className="text-xl text-gray-600">
              Continue exploring the world of AI chatbots
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    <span>Read More</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
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