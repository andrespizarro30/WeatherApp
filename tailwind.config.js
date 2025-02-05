/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./screens/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}","./navigation/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
