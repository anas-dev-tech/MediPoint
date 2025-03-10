
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: {
            "DEFAULT":"#50C878",
          }
        },
        gridTemplateColumns:{
          'auto':'repeat(auto-fill, minmax(200px, 1fr))'
        }
      },
    },
    plugins: [],
  };
  