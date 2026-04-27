import posthog from 'posthog-js';
import * as Sentry from "@sentry/browser"; 

// 1. Ініціалізація (Має бути на самому початку)
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'always'
});

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN, 
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0, 
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

// Робимо для доступу в консолі (опціонально)
window.posthog = posthog;
window.Sentry = Sentry;

window.addEventListener('DOMContentLoaded', () => {
    // Встановлюємо користувача ВІДРАЗУ при завантаженні
    Sentry.setUser({ 
        id: "tytskyi-pp-34", 
        email: "Bohdan.Tytskyi.PP.2023@lpnu.ua", 
        segment: "beta_tester",
        app_version: "1.0.4"
    });

    // Статус системи
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

    // Кнопка "Break the world" — ЛИШЕ ТУТ
    const breakBtn = document.getElementById('break-world-btn');
    if (breakBtn) {
        breakBtn.addEventListener('click', () => {
            // Додатково підстрахуємося: перевіримо чи встановлено юзера перед киданням помилки
            console.log("Sentry user set to:", Sentry.getClient()?.getOptions()?.dsn);
            throw new Error("Sentry Test Error: Критичний збій у Fuel Economy!");
        });
    }
});

// Функція розрахунку (залишаємо як була, вона ок)
export function calculate() {
    const distance = document.getElementById('distance').value;
    const consumption = document.getElementById('consumption').value;
    const price = document.getElementById('price').value;

    if (distance == "999") {
        throw new Error("FuelCalculatorCriticalError: Unexpected distance value!");
    }

    if (distance > 0 && consumption > 0 && price > 0) {
        const total = (distance / 100) * consumption * price;
        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.innerText = `Вартість: ${total.toFixed(2)} грн`;
            posthog.capture('fuel_calculated', { distance_km: parseFloat(distance), total_cost: total });
        }
    } else {
        alert("Будь ласка, введіть коректні дані");
    }
}

// Прив'язка до window для доступу з HTML
window.calculate = calculate;