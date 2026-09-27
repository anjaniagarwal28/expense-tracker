function FinancialReport({
  income,
  expense,
  balance,
  monthlyBudget,
}) {
  const savingsPercentage =
    income > 0
      ? (balance / income) * 100
      : 0;

  const budgetUsedPercentage =
    monthlyBudget > 0
      ? (expense / monthlyBudget) * 100
      : 0;

  const formatMoney = (amount) => {
    return Number(amount).toLocaleString("en-IN");
  };

  return (
    <div className="financial-report">
      <h2>📋 Monthly Financial Report</h2>

      <div className="report-grid">

        <div className="report-item income-report">
          <span className="report-icon">💰</span>

          <div>
            <p>Total Income</p>
            <h3>
              ₹{formatMoney(income)}
            </h3>
          </div>
        </div>

        <div className="report-item expense-report">
          <span className="report-icon">💸</span>

          <div>
            <p>Total Expenses</p>
            <h3>
              ₹{formatMoney(expense)}
            </h3>
          </div>
        </div>

        <div className="report-item balance-report">
          <span className="report-icon">💵</span>

          <div>
            <p>Net Savings</p>
            <h3>
              ₹{formatMoney(balance)}
            </h3>
          </div>
        </div>

        <div className="report-item savings-report">
          <span className="report-icon">📈</span>

          <div>
            <p>Savings Percentage</p>
            <h3>
              {savingsPercentage.toFixed(1)}%
            </h3>
          </div>
        </div>

        <div className="report-item budget-report">
          <span className="report-icon">🎯</span>

          <div>
            <p>Budget Used</p>
            <h3>
              {budgetUsedPercentage.toFixed(1)}%
            </h3>
          </div>
        </div>

        <div className="report-item status-report">
          <span className="report-icon">📊</span>

          <div>
            <p>Financial Status</p>

            <h3>
              {balance >= 0
                ? "Positive"
                : "Overspending"}
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FinancialReport;