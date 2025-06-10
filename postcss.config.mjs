const config = {
  plugins: [
    "@tailwindcss/postcss",
    // Add color functional notation plugin first
    "postcss-color-functional-notation",
    [
      "postcss-preset-env",
      {
        stage: 3, // More comprehensive polyfills
        features: {
          "color-functional-notation": { preserve: false }, // Convert color() to rgb/hsl
          "color-function": { preserve: false }, // Convert color() functions
          "oklab-function": { preserve: false }, // Convert oklab functions
          "color-oklch": { preserve: false }, // Convert oklch to rgb fallback
        },
      },
    ],
  ],
};

export default config;
