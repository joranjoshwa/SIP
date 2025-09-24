import type { Config } from "tailwindcss";

export default {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                short: { raw: "(max-height: 667px)" },
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    safelist: [
        // Light backgrounds + rings
        "bg-[#D0F0F9]", "ring-[#D0F0F9]",
        "bg-[#F9D0D0]", "ring-[#F9D0D0]",
        "bg-[#FDF6C2]", "ring-[#FDF6C2]",
        "bg-[#D0F9EF]", "ring-[#D0F9EF]",
        "bg-[#D4F9D0]", "ring-[#D4F9D0]",
        "bg-[#F9E9D0]", "ring-[#F9E9D0]",
        "bg-[#E2D0F9]", "ring-[#E2D0F9]",
        "bg-[#FFE2F7]", "ring-[#FFE2F7]",
        "bg-[#EDEDED]", "ring-[#EDEDED]",

        // Dark backgrounds + rings
        "dark:bg-[#00495D]", "dark:ring-[#00495D]",
        "dark:bg-[#570000]", "dark:ring-[#570000]",
        "dark:bg-[#594E00]", "dark:ring-[#594E00]",
        "dark:bg-[#005641]", "dark:ring-[#005641]",
        "dark:bg-[#064800]", "dark:ring-[#064800]",
        "dark:bg-[#4A2E00]", "dark:ring-[#4A2E00]",
        "dark:bg-[#21004D]", "dark:ring-[#21004D]",
        "dark:bg-[#55003D]", "dark:ring-[#55003D]",
        "dark:bg-[#4B0000]", "dark:ring-[#4B0000]",
    ],
    plugins: [],
} satisfies Config;
