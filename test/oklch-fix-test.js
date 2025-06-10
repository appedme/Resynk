// Quick OKLCH Test
import { ColorUtils } from '../src/lib/color-utils';

console.log('Testing OKLCH conversion...');

const testColors = [
    'oklch(0.5 0.2 180)',
    'oklch(0.7 0.15 280)',
    'oklch(0.3 0.1 60)',
];

testColors.forEach(color => {
    const result = ColorUtils.toHex(color);
    console.log(`${color} -> ${result}`);
});

console.log('Test complete!');
