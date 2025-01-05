Основной функцией расчёта является getAmountsForEveryMonth.
Функция принимает на вход массив зарплат и массив премий за весь год, а результатом расчётом является объект со следующей структурой:
```json
{
  // Суммы ЗП за вычетом НДФЛ по месяцам
  salariesAfterTax: number[],

  // Суммы премии за вычетом НДФЛ по месяцам
  bonusesAfterTax:number[],

  // Суммы удержанного НДФЛ и применённые ставки по месяцам
  taxByMonth:object[]
}

// В свойстве taxByMonth объекты имеют следующую структуру
{
  // Сумма удержанного налога за месяца
  value: number,

  /// Минимальная применённая ставка НДФЛ в месяце
  minTaxRateInPercent:number,

  /// Максимальная применённая ставка НДФЛ в месяце
  maxTaxRateInPercent:number
}
```

Данный скрипт уже пригоден для использования в Excel или Custom Functions для Google Sheets.
