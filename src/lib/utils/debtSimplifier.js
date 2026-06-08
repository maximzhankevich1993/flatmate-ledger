/**
 * Умное схлопывание долгов (Алгоритм минимизации транзакций)
 * @param {Array} balances - Массив сожителей из нашей SQL-view ( household_balances )
 * Each item: { profile_id, username, net_balance }
 * @returns {Array} Список оптимизированных чистых переводов
 */
export function simplifyDebts(balances) {
  // 1. Разделяем людей на должников (минус) и кредиторов (плюс)
  // Для удобства математики долги переводим в положительные числа
  let debtors = balances
    .filter(b => b.net_balance < 0)
    .map(b => ({ ...b, net_balance: Math.abs(b.net_balance) }))
    .sort((a, b) => b.net_balance - a.net_balance); // Сортируем от самых крупных долгов

  let creditors = balances
    .filter(b => b.net_balance > 0)
    .map(b => ({ ...b }))
    .sort((a, b) => b.net_balance - a.net_balance); // Сортируем от тех, кому должны больше всего

  const optimizedTransfers = [];

  let dIdx = 0;
  let cIdx = 0;

  // 2. Жадный алгоритм схлопывания (Greedy Match)
  while (dIdx < debtors.length && cIdx < creditors.length) {
    let debtor = debtors[dIdx];
    let creditor = creditors[cIdx];

    // Защита от микро-остатков из-за округления JS (0.0000001)
    if (debtor.net_balance < 0.01) { dIdx++; continue; }
    if (creditor.net_balance < 0.01) { cIdx++; continue; }

    // Сумма перевода — это минимум между тем, сколько должник может отдать, 
    // и тем, сколько кредитор готов принять
    let amountToTransfer = Math.min(debtor.net_balance, creditor.net_balance);

    // Фиксируем перевод
    optimizedTransfers.push({
      from_id: debtor.profile_id,
      from_name: debtor.username,
      to_id: creditor.profile_id,
      to_name: creditor.username,
      amount: Number(amountToTransfer.toFixed(2)) // Округляем до центов
    });

    // Обновляем остатки балансов после виртуального перевода
    debtor.net_balance -= amountToTransfer;
    creditor.net_balance -= amountToTransfer;

    // Если должник полностью закрыл долг, переходим к следующему должнику
    if (debtor.net_balance < 0.01) dIdx++;
    // IF кредитор получил всё своё, переходим к следующему кредитору
    if (creditor.net_balance < 0.01) cIdx++;
  }

  return optimizedTransfers;
}