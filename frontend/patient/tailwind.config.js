
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        fontFamily:{
          custom:['Outfit', 'sans-serif']
        },
        colors: {
          primary: "#50C878",
        },
        gridTemplateColumns:{
          'auto':'repeat(auto-fill, minmax(200px, 1fr))'
        }
      },
    },
    plugins: [],
  };
  