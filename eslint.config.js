import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        // Ігноруємо системні папки, щоб не перевіряти автогенерований код
        ignores: ["dist/**", "coverage/**", "playwright-report/**"],
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser, // Для браузерного JavaScript (document, window)
                ...globals.node,    // Для конфігів (process)
            }
        },
        rules: {
            // ЗАБОРОНА НЕВИКОРИСТАНИХ ЗМІННИХ (головна вимога Кроку 3)
            "no-unused-vars": ["error", { "vars": "all", "args": "after-used" }],
            
            // ЗАБОРОНА НЕВИЗНАЧЕНИХ ЗМІННИХ (запобігає помилкам ReferenceError)
            "no-undef": "error",
            
            // ПОПЕРЕДЖЕННЯ ПРО CONSOLE.LOG (щоб не забути їх у продакшн-версії)
            "no-console": "warn",
            
            // ВИМОГА ВИКОРИСТАННЯ const ЗАМІСТЬ var (сучасний стандарт)
            "no-var": "error",
            "prefer-const": "error"
        }
    }
];