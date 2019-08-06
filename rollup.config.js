import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import {terser} from "rollup-plugin-terser";

const plugins = [
    typescript(),

    svelte({
        dev: false,
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({browser: true}),
    commonjs(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    terser()
];

export default [
    {
        input: ["src/app-google-map.ts"],
        output: {
            sourcemap: true,
            format: "iife",
            name: "app",
            file: "public/js/app-google-map.js"
        },
        plugins: plugins,
        watch: {
            clearScreen: false
        }
    }
];
