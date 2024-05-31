const readline = require('readline');
const fs = require('fs');
const rates = require('./currencyRates');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const OUTPUT_FILE_PATH = 'conversions.json';
const ERROR_MESSAGES = {
    invalidDate: 'Please enter a valid date in the format YYYY-MM-DD.',
    invalidAmount: 'Please enter a valid amount.',
    invalidCurrencyCode: 'Please enter a valid currency code.',
    conversionNotFound: (base, target) => `Conversion rate from ${base} to ${target} not found.`
};

const validateDate = date => /^\d{4}-\d{2}-\d{2}$/.test(date);
const validateAmount = amount => /^\d+(\.\d{1,2})?$/.test(amount);
const validateCurrencyCode = code => /^[A-Z]{3}$/.test(code.toUpperCase()) && rates.hasOwnProperty(code.toUpperCase());


const convertCurrency = (amount, base, target) => {
    base = base.toUpperCase();
    target = target.toUpperCase();

    if (!rates[base]?.[target]) {
        console.log(ERROR_MESSAGES.conversionNotFound(base, target));
        return null;
    }
    
    return (amount * rates[base][target]).toFixed(2);
}

const requestInput = query => new Promise(resolve => rl.question(query, resolve));

async function getInputValidation(prompt, validation, errorMessage) {
    let userInput;
    while (true) {
        userInput = await requestInput(prompt);
        if (userInput.toLowerCase() === 'end') {
            fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(conversions, null, 4));
            process.exit();
        }
        if (validation(userInput)) break;
        console.log(`\x1b[1m${errorMessage}\x1b[0m`);
    }
    return userInput;
}

const conversions = [];

async function main() {
    const date = process.argv[2];

    if (!validateDate(date)) {
        console.log(ERROR_MESSAGES.invalidDate);
        process.exit(1);
    }

    try {
        const jsonData = fs.readFileSync(OUTPUT_FILE_PATH, 'utf8');
        const storedData = JSON.parse(jsonData);
        conversions.push(...storedData);
    } catch (err) {}

    while (true) {
        const amount = await getInputValidation('', validateAmount, ERROR_MESSAGES.invalidAmount);
        const baseCurrency = await getInputValidation('', validateCurrencyCode, ERROR_MESSAGES.invalidCurrencyCode);
        const targetCurrency = await getInputValidation('', validateCurrencyCode, ERROR_MESSAGES.invalidCurrencyCode);

        const result = convertCurrency(amount, baseCurrency, targetCurrency);
        if (result) {
            conversions.push({
                date,
                amount: parseFloat(amount),
                base_currency: baseCurrency.toUpperCase(),
                target_currency: targetCurrency.toUpperCase(),
                converted_amount: parseFloat(result)
            });
            console.log(`\x1b[1m${amount} ${baseCurrency.toUpperCase()} is ${result} ${targetCurrency.toUpperCase()}\x1b[0m`);
        }
    }
}

main().then(() => rl.close());