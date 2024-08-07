/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", 
   
  ],
  theme: {
    extend: {
      // add color to tailwind
      colors: {
        cyan: "#4399FF",
        grisclair: "#C8CBD9",
        grisfonce: "#D6D2D2",
        violet: "#5A6ACF",

        bleumarine: "#013F4E",
        bleugris: "#00718F",
        bleuclair: "#0BA5BE",
        beige: "#CFCBC8",
        caquis: "#576319"
        
       
        
      },

    },
  },
  plugins: [],
}

