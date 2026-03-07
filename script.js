function calculate() {
    const distance = document.getElementById('distance').value;
    const consumption = document.getElementById('consumption').value;
    const price = document.getElementById('price').value;

    if (distance > 0 && consumption > 0 && price > 0) {
        const total = (distance / 100) * consumption * price;
        document.getElementById('result').innerText = `Вартість: ${total.toFixed(2)} грн`;
    } else {
        alert("Будь ласка, введіть коректні дані");
    }
}