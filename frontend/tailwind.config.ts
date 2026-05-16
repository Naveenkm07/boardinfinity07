import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f0ff',
                    100: '#e0e0ff',
                    200: '#c7c7fe',
                    300: '#a3a3fc',
                    400: '#8080f8',
                    500: '#667eea',
                    600: '#5a5edb',
                    700: '#4c48bf',
                    800: '#3f3d9b',
                    900: '#37377b',
                    950: '#222149',
                },
                accent: {
                    50: '#fdf4ff',
                    100: '#fae8ff',
                    200: '#f5d0fe',
                    300: '#e9a8f5',
                    400: '#da76ea',
                    500: '#c44ad8',
                    600: '#a832b8',
                    700: '#8c2896',
                    800: '#764ba2',
                    900: '#5e3a7a',
                    950: '#3f1a54',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
