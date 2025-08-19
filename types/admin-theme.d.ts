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

// Extend the CSS module to include admin theme classes
declare module 'react' {
  interface CSSProperties {
    [key: string]: any;
  }
}

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