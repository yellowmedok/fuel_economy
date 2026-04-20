import posthog from 'posthog-js';

// 1. Ініціалізація PostHog
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'always' 
});

// 2. Логіка, яка має спрацювати ОДРАЗУ після завантаження структури сторінки
window.addEventListener('DOMContentLoaded', () => {
    
    // Перевірка статусу додатка (з Лаби 4)
    const appStatus = import.meta.env.VITE_APP_STATUS;
    const statusElement = document.getElementById('app-status');
    if (statusElement) {
        statusElement.textContent = appStatus;
        posthog.capture('app_status_viewed', { status: appStatus });
    }

    // Відстеження фокусу на полях (тепер вони точно знайдуться в DOM)
    ['distance', 'consumption', 'price'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('focus', () => {
                posthog.capture('input_focus', { field: id });
                console.log(`Event sent: input_focus for ${id}`); // для самоперевірки в консолі
            }, { once: true }); // спрацює 1 раз для кожного поля за сесію
        }
    });
});

// 3. Основна функція розрахунку
function calculate() {
    const distance = document.getElementById('distance').value;
    const consumption = document.getElementById('consumption').value;
    const price = document.getElementById('price').value;

    if (distance > 0 && consumption > 0 && price > 0) {
        const total = (distance / 100) * consumption * price;
        const resultElement = document.getElementById('result');
        
        if (resultElement) {
            const finalResult = total.toFixed(2);
            resultElement.innerText = `Вартість: ${finalResult} грн`;

            // Кастомна подія успішного розрахунку
            posthog.capture('fuel_calculated', {
                distance_km: parseFloat(distance),
                avg_consumption: parseFloat(consumption),
                fuel_price_uah: parseFloat(price),
                total_cost: parseFloat(finalResult)
            });
        }
    } else {
        alert("Будь ласка, введіть коректні дані");
        
        // Відстеження помилок вводу
        posthog.capture('calculation_failed', {
            reason: 'invalid_input'
        });
    }
}

// Глобальний доступ для кнопки onclick="calculate()"
window.calculate = calculate;