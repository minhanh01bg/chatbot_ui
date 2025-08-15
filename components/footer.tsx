import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Bot, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart, 
  Sparkles,
  Zap,
  Shield,
  Globe,
  Users,
  Award
} from "lucide-react";

interface FooterProps {
  variant?: 'landing' | 'admin' | 'simple';
}

export function Footer({ variant = 'landing' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Simple footer for admin and other pages
  if (variant === 'simple') {
    return (
      <footer className="py-4 px-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm text-sm text-gray-600 text-center">
        <p>© {currentYear} ChatAI Pro. All rights reserved.</p>
      </footer>
    );
  }

  // Admin footer
  if (variant === 'admin') {
    return (
      <footer className="py-4 px-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm text-sm text-gray-600 text-center">
        <p>© {currentYear} Admin Dashboard. All rights reserved.</p>
      </footer>
    );
  }

  // Landing page footer (full version)
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features", icon: <Zap className="w-4 h-4" /> },
        { name: "Pricing", href: "#pricing", icon: <Sparkles className="w-4 h-4" /> },
        { name: "API", href: "#api", icon: <Globe className="w-4 h-4" /> },
        { name: "Documentation", href: "#docs", icon: <Award className="w-4 h-4" /> }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about", icon: <Users className="w-4 h-4" /> },
        { name: "Blog", href: "/blogs", icon: <Sparkles className="w-4 h-4" /> },
        { name: "Careers", href: "#careers", icon: <Award className="w-4 h-4" /> },
        { name: "Contact", href: "#contact", icon: <Mail className="w-4 h-4" /> }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help", icon: <Shield className="w-4 h-4" /> },
        { name: "Community", href: "#community", icon: <Users className="w-4 h-4" /> },
        { name: "Status", href: "#status", icon: <Zap className="w-4 h-4" /> },
        { name: "Security", href: "#security", icon: <Shield className="w-4 h-4" /> }
      ]
    }
  ];

  const socialLinks = [
    { name: "GitHub", href: "#", icon: <Github className="w-5 h-5" /> },
    { name: "Twitter", href: "#", icon: <Twitter className="w-5 h-5" /> },
    { name: "LinkedIn", href: "#", icon: <Linkedin className="w-5 h-5" /> },
    { name: "Email", href: "#", icon: <Mail className="w-5 h-5" /> }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Bot className="w-7 h-7 text-white" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ChatAI Pro
                </span>
              </motion.div>
              
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                The next generation of AI-powered conversations for modern businesses and individuals. 
                Experience the future of intelligent communication.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Sections */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6 text-white flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></span>
                  <span>{section.title}</span>
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: linkIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 group"
                      >
                        <span className="text-purple-400 group-hover:scale-110 transition-transform duration-200">
                          {link.icon}
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 border-t border-white/10"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Stay Updated with AI Insights
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest updates, tutorials, and AI chatbot news delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>&copy; {currentYear} ChatAI Pro. All rights reserved.</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-red-400"
              >
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </footer>
  );
} 