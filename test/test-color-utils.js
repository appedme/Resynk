const { ColorUtils } = require('./src/lib/color-utils.ts');

// Since we're using TypeScript, let's create a simple test
console.log('Testing ColorUtils functionality...');

// Test OKLCH color conversion
const oklchTests = [
    'oklch(0.5 0.2 180)',
    'oklch(0.7 0.15 280)',
    'oklch(0.3 0.1 60)',
];

console.log('\n=== OKLCH Color Tests ===');
oklchTests.forEach(color => {
    try {
        const result = ColorUtils.toHex(color);
        console.log(`${color} -> ${result}`);
    } catch (error) {
        console.error(`Failed to convert ${color}:`, error.message);
    }
});

// Test CSS variable handling
const varTests = [
    'var(--primary-color)',
    'var(--secondary-color, #ff0000)',
    'var(--text-color, hsl(220, 100%, 50%))',
];

console.log('\n=== CSS Variable Tests ===');
varTests.forEach(color => {
    try {
        const result = ColorUtils.toHex(color);
        console.log(`${color} -> ${result}`);
    } catch (error) {
        console.error(`Failed to convert ${color}:`, error.message);
    }
});

// Test style sanitization
const styleTests = [
    'color: oklch(0.5 0.2 180); background: linear-gradient(45deg, #ff0000, #00ff00);',
    'background-color: var(--primary); color: hsl(220, 100%, 50%);',
    'border-color: oklch(0.7 0.3 120); margin: 10px;',
];

console.log('\n=== Style Sanitization Tests ===');
styleTests.forEach(style => {
    try {
        const result = ColorUtils.sanitizeStyleColors(style, '#2563eb');
        console.log(`Original: ${style}`);
        console.log(`Sanitized: ${result}\n`);
    } catch (error) {
        console.error(`Failed to sanitize ${style}:`, error.message);
    }
});

console.log('ColorUtils testing completed!');
