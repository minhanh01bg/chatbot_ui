"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check, Star, ArrowRight, Zap, Shield, Users, Globe, MessageSquare, Bot, Sparkles } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-semibold">AI-Powered Conversations</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Experience the Future of
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> AI Chat</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your conversations with our advanced AI chatbot. Get instant, intelligent responses 
                that understand context, learn from interactions, and provide human-like conversations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/chat"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Start Chatting</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/plans"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-all"
                >
                  View Plans
                </Link>
              </div>
              <div className="flex items-center space-x-6 mt-8">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">10,000+ users</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-700">Hello! How can I help you today?</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-white">I need help with my project</p>
                    </div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-700">I'd be happy to help! What kind of project are you working on?</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Conversations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the next generation of AI chat with advanced features designed to enhance your productivity and creativity.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Get instant responses with our optimized AI models that process requests in milliseconds.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise Security",
                description: "Bank-level encryption and privacy protection ensure your conversations remain confidential.",
                color: "from-green-400 to-blue-500"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Multi-Language Support",
                description: "Communicate in over 50 languages with native-level understanding and responses.",
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Context Awareness",
                description: "Advanced context understanding maintains conversation flow and remembers previous interactions.",
                color: "from-blue-400 to-cyan-500"
              },
              {
                icon: <Bot className="w-8 h-8" />,
                title: "Custom AI Models",
                description: "Train and deploy custom AI models tailored to your specific business needs and industry.",
                color: "from-indigo-400 to-purple-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description: "Share conversations, collaborate with team members, and manage access permissions easily.",
                color: "from-red-400 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10M+", label: "Conversations" },
              { number: "50+", label: "Languages" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-white"
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-purple-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with our free tier and scale up as your needs grow. All plans include our core AI features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for individuals and small projects",
                features: [
                  "100 conversations per month",
                  "Basic AI models",
                  "Email support",
                  "Standard response time"
                ],
                button: "Get Started",
                popular: false
              },
              {
                name: "Pro",
                price: "$29",
                period: "/month",
                description: "Ideal for professionals and growing teams",
                features: [
                  "Unlimited conversations",
                  "Advanced AI models",
                  "Priority support",
                  "Custom integrations",
                  "Analytics dashboard"
                ],
                button: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations with specific needs",
                features: [
                  "Custom AI model training",
                  "Dedicated support",
                  "SLA guarantees",
                  "Advanced security",
                  "White-label options"
                ],
                button: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-xl p-8 shadow-lg border-2 ${
                  plan.popular ? 'border-purple-500 relative' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === "Starter" ? "/register" : "/plans"}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.button}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Users Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about their experience with ChatAI Pro.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Product Manager",
                company: "TechCorp",
                content: "ChatAI Pro has revolutionized how we handle customer support. The AI responses are incredibly accurate and our response times have improved by 80%.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Developer",
                company: "StartupXYZ",
                content: "The custom AI model training feature is game-changing. We've been able to create specialized chatbots for different departments with amazing results.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Marketing Director",
                company: "GlobalBrand",
                content: "The multi-language support is fantastic. We can now serve customers in their native language, which has significantly improved our customer satisfaction scores.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role} at {testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Conversations?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already experiencing the future of AI-powered conversations. 
              Start your free trial today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/chat"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all"
              >
                Try Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
