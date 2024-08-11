/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#219EBC",
				primaryDark: "#023047",
				primaryLight: "#8ECAE6",
				secondary: "#FB8500",
				secondaryLight: "#FFB703",
				// surface: "#F7f5f4",
				// background: "#fefefe",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	variants: {
		extend: {
			display: ["group-hover"],
		},
	},
	plugins: [],
};
