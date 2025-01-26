import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",

    // HeroUI(구 NextUI) 미사용 
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",

    // PrelineUI 사용
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        ibm: ['"IBM Plex Sans KR"', 'sans-serif'],
      },
    },
    //커스텀 폰트추가 - ibm plex sans KR
    
  },
  darkMode: "class",
  plugins: [require('preline/plugin'), heroui()],
};
