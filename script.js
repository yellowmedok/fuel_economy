import posthog from 'posthog-js';
import * as Sentry from "@sentry/browser"; 

// 1. Ініціалізація SDK (виконується миттєво)
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'always'
});

Sentry.init({
    dsn: "https://1daf81be119f0de3a52e143c67a124cb@o4511291504394240.ingest.de.sentry.io/4511291517042768", 
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0, 
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

window.posthog = posthog;
window.Sentry = Sentry;

window.addEventListener('DOMContentLoaded', () => {
    // Встановлюємо початковий контекст (про всяк випадок)
    Sentry.setUser({ 
        id: "tytskyi-pp-34", 
        email: "Bohdan.Tytskyi.PP.2023@lpnu.ua"
    });

    const statusElement = document.getElementById('app-status');
    if (statusElement) {
        statusElement.textContent = import.meta.env.VITE_APP_STATUS;
    }

    // Feature Flags (PostHog)
    posthog.onFeatureFlags(() => {
        if (posthog.isFeatureEnabled('show-eco-tips')) {
            const ecoBlock = document.getElementById('eco-feature');
            if (ecoBlock) ecoBlock.style.display = 'block';
        }
    });

    // НОВИЙ ОБРОБНИК КНОПКИ "Break the world"
    const breakBtn = document.getElementById('break-world-btn');
    if (breakBtn) {
        breakBtn.addEventListener('click', () => {
            // 1. ПРИМУСОВО встановлюємо дані користувача безпосередньо перед помилкою
            Sentry.setUser({ 
                id: "tytskyi", 
                email: "Bohdan.Tytskyi.PP.2023@lpnu.ua",
                segment: "test"
            });

            // 2. Додаємо кастомний тег (їх найлегше знайти в Sentry)
            Sentry.setTag("lab", "6");
            Sentry.setTag("project_name", "fuel_economy");

            console.log("Sentry context forced. Launching error in 3... 2... 1...");

            // 3. Генеруємо помилку
            throw new Error("Sentry Test Error: Критичний збій у Fuel Economy!");
        });
    }

    const logoutBtn = document.getElementById('logout-btn'); 
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
            Sentry.setUser(null);
            console.log("Sentry context cleared");
            alert("Контекст користувача очищено!");
        });
    }
});

// Функція розрахунку
export function calculate() {
    const distance = document.getElementById('distance').value;
    const consumption = document.getElementById('consumption').value;
    const price = document.getElementById('price').value;

    // Швидка перевірка помилки через введення 999
    if (distance == "999") {
        Sentry.setTag("error_trigger", "manual_input");
        throw new Error("FuelCalculatorCriticalError: Unexpected distance value!");
    }

    if (distance > 0 && consumption > 0 && price > 0) {
        const total = (distance / 100) * consumption * price;
        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.innerText = `Вартість: ${total.toFixed(2)} грн`;
            posthog.capture('fuel_calculated', { 
                distance_km: parseFloat(distance), 
                total_cost: total 
            });
        }
    } else {
        alert("Будь ласка, введіть коректні дані");
    }
}

try {
    // Викликаємо функцію, якої не існує
    confirmSentryWorking(); 
} catch (e) {
    console.log("Sentry catching test error...");
    Sentry.captureException(e);
}

window.calculate = calculate;