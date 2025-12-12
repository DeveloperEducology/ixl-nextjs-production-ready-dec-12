import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // Scans the App Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // <--- CHANGE THIS LINE
    "./services/**/*.{js,ts,jsx,tsx,mdx}",   // (Optional) Scans services if needed
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",      // (Optional) Scans utils if needed
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        ixl: {
          green: '#56a700',
          blue: '#0074e8',
          orange: '#f5a623',
          bg: '#f3f9f9'
        }
      }
    },
  },
  plugins: [],
};
export default config;