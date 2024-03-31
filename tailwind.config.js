/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        roboto:
          'Roboto, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
      },
    },
  },
  plugins: [],
};
