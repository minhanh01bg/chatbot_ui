declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Admin theme CSS classes
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// NOTE: Avoid augmenting the 'react' module to prevent conflicts with React's official types

// Admin theme specific classes
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Global CSS classes for admin theme
declare global {
  interface Window {
    __ADMIN_THEME__?: boolean;
  }
} 