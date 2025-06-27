import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import { theme } from './tailwind.theme.js';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './src/components/ui/**/*.{js,ts,jsx,tsx}', // đường dẫn shadcn/ui
    ],
    theme: {
        extend: theme,
    },
    plugins: [typography, forms, scrollbar],
    future: {
        hoverOnlyWhenSupported: true,
    },
};