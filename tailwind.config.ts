import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      // 애니메이션 효과 추가
      animation: {
        'gradient-move': 'gradient-move 5s ease infinite',
      },
      // 애니메이션 키프레임 추가
      keyframes: {
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      // 배경 크기 추가
      backgroundSize: {
        'size-200': '200% 200%',
      },
    },
  },
  plugins: [],
} satisfies Config;
