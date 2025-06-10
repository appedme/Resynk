import chroma from 'chroma-js';

/**
 * Robust color conversion utility using chroma-js
 * Handles all CSS color formats including oklch, hsl, rgb, hex, etc.
 */
export class ColorUtils {
    /**
     * Convert any CSS color to hex format
     * @param color - Any CSS color string
     * @returns Hex color string or fallback
     */
    static toHex(color: string, fallback: string = '#000000'): string {
        if (!color || typeof color !== 'string') {
            return fallback;
        }

        // If already hex, validate and return
        if (color.startsWith('#')) {
            try {
                return chroma(color).hex();
            } catch {
                return fallback;
            }
        }

        // Handle CSS variables - return fallback immediately
        if (color.includes('var(')) {
            return fallback;
        }

        // Handle oklch format specifically
        if (color.includes('oklch')) {
            try {
                // Extract oklch values
                const oklchMatch = color.match(/oklch\(\s*([^)]+)\s*\)/);
                if (oklchMatch) {
                    const values = oklchMatch[1].split(/[\s,]+/).filter(v => v.trim()).map(v => v.trim());

                    // Parse L (lightness 0-1), C (chroma 0-0.37), H (hue 0-360)
                    const l = Math.min(1, Math.max(0, parseFloat(values[0]) || 0.5));
                    const c = Math.min(0.37, Math.max(0, parseFloat(values[1]) || 0.1));
                    const h = parseFloat(values[2]) || 0;

                    // Simple approximation using HSL as intermediate
                    const saturation = Math.min(1, c * 2.7); // Approximate conversion
                    const hue = h % 360;

                    return chroma.hsl(hue, saturation, l).hex();
                }
            } catch {
                console.warn('Failed to parse oklch color:', color);
            }
            return fallback;
        }

