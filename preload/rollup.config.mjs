import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  external: ["electron"],
  input: ["src/main.js", "src/view.js"],
  output: {
    dir: "target",
    format: "cjs",
  },
  plugins: [terser(), resolve(), commonjs()],
};
