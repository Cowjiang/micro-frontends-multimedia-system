module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
        minHeight: {
            '3/4': '75%',
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
