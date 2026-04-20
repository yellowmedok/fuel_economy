import posthog from 'posthog-js';

// ініціалізація PostHog
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'always' 
});

// логіка статусу додатка + Аналітика перегляду
const appStatus = import.meta.env.VITE_APP_STATUS;
const statusElement = document.getElementById('app-status');

if (statusElement) {
    statusElement.textContent = appStatus;
    //відстежуємо, який саме статус бачить користувач
    posthog.capture('app_status_viewed', { status: appStatus });
}

//відстеження початку заповнення (що саме цікавить користувача першим)
['distance', 'consumption', 'price'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('focus', () => {
            posthog.capture('input_focus', { field: id });
        }, { once: true }); // спрацює один раз за сесію для кожного поля
    }
});

// 4. Основна функція розрахунку
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

            // Успішна подія
            posthog.capture('fuel_calculated', {
                distance_km: parseFloat(distance),
                avg_consumption: parseFloat(consumption),
                fuel_price_uah: parseFloat(price),
                total_cost: parseFloat(finalResult)
            });
        }
    } else {
        alert("Будь ласка, введіть коректні дані");
        
        // Відстеження помилок (для покращення UX)
        posthog.capture('calculation_failed', {
            reason: 'invalid_input',
            has_distance: !!distance,
            has_consumption: !!consumption,
            has_price: !!price
        });
    }
}

// Явно вказуємо, що функція використовується глобально
window.calculate = calculate;