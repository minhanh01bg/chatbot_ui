import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/theme-provider';
import { SiteChatProvider } from '@/contexts/SiteChatContext';
import ErrorBoundary from '@/components/error-boundary';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.vercel.ai'),
  title: 'Next.js Chatbot Template',
  description: 'Next.js chatbot template using the AI SDK.',
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

const DEBUG_SCRIPT = `\
(function() {
  // Debug script to identify MobX error sources (only in development)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Log service worker registrations for debugging
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        console.log('Service Worker Registrations:', registrations.map(r => ({
          scriptURL: r.active?.scriptURL,
          scope: r.scope,
          state: r.active?.state
        })));
      });
    }
  }
})();`;

const SERVICE_WORKER_SCRIPT = `\
(function() {
  // Disable problematic service workers
  if ('serviceWorker' in navigator) {
    // Immediately unregister any existing service workers
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        if (registration.active && 
            (registration.active.scriptURL.includes('extension') || 
             registration.active.scriptURL.includes('chrome-extension') ||
             registration.active.scriptURL.includes('sw.js') ||
             registration.active.scriptURL.includes('mobx'))) {
          registration.unregister();
        }
      }
    });

    // Prevent new service worker registrations
    const originalRegister = navigator.serviceWorker.register;
    navigator.serviceWorker.register = function(scriptURL, options) {
      if (scriptURL.includes('extension') || 
          scriptURL.includes('chrome-extension') ||
          scriptURL.includes('sw.js') ||
          scriptURL.includes('mobx')) {
        return Promise.reject(new Error('Service worker registration blocked'));
      }
      return originalRegister.call(this, scriptURL, options);
    };
  }
})();`;

const ERROR_HANDLER_SCRIPT = `\
(function() {
  // Suppress console errors from service workers and extensions
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('mobx-state-tree') || 
        message.includes('AnonymousModel') ||
        message.includes('tabStates') ||
        message.includes('injectionLifecycle') ||
        message.includes('Failed to fetch') ||
        message.includes('sw.js') ||
        message.includes('marks') ||
        message.includes('You are trying to read or write to an object that is no longer part of a state tree')) {
      // Suppress these errors silently
      return;
    }
    originalConsoleError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('mobx-state-tree') || 
        message.includes('AnonymousModel') ||
        message.includes('tabStates') ||
        message.includes('injectionLifecycle') ||
        message.includes('marks') ||
        message.includes('You are trying to read or write to an object that is no longer part of a state tree')) {
      // Suppress these warnings silently
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  // Handle MobX State Tree errors from service workers
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && 
        (event.error.message.includes('mobx-state-tree') || 
         event.error.message.includes('AnonymousModel') ||
         event.error.message.includes('tabStates') ||
         event.error.message.includes('injectionLifecycle') ||
         event.error.message.includes('marks') ||
         event.error.message.includes('You are trying to read or write to an object that is no longer part of a state tree'))) {
      event.preventDefault();
      return false;
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message && 
        (event.reason.message.includes('mobx-state-tree') || 
         event.reason.message.includes('AnonymousModel') ||
         event.reason.message.includes('tabStates') ||
         event.reason.message.includes('injectionLifecycle') ||
         event.reason.message.includes('marks') ||
         event.reason.message.includes('You are trying to read or write to an object that is no longer part of a state tree'))) {
      event.preventDefault();
      return false;
    }
  });

  // Override fetch to catch network errors from service workers
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).catch(error => {
      if (error.message.includes('Failed to fetch') && 
          (error.stack && error.stack.includes('sw.js'))) {
        // Suppress fetch errors from service workers
        return Promise.resolve(new Response('', { status: 200 }));
      }
      throw error;
    });
  };

  // Additional service worker cleanup
  if ('serviceWorker' in navigator) {
    // Unregister any problematic service workers
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        if (registration.active && 
            (registration.active.scriptURL.includes('extension') || 
             registration.active.scriptURL.includes('chrome-extension') ||
             registration.active.scriptURL.includes('sw.js'))) {
          registration.unregister();
        }
      }
    });
  }
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: DEBUG_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: SERVICE_WORKER_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: ERROR_HANDLER_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider>
              <SiteChatProvider>
                <Toaster position="top-center" />
                {children}
              </SiteChatProvider>
            </SessionProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
