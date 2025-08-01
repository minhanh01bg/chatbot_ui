"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-7xl font-bold mb-6">
                Trợ lý AI thông minh
              </h1>
              <p className="text-xl sm:text-2xl mb-8">
                Trải nghiệm cuộc trò chuyện thông minh với AI tiên tiến nhất
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/chat"
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-100 transition-colors"
                >
                  Bắt đầu trò chuyện
                </Link>
                <Link
                  href="/plans"
                  className="bg-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-600 transition-colors"
                >
                  Xem gói dịch vụ
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI thông minh</h3>
              <p className="text-gray-600">
                Trò chuyện tự nhiên với AI được huấn luyện chuyên sâu
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Tốc độ nhanh</h3>
              <p className="text-gray-600">
                Trả lời nhanh chóng trong vài giây
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Bảo mật</h3>
              <p className="text-gray-600">
                Dữ liệu được bảo vệ an toàn
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Bắt đầu cuộc trò chuyện với AI ngay hôm nay
          </p>
          <Link
            href="/chat"
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-100 transition-colors"
          >
            Bắt đầu ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
