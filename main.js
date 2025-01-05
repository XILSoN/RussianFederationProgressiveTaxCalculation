function getAmountsForEveryMonth(salaries, bonuses) {
  const taxRates = [
    {maxIncome: 2400000, taxRateInPercent: 13},
    {maxIncome: 5000000, taxRateInPercent: 15},
    {maxIncome: 20000000, taxRateInPercent: 18},
    {maxIncome: 50000000, taxRateInPercent: 20},
    {maxIncome: Infinity, taxRateInPercent: 22}
  ];

  // Добавлено на случай применения скрипта в Excel/Google Sheets
  salaries = salaries.flat();
  bonuses = bonuses.flat();

  let salaryEveryMonth = [...salaries]
  let allBonuses = [...bonuses];
  let taxEveryMonth = Array(13).fill(
    {
      value: 0,
      minTaxRateInPercent: Infinity,
      maxTaxRateInPercent: 0
    }
  );

  let generalIncomeAmountBeforeTax = 0;
  let generalTaxAmount = 0;

  const calculateAmounts = (amountBeforeTax, monthNumber) => {
    const getTaxAmount = (amount, monthNumber) => {
      let taxRateIndex = 0;
      let previousTaxAmount = generalTaxAmount;
      for (generalTaxAmount = 0; generalIncomeAmountBeforeTax > taxRates[taxRateIndex].maxIncome;) {
        let taxAmount = (taxRates[taxRateIndex].maxIncome - (taxRateIndex ? taxRates[taxRateIndex - 1].maxIncome : 0)) * taxRates[taxRateIndex].taxRateInPercent / 100;
        generalTaxAmount += taxAmount;
        taxRateIndex++;
      }
      generalTaxAmount += (generalIncomeAmountBeforeTax - (taxRateIndex ? taxRates[taxRateIndex - 1].maxIncome : 0)) * (taxRates[taxRateIndex].taxRateInPercent / 100);
      let taxAmount = generalTaxAmount - previousTaxAmount;
      taxEveryMonth[monthNumber] = {
        value: taxEveryMonth[monthNumber].value + taxAmount,
        minTaxRateInPercent: monthNumber
          ? taxEveryMonth[monthNumber - 1].maxTaxRateInPercent
          : taxRates[0].taxRateInPercent,
        maxTaxRateInPercent: Math.max(
          taxEveryMonth[monthNumber].maxTaxRateInPercent,
          taxRates[taxRateIndex].taxRateInPercent
        )
      }
      return taxAmount;
    };

    generalIncomeAmountBeforeTax += amountBeforeTax;
    let taxAmount = getTaxAmount(0, monthNumber);

    return amountBeforeTax - taxAmount;
  };

  for (let monthNumber = 0; monthNumber < 13; monthNumber++) {
    salaryEveryMonth[monthNumber] = calculateAmounts(salaries[monthNumber], monthNumber);
    allBonuses[monthNumber] = calculateAmounts(bonuses[monthNumber], monthNumber);
  }

  return {
    salariesAfterTax: salaryEveryMonth,
    bonusesAfterTax: allBonuses,
    taxByMonth: taxEveryMonth
  };
}

function getSalaryAfterTaxForTargetMonth(salaries, bonuses, monthNumber){
  let result = getAmountsForEveryMonth(salaries, bonuses);
  return +result.salariesAfterTax[monthNumber - 1];
}

function getBonusAfterTaxForTargetMonth(salaries, bonuses, monthNumber){
  let result = getAmountsForEveryMonth(salaries, bonuses);
  return +result.bonusesAfterTax[monthNumber - 1];
}

function getTaxAmountForTargetMonth(salaries, bonuses, monthNumber){
  let result = getAmountsForEveryMonth(salaries, bonuses);
  return +result.taxByMonth[monthNumber - 1].value;
}

function getTaxRateForTargetMonth(salaries, bonuses, monthNumber){
  let result = getAmountsForEveryMonth(salaries, bonuses);
  let tax = result.taxByMonth[monthNumber - 1];
  return `${tax.minTaxRateInPercent}% — ${tax.maxTaxRateInPercent}%`;
}
