"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { 
  Check, 
  Star, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  Globe, 
  MessageSquare, 
  Bot, 
  Sparkles,
  Play,
  ChevronDown,
  Rocket,
  Brain,
  Lock,
  Cpu,
  Eye,
  Heart,
  TrendingUp,
  Award,
  Clock,
  Target
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-dark">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full mb-8">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-medium">Next-Generation AI Chat Platform</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl lg:text-8xl font-bold mb-6"
          >
            Experience the Future of{" "}
            <span className="gradient-text">
              AI Conversations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Transform your digital interactions with our cutting-edge AI chatbot. Experience human-like conversations, instant responses, and intelligent context understanding that adapts to your needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-1"
            >
              <Link
                href="/chat"
                className="flex items-center space-x-3 text-white font-semibold text-lg px-8 py-4 bg-black/20 backdrop-blur-xl rounded-lg"
              >
                <Rocket className="w-6 h-6" />
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl"
            >
              <Link
                href="/plans"
                className="flex items-center space-x-3 text-white font-semibold text-lg px-8 py-4"
              >
                <Play className="w-6 h-6" />
                <span>Watch Demo</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center justify-center space-x-8 text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border-2 border-white/20"
                  />
                ))}
              </div>
              <span className="text-sm">50,000+ users worldwide</span>
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.5 + i * 0.1, type: "spring" }}
                >
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </motion.div>
              ))}
              <span className="text-sm ml-2">4.9/5 rating</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">Revolutionary Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the advanced capabilities that make our AI chatbot the most intelligent and responsive platform available.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Advanced AI Intelligence",
                description: "Powered by cutting-edge machine learning models that understand context, emotions, and intent with remarkable accuracy.",
                gradient: "from-purple-600 to-pink-600",
                delay: 0.1
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast Responses",
                description: "Experience near-instant responses with our optimized AI infrastructure that processes requests in milliseconds.",
                gradient: "from-yellow-500 to-orange-500",
                delay: 0.2
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise Security",
                description: "Bank-level encryption and privacy protection ensure your conversations remain completely confidential and secure.",
                gradient: "from-green-500 to-blue-500",
                delay: 0.3
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Multi-Language Support",
                description: "Communicate seamlessly in over 50 languages with native-level understanding and culturally appropriate responses.",
                gradient: "from-blue-500 to-cyan-500",
                delay: 0.4
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: "Custom AI Models",
                description: "Train and deploy specialized AI models tailored to your specific business needs and industry requirements.",
                gradient: "from-indigo-500 to-purple-500",
                delay: 0.5
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description: "Advanced team features including conversation sharing, collaborative training, and role-based access control.",
                gradient: "from-red-500 to-pink-500",
                delay: 0.6
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative py-32 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6">See It In Action</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience the power of our AI chatbot with this interactive demonstration. Watch as it understands context, provides intelligent responses, and adapts to your conversation style.
              </p>
              
              <div className="space-y-6">
                {[
                  "Real-time conversation processing",
                  "Context-aware responses",
                  "Multi-language understanding",
                  "Emotional intelligence"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-800/50 rounded-2xl p-4 max-w-xs">
                      <p className="text-white">Hello! I'm your AI assistant. How can I help you today?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 }}
                    className="flex items-start space-x-3 justify-end"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 max-w-xs">
                      <p className="text-white">I need help with my project</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-800/50 rounded-2xl p-4 max-w-xs">
                      <p className="text-white">I'd be happy to help! What kind of project are you working on? I can assist with coding, design, research, and much more.</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "10M+", label: "Conversations", icon: <MessageSquare className="w-8 h-8" /> },
              { number: "50+", label: "Languages", icon: <Globe className="w-8 h-8" /> },
              { number: "99.9%", label: "Uptime", icon: <Clock className="w-8 h-8" /> },
              { number: "24/7", label: "Support", icon: <Heart className="w-8 h-8" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8">
              Ready to Transform Your Conversations?
            </h2>
            
            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto">
              Join thousands of users who are already experiencing the future of AI-powered conversations. Start your free trial today and see the difference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 rounded-xl p-1"
              >
                <Link
                  href="/register"
                  className="flex items-center space-x-3 font-semibold text-lg px-8 py-4 bg-black/20 backdrop-blur-xl rounded-lg"
                >
                  <Rocket className="w-6 h-6" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl"
              >
                <Link
                  href="/chat"
                  className="flex items-center space-x-3 text-white font-semibold text-lg px-8 py-4"
                >
                  <Play className="w-6 h-6" />
                  <span>Try Demo Now</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
