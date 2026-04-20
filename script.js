import posthog from 'posthog-js';

// Ініціалізація
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'always'
});

window.posthog = posthog;

window.addEventListener('DOMContentLoaded', () => {
    // 1. Статус додатка
    const appStatus = import.meta.env.VITE_APP_STATUS;
    const statusElement = document.getElementById('app-status');
    if (statusElement) {
        statusElement.textContent = appStatus;
    }

    // 2. FEATURE FLAG: Перевірка прапорця "show-eco-tips"
    posthog.onFeatureFlags(() => {
        if (posthog.isFeatureEnabled('show-eco-tips')) {
            const ecoBlock = document.getElementById('eco-feature');
            if (ecoBlock) {
                ecoBlock.style.display = 'block';
                // Фіксуємо подію, що користувач побачив нову фічу (для звіту)
                posthog.capture('eco_tip_displayed');
            }
        }
    });

    // 3. Відстеження фокусу полів
    ['distance', 'consumption', 'price'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('focus', () => {
                posthog.capture('input_focus', { field: id });
            }, { once: true });
        }
    });
});

// Функція розрахунку
function calculate() {
    const distance = document.getElementById('distance').value;
    const consumption = document.getElementById('consumption').value;
    const price = document.getElementById('price').value;

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

window.calculate = calculate;