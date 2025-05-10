export default {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        th: ['Kanit', 'sans-serif'],
        en: ['Rubik', 'sans-serif']
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  themes: [
    {
      dark: {
        "primary": "#4c6ef5",         
        "secondary": "#ff3d7f",       
        "accent": "#ffac41",         
        "neutral": "#1f2d3d",        
        "base-100": "#101820",       
        "info": "#3abff8",
        "success": "#36d399",
        "warning": "#fbbd23",
        "error": "#f87272",
      },
    },
    {
      light: {
        "primary": "#047aff",
        "secondary": "#c149ad",
        "accent": "#f97316",
        "neutral": "#1d283a",
        "base-100": "#f1f5f9",
        "info": "#3abff8",
        "success": "#36d399",
        "warning": "#fbbd23",
        "error": "#f87272",
      },
    },
  ],
}
