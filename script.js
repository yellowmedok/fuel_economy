import posthog from 'posthog-js';
import * as Sentry from "@sentry/browser"; 

// Ініціалізація PostHog
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'always'
});

// 2. Ініціалізація Sentry (Моніторинг помилок)
Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN, 
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, 
    // Session Replay (запис екрану при помилках)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

window.posthog = posthog;

window.addEventListener('DOMContentLoaded', () => {
    // 3. Додаємо контекст користувача в Sentry (щоб знати, чиї розрахунки впали)
    Sentry.setUser({ 
        id: "student_user", 
        project: "fuel-economy" 
    });

    const appStatus = import.meta.env.VITE_APP_STATUS;
    const statusElement = document.getElementById('app-status');
    if (statusElement) {
        statusElement.textContent = appStatus;
    }

    //  код Feature Flags
    posthog.onFeatureFlags(() => {
        if (posthog.isFeatureEnabled('show-eco-tips')) {
            const ecoBlock = document.getElementById('eco-feature');
            if (ecoBlock) {
                ecoBlock.style.display = 'block';
                posthog.capture('eco_tip_displayed');
            }
        }
    });

    // Відстеження фокусу
    ['distance', 'consumption', 'price'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('focus', () => {
                posthog.capture('input_focus', { field: id });
            }, { once: true });
        }
    });

    const breakBtn = document.getElementById('break-world-btn');
    if (breakBtn) {
        breakBtn.addEventListener('click', () => {
            throw new Error("Sentry Test Error: Критичний збій у Fuel Economy!");
        });
    }
    
});

// Функція розрахунку
function calculate() {
    const distance = document.getElementById('distance').value;
    const consumption = document.getElementById('consumption').value;
    const price = document.getElementById('price').value;

    // 4. Спеціальна кнопка/умова для виклику помилки (для звіту)
    // Якщо користувач введе відстань 999 — імітуємо критичну помилку
    if (distance == "999") {
        throw new Error("FuelCalculatorCriticalError: Unexpected distance value!");
    }

    if (distance > 0 && consumption > 0 && price > 0) {
        const total = (distance / 100) * consumption * price;
        const resultElement = document.getElementById('result');
        if (resultElement) {
            const res = total.toFixed(2);
            resultElement.innerText = `Вартість: ${res} грн`;
            
            posthog.capture('fuel_calculated', {
                distance_km: parseFloat(distance),
                total_cost: parseFloat(res)
            });
        }
    } else {
        alert("Будь ласка, введіть коректні дані");
        posthog.capture('calculation_failed');
    }
}

//знаходимо кнопку за ID і вішаємо на неї помилку
document.getElementById('break-world-btn').addEventListener('click', () => {
    throw new Error("Sentry Test Error: Критичний збій у Fuel Economy!");
});

window.calculate = calculate;