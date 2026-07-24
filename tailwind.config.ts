import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#CEFF1A",
        secondary: "#14141A",
        white: "F5F6FC",
      },
      fontFamily: {
        "zalando": ["'Zalando Sans Expanded'", "'Arial Black'", "sans-serif"],
        "ubuntu": ["'Ubuntu Sans'", "Ubuntu", "sans-serif"],
      },
      letterSpacing: {
        "widest2": "0.15em",
        "widest3": "0.2em",
      },
    },
  },
  plugins: [],
};
export default config;
