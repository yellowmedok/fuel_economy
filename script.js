// 1. Отримуємо статус ОДРАЗУ при завантаженні сторінки
const appStatus = import.meta.env.VITE_APP_STATUS;
const statusElement = document.getElementById('app-status');

if (statusElement) {
    statusElement.textContent = appStatus;
}

// 2. Функція розрахунку (займається тільки математикою)
function calculate() {
    const distance = document.getElementById('distance').value;
    const consumption = document.getElementById('consumption').value;
    const price = document.getElementById('price').value;

    if (distance > 0 && consumption > 0 && price > 0) {
        const total = (distance / 100) * consumption * price;
        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.innerText = `Вартість: ${total.toFixed(2)} грн`;
        }
    } else {
        alert("Будь ласка, введіть коректні дані");
    }
}

//явно вказуємо, що функція використовується глобально
window.calculate = calculate;