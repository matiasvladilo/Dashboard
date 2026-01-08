module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Pastel-based Modern Palette
                "primary": {
                    light: "#6366f1", // Indigo pastelish
                    dark: "#818cf8"
                },
                "surface": {
                    light: "#ffffff",
                    dark: "#1a1c1e"
                },
                "app-bg": {
                    light: "#f8fafc",
                    dark: "#121417"
                },
                // Accent Pastels
                "pastel-blue": "#dbeafe",
                "pastel-green": "#dcfce7",
                "pastel-red": "#fee2e2",
                "pastel-orange": "#ffedd5",
                "pastel-purple": "#f3e8ff",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "2xl": "1rem",
                "3xl": "1.5rem"
            },
        },
    },
    plugins: [],
}
