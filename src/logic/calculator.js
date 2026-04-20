import posthog from 'posthog-js';

//posthog
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: 'always'
});

// Розрахунок для паливних авто (бензин/дизель/газ)
export const calculateFuelCost = (distance, consumption, price) => {
  if (distance < 0 || consumption <= 0 || price < 0) return 0;
  return (distance / 100) * consumption * price; //тестова зміна на 50
};

// Розрахунок для електромобілів (з урахуванням нічного тарифу)
export const calculateEVCost = (consumptionKWh, tariff, isNight = false) => {
  if (consumptionKWh < 0 || tariff < 0) return 0;
  const finalTariff = isNight ? tariff * 0.5 : tariff;
  return consumptionKWh * finalTariff;
};