        // Handle color() format specifically
        if (color.includes('color(')) {
            try {
                // Extract color() values
                const colorMatch = color.match(/color\(\s*([^)]+)\s*\)/);
                if (colorMatch) {
                  const colorContent = colorMatch[1].trim();
                  // Try to match known color spaces
                  let values = colorContent.split(/[\s,]+/).filter(v => v.trim());
                  // Remove color space name if present
                  if (['srgb','display-p3','rec2020','a98-rgb','prophoto-rgb','xyz'].some(space => values[0] === space)) {
                    values = values.slice(1);
                  }
                  // Parse up to 4 values (r,g,b,a)
                  const r = Math.round((parseFloat(values[0]) || 0) * 255);
                  const g = Math.round((parseFloat(values[1]) || 0) * 255);
                  const b = Math.round((parseFloat(values[2]) || 0) * 255);
                  // If alpha present and < 1, blend with white
                  let hex = chroma.rgb(r, g, b).hex();
                  if (values[3] && !isNaN(parseFloat(values[3]))) {
                    const a = parseFloat(values[3]);
                    if (a < 1) {
                      const blended = chroma.mix('#fff', hex, a, 'rgb');
                      hex = blended.hex();
                    }
                  }
                  return hex;
                }
            } catch {
                console.warn('Failed to parse color() function:', color);
            }
        }

        // Try to parse with chroma-js first
        try {
            return chroma(color).hex();            } catch {
            console.warn('Failed to parse color:', color);

            // Try alternative parsing methods as fallback
            try {
                // Handle hsl format
                if (color.includes('hsl')) {
                    const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
                    if (hslMatch) {
                        const h = parseInt(hslMatch[1]);
                        const s = parseInt(hslMatch[2]) / 100;
                        const l = parseInt(hslMatch[3]) / 100;
                        return chroma.hsl(h, s, l).hex();
                    }
                }

                // Handle rgb format
                if (color.includes('rgb')) {
                    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
                    if (rgbMatch) {
                        const r = parseInt(rgbMatch[1]);
                        const g = parseInt(rgbMatch[2]);
                        const b = parseInt(rgbMatch[3]);
                        return chroma.rgb(r, g, b).hex();
                    }
                }
            } catch {
                console.warn('Alternative parsing also failed:', color);
            }

            return fallback;
        }
    }

    /**
     * Check if a color is valid
     * @param color - Color string to validate
     * @returns Boolean indicating if color is valid
     */
    static isValidColor(color: string): boolean {
        try {
            chroma(color);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get a contrasting text color (black or white) for a given background
     * @param backgroundColor - Background color
     * @returns '#000000' or '#ffffff'
     */
    static getContrastingTextColor(backgroundColor: string): string {
        try {
            const color = chroma(backgroundColor);
            const luminance = color.luminance();
            return luminance > 0.5 ? '#000000' : '#ffffff';
        } catch {
            return '#000000';
        }
    }

    /**
     * Sanitize all colors in a CSS style string
     * @param style - CSS style string
     * @param primaryColor - Primary color to use as fallback
     * @returns Sanitized CSS style string
     */
    static sanitizeStyleColors(style: string, primaryColor: string = '#2563eb'): string {
        if (!style) return style;

        const safePrimary = this.toHex(primaryColor);

        return style
            // Replace oklch colors with more comprehensive matching
            .replace(/color:\s*oklch\([^)]*\)\s*;?/gi, `color: ${safePrimary};`)
            .replace(/background(-color)?:\s*oklch\([^)]*\)\s*;?/gi, 'background: transparent;')
            .replace(/border(-color)?:\s*oklch\([^)]*\)\s*;?/gi, 'border-color: #e5e7eb;')

            // Replace CSS variables with comprehensive patterns
            .replace(/color:\s*var\([^)]*\)\s*;?/gi, `color: ${safePrimary};`)
            .replace(/background(-color)?:\s*var\([^)]*\)\s*;?/gi, 'background: transparent;')
            .replace(/border(-color)?:\s*var\([^)]*\)\s*;?/gi, 'border-color: #e5e7eb;')

            // Replace specific Tailwind CSS variables that use OKLCH
            .replace(/var\(--background\)/gi, '#ffffff')
            .replace(/var\(--foreground\)/gi, '#1a1a1a')
            .replace(/var\(--primary\)/gi, safePrimary)
            .replace(/var\(--primary-foreground\)/gi, '#ffffff')
            .replace(/var\(--secondary\)/gi, '#f8fafc')
            .replace(/var\(--border\)/gi, '#e5e7eb')
            .replace(/var\(--muted\)/gi, '#f8fafc')
            .replace(/var\(--accent\)/gi, '#f8fafc')

            // Replace gradients
            .replace(/background(-image)?:\s*linear-gradient[^;]*;?/gi, `background: ${safePrimary};`)
            .replace(/background(-image)?:\s*radial-gradient[^;]*;?/gi, `background: ${safePrimary};`)
            .replace(/background(-image)?:\s*conic-gradient[^;]*;?/gi, `background: ${safePrimary};`)

            // Replace other problematic color functions
            .replace(/color:\s*hsl\([^)]*\)\s*;?/gi, `color: ${safePrimary};`)
            .replace(/background(-color)?:\s*hsl\([^)]*\)\s*;?/gi, 'background: transparent;')
            .replace(/color:\s*rgb\([^)]*\)\s*;?/gi, (match) => {
                try {
                    const hexColor = this.toHex(match.match(/rgb\([^)]*\)/)?.[0] || '');
                    return `color: ${hexColor};`;
                } catch {
                    return `color: ${safePrimary};`;
                }
            })
            // Handle rgba with transparency by making it transparent
            .replace(/background(-color)?:\s*rgba\([^)]*\)\s*;?/gi, 'background: transparent;')
            .replace(/color:\s*rgba\([^)]*\)\s*;?/gi, `color: ${safePrimary};`)

            // Handle color() functions specifically (modern CSS Level 4)
            .replace(/color:\s*color\([^)]*\)\s*;?/gi, `color: ${safePrimary};`)
            .replace(/background(-color)?:\s*color\([^)]*\)\s*;?/gi, 'background: transparent;')
            .replace(/border(-color)?:\s*color\([^)]*\)\s*;?/gi, 'border-color: #e5e7eb;');
    }

    /**
     * Generate PDF-safe CSS for templates
     * @param primaryColor - Primary color
     * @param secondaryColor - Secondary color
     * @returns CSS string safe for PDF export
     */
    static generatePDFSafeCSS(primaryColor: string = '#2563eb', secondaryColor: string = '#6b7280'): string {
        const safePrimary = this.toHex(primaryColor);
        // Note: secondaryColor reserved for future enhancements
        void secondaryColor; // Acknowledge parameter to avoid lint warnings

        return `
      /* PDF-safe color overrides - Override all CSS variables with safe values */
      :root {
        --background: #ffffff !important;
        --foreground: #1a1a1a !important;
        --card: #ffffff !important;
        --card-foreground: #1a1a1a !important;
        --popover: #ffffff !important;
        --popover-foreground: #1a1a1a !important;
        --primary: ${safePrimary} !important;
        --primary-foreground: #ffffff !important;
        --secondary: #f8fafc !important;
        --secondary-foreground: #1a1a1a !important;
        --muted: #f8fafc !important;
        --muted-foreground: #6b7280 !important;
        --accent: #f8fafc !important;
        --accent-foreground: #1a1a1a !important;
        --destructive: #ef4444 !important;
        --border: #e5e7eb !important;
        --input: #e5e7eb !important;
        --ring: ${safePrimary} !important;
      }
      
      /* PDF-safe color overrides */
      [data-resume-preview], [data-resume-preview] * {
        /* Reset problematic properties */
        background-image: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        /* Force font rendering */
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Force safe colors */
      [data-resume-preview] {
        background: #ffffff !important;
        color: #1a1a1a !important;
      }
      
      /* Headings with better hierarchy */
      [data-resume-preview] h1, 
      [data-resume-preview] h2, 
      [data-resume-preview] h3,
      [data-resume-preview] h4,
      [data-resume-preview] h5,
      [data-resume-preview] h6 {
        color: ${safePrimary} !important;
        background: transparent !important;
        font-weight: 700 !important;
      }
      
      /* Text elements with better contrast */
      [data-resume-preview] p,
      [data-resume-preview] span,
      [data-resume-preview] div,
      [data-resume-preview] li,
      [data-resume-preview] td,
      [data-resume-preview] th {
        color: #1a1a1a !important;
        background: transparent !important;
      }
      
      /* Links and interactive elements */
      [data-resume-preview] a {
        color: ${safePrimary} !important;
        text-decoration: underline !important;
      }
      
      /* Fix white text issues comprehensively */
      [data-resume-preview] .text-white,
      [data-resume-preview] [style*="color: white"],
      [data-resume-preview] [style*="color: #fff"],
      [data-resume-preview] [style*="color: #ffffff"],
      [data-resume-preview] [style*="color: rgba(255, 255, 255"],
      [data-resume-preview] [class*="text-white"] {
        color: #1a1a1a !important;
      }
      
      /* Fix gradient backgrounds */
      [data-resume-preview] [style*="linear-gradient"],
      [data-resume-preview] [style*="radial-gradient"],
      [data-resume-preview] [style*="conic-gradient"],
      [data-resume-preview] [class*="gradient"] {
        background: #f8fafc !important;
        color: #1a1a1a !important;
      }
      
      /* Creative template specific fixes */
      [data-resume-preview] .bg-gradient-to-br,
      [data-resume-preview] .bg-gradient-to-r,
      [data-resume-preview] .bg-gradient-to-l,
      [data-resume-preview] [class*="bg-gradient"] {
        background: #f1f5f9 !important;
        color: #1a1a1a !important;
      }
      
      /* Modern template icon alignment fixes */
      [data-resume-preview] svg {
        display: inline-block !important;
        vertical-align: middle !important;
        margin-right: 6px !important;
        width: 16px !important;
        height: 16px !important;
        flex-shrink: 0 !important;
        fill: currentColor !important;
      }
      
      [data-resume-preview] .flex.items-center {
        display: flex !important;
        align-items: center !important;
        gap: 0.375rem !important;
      }
      
      [data-resume-preview] .flex.items-center svg {
        margin-right: 0 !important;
      }
      
      /* Safe borders */
      [data-resume-preview] .border,
      [data-resume-preview] [class*="border"] {
        border-color: #e5e7eb !important;
      }
      
      /* Backdrop and overlay elements */
      [data-resume-preview] .bg-white\\/10,
      [data-resume-preview] [class*="bg-white/"],
      [data-resume-preview] .backdrop-blur-sm,
      [data-resume-preview] [class*="backdrop-"] {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: none !important;
        color: #1a1a1a !important;
      }
      
      /* Professional template specific fixes */
      [data-resume-preview] .bg-blue-50,
      [data-resume-preview] .bg-gray-50,
      [data-resume-preview] [class*="bg-blue-"],
      [data-resume-preview] [class*="bg-gray-"] {
        background: #f8fafc !important;
        color: #1a1a1a !important;
      }
      
      /* Ensure proper spacing and layout */
      [data-resume-preview] .space-y-2 > * + * {
        margin-top: 0.5rem !important;
      }
      
      [data-resume-preview] .space-y-4 > * + * {
        margin-top: 1rem !important;
      }
      
      /* Typography improvements */
      [data-resume-preview] {
        font-family: Arial, sans-serif !important;
        line-height: 1.5 !important;
      }
      
      /* Override Tailwind utility classes that use CSS variables */
      [data-resume-preview] .bg-background {
        background: #ffffff !important;
      }
      
      [data-resume-preview] .text-foreground {
        color: #1a1a1a !important;
      }
      
      [data-resume-preview] .bg-primary {
        background: ${safePrimary} !important;
      }
      
      [data-resume-preview] .text-primary {
        color: ${safePrimary} !important;
      }
      
      [data-resume-preview] .border-border {
        border-color: #e5e7eb !important;
      }
    `;
    }

    /**
     * Preprocess CSS text to replace all OKLCH and color() function colors
     * @param cssText - Raw CSS text
     * @returns CSS with problematic colors replaced with hex equivalents
     */
    static preprocessCSS(cssText: string): string {
        let processedCSS = cssText;

        // Replace oklch colors
        processedCSS = processedCSS.replace(/oklch\([^)]+\)/gi, (match) => {
            const hexColor = this.toHex(match);
            console.log(`Preprocessing OKLCH: ${match} -> ${hexColor}`);
            return hexColor;
        });

        // Replace color() functions
        processedCSS = processedCSS.replace(/color\([^)]+\)/gi, (match) => {
            const hexColor = this.toHex(match);
            console.log(`Preprocessing color(): ${match} -> ${hexColor}`);
            return hexColor;
        });

        return processedCSS;
    }

    /**
     * Scan and replace OKLCH and color() function colors in all stylesheets
     */
    static replaceOklchInStylesheets(): void {
        // Process all style elements
        document.querySelectorAll('style').forEach(style => {
            if (style.textContent) {
                const processed = this.preprocessCSS(style.textContent);
                if (processed !== style.textContent) {
                    style.textContent = processed;
                    console.log('Replaced OKLCH and color() colors in stylesheet');
                }
            }
        });

        // Process all link stylesheets (limited by CORS)
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            // Can't modify external stylesheets due to CORS, but log for debugging
            console.log('External stylesheet found:', (link as HTMLLinkElement).href);
        });
    }
}
