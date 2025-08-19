'use client';

import { Bot, Sparkles, MessageCircle, Zap, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './ChatTest.module.css';

interface WelcomeScreenProps {
  siteName?: string;
}

export default function WelcomeScreen({ siteName }: WelcomeScreenProps) {
  const features = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Smart Conversations",
      description: "Ask questions and get intelligent responses"
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Document Knowledge",
      description: "Powered by your uploaded documents"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Instant Responses",
      description: "Get answers in real-time"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-indigo-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main icon with floating animation */}
      <div className={cn("relative mb-8", styles.floating)}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl">
          <Bot className="h-12 w-12 text-gray-900" />
        </div>
        <div className="absolute -top-2 -right-2">
          <div className="p-2 rounded-full bg-yellow-400 shadow-lg animate-bounce">
            <Sparkles className="h-4 w-4 text-yellow-800" />
          </div>
        </div>
      </div>

      {/* Title with gradient text */}
      <h3 className={cn("font-bold text-2xl mb-3", styles.gradientText)}>
        Start Your Conversation
      </h3>
      
      {/* Subtitle */}
      <p className="max-w-sm admin-text-secondary leading-relaxed mb-8">
        Ask questions about your documents and get intelligent responses from your AI assistant.
        {siteName && (
          <span className="block mt-2 font-medium admin-accent">
            Powered by {siteName}
          </span>
        )}
      </p>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full mb-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={cn(
              "p-4 rounded-xl admin-bg-glass backdrop-blur-sm border admin-border-primary",
              "transition-all duration-300 hover:scale-105 hover:shadow-lg",
              "animate-in slide-in-from-bottom-2 duration-500"
            )}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-gray-900 mb-3 mx-auto">
              {feature.icon}
            </div>
            <h4 className="font-semibold admin-text-primary mb-1">
              {feature.title}
            </h4>
            <p className="text-sm admin-text-secondary">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 text-sm admin-text-muted">
        <div className="w-2 h-2 admin-bg-status-success rounded-full animate-pulse"></div>
        <span className="font-medium">AI is ready to help</span>
      </div>

      {/* Quick start tips */}
      <div className="mt-8 p-4 rounded-xl admin-accent-secondary border admin-border-accent max-w-md">
        <h4 className="font-semibold admin-accent mb-2">💡 Quick Start Tips</h4>
        <ul className="text-sm admin-text-secondary space-y-1 text-left">
          <li>• Ask specific questions for better answers</li>
          <li>• Try asking about document content</li>
          <li>• Use natural language - the AI understands context</li>
        </ul>
      </div>
    </div>
  );
} 