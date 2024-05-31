const rates = {
    BGN: { EUR: 0.51, USD: 0.58, JPY: 63.15, TRY: 5.08 },
    EUR: { BGN: 1.96, USD: 1.13, JPY: 126.99, TRY: 10.21 },
    USD: { BGN: 1.72, EUR: 0.88, JPY: 114.32, TRY: 8.01 },
    JPY: { BGN: 0.016, EUR: 0.0079, USD: 0.0087, TRY: 0.079 },
    TRY: { BGN: 0.197, EUR: 0.098, USD: 0.125, JPY: 12.58 }
};

module.exports = rates;