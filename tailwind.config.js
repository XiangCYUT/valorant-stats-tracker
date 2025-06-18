/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主要色調
        primary: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#fa3e3e', // Valorant 紅色
          600: '#e62e2e',
          700: '#c01d1d',
          800: '#a01c1c',
          900: '#851e1e',
          950: '#490909',
        },
        // 暗色主題背景色
        dark: {
          100: '#333333',
          200: '#2d2d2d',
          300: '#252525',
          400: '#1f1f1f',
          500: '#181818', // 主要背景
          600: '#121212',
          700: '#0e0e0e',
          800: '#0a0a0a',
          900: '#050505',
        },
        // 亮色主題背景色 - 更新為更豐富但和諧的配色
        light: {
          100: '#ffffff', // 純白，主要背景
          200: '#f8f9fa', // 淡灰藍白，次要背景
          300: '#f1f3f5', // 淡藍灰，輸入欄位
          400: '#e9ecef', // 中淡藍灰，按鈕和強調區域
          500: '#dee2e6', // 中藍灰，邊框和分隔線
          600: '#ced4da', // 深藍灰，次要邊框
          700: '#adb5bd', // 中深灰，不活躍文字
          800: '#868e96', // 深灰，次要文字
          900: '#495057', // 最深灰，主要文字
        },
        // 次要強調色 - 藍色
        accent: {
          50: '#edfaff',
          100: '#d6f1ff',
          200: '#b5e9ff',
          300: '#83deff',
          400: '#48caff',
          500: '#1eaeff',
          600: '#0089ff',
          700: '#0071d4',
          800: '#005cad',
          900: '#074f8d',
        },
        // 新增輔助色彩 - 柔和綠色
        success: {
          50: '#ebfbee',
          100: '#d3f9d8',
          200: '#b2f2bb',
          300: '#8ce99a',
          400: '#69db7c',
          500: '#51cf66',
          600: '#40c057',
          700: '#37b24d',
          800: '#2f9e44',
          900: '#2b8a3e',
        },
        // 新增輔助色彩 - 溫暖黃色
        warning: {
          50: '#fff9db',
          100: '#fff3bf',
          200: '#ffec99',
          300: '#ffe066',
          400: '#ffd43b',
          500: '#fcc419',
          600: '#fab005',
          700: '#f59f00',
          800: '#f08c00',
          900: '#e67700',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
      // 添加精細的陰影
      boxShadow: {
        'soft-sm': '0 2px 4px rgba(0,0,0,0.05)',
        'soft': '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.08)',
        'soft-md': '0 6px 12px rgba(0,0,0,0.03), 0 3px 6px rgba(0,0,0,0.06)',
        'soft-lg': '0 10px 15px rgba(0,0,0,0.02), 0 4px 6px rgba(0,0,0,0.05)',
      },
      // 添加漸變背景
      backgroundImage: {
        'gradient-light': 'linear-gradient(to right, rgba(241, 243, 245, 0.6), rgba(233, 236, 239, 0.8))',
        'gradient-light-radial': 'radial-gradient(circle, rgba(248, 249, 250, 1), rgba(241, 243, 245, 0.7))',
      },
    },
  },
  plugins: [],
} 