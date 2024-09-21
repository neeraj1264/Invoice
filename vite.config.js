import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [
    commonjs(),  // Ensure compatibility with CommonJS modules
  ],
};
