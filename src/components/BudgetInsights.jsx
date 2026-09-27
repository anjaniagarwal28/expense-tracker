function BudgetInsights({
  transactions,
  monthlyBudget = 0,
}) {
  // --------------------------------
  // INCOME TRANSACTIONS
  // --------------------------------

  const incomeTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type === "income"
    );

  // --------------------------------
  // EXPENSE TRANSACTIONS
  // --------------------------------

  const expenseTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type === "expense"
    );

  // --------------------------------
  // TOTAL INCOME
  // --------------------------------

  const totalIncome =
    incomeTransactions.reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    );

  // --------------------------------
  // TOTAL EXPENSE
  // --------------------------------

  const totalExpense =
    expenseTransactions.reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    );

  // --------------------------------
  // BALANCE / SAVINGS
  // --------------------------------

  const savings =
    totalIncome -
    totalExpense;

  // --------------------------------
  // SAVINGS RATE
  // --------------------------------

  const savingsRate =
    totalIncome > 0
      ? (savings / totalIncome) * 100
      : 0;

  // --------------------------------
  // EXPENSE PERCENTAGE
  // --------------------------------

  const expensePercentage =
    totalIncome > 0
      ? (totalExpense / totalIncome) *
        100
      : 0;

  // --------------------------------
  // TOTAL TRANSACTIONS
  // --------------------------------

  const totalTransactions =
    transactions.length;

  // --------------------------------
  // AVERAGE EXPENSE
  // --------------------------------

  const averageExpense =
    expenseTransactions.length > 0
      ? totalExpense /
        expenseTransactions.length
      : 0;

  // --------------------------------
  // CATEGORY TOTALS
  // --------------------------------

  const categoryTotals = {};

  expenseTransactions.forEach(
    (transaction) => {
      const category =
        transaction.category ||
        "Other";

      if (
        !categoryTotals[category]
      ) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] +=
        Number(transaction.amount);
    }
  );

  // --------------------------------
  // HIGHEST CATEGORY
  // --------------------------------

  let highestCategory = "";
  let highestAmount = 0;

  Object.entries(
    categoryTotals
  ).forEach(
    ([category, amount]) => {
      if (
        amount >
        highestAmount
      ) {
        highestCategory =
          category;

        highestAmount =
          amount;
      }
    }
  );

  // --------------------------------
  // HIGHEST SPENDING MONTH
  // --------------------------------

  const monthTotals = {};

  expenseTransactions.forEach(
    (transaction) => {
      if (!transaction.date) {
        return;
      }

      const month =
        transaction.date.substring(
          0,
          7
        );

      if (!monthTotals[month]) {
        monthTotals[month] = 0;
      }

      monthTotals[month] +=
        Number(transaction.amount);
    }
  );

  let highestMonth = "";
  let highestMonthAmount = 0;

  Object.entries(
    monthTotals
  ).forEach(
    ([month, amount]) => {
      if (
        amount >
        highestMonthAmount
      ) {
        highestMonth =
          month;

        highestMonthAmount =
          amount;
      }
    }
  );

  // --------------------------------
  // BUDGET CALCULATIONS
  // --------------------------------

  const budgetRemaining =
    monthlyBudget -
    totalExpense;

  const budgetUsedPercentage =
    monthlyBudget > 0
      ? (totalExpense /
          monthlyBudget) *
        100
      : 0;

  // --------------------------------
  // FORMATTING FUNCTION
  // --------------------------------

  const formatMoney = (amount) => {
    return amount.toLocaleString(
      "en-IN"
    );
  };

  // --------------------------------
  // EMPTY STATE
  // --------------------------------

  if (transactions.length === 0) {
    return (
      <div>

        <h2>
          💡 Budget Insights
        </h2>

        <p className="insight">
          📭 No transaction data is
          available for this month.
          Add some income or expenses
          to see financial insights.
        </p>

      </div>
    );
  }

  return (
    <div>

      {/* TITLE */}

      <h2>
        💡 Budget Insights
      </h2>

      {/* --------------------------------
          BASIC SUMMARY
      -------------------------------- */}

      <p className="insight">

        📋 Total transactions:{" "}

        <strong>
          {totalTransactions}
        </strong>

      </p>

      <p className="insight">

        💰 Total income:{" "}

        <strong>
          ₹
          {formatMoney(
            totalIncome
          )}
        </strong>

      </p>

      <p className="insight">

        💸 Total expenses:{" "}

        <strong>
          ₹
          {formatMoney(
            totalExpense
          )}
        </strong>

      </p>

      {/* --------------------------------
          SAVINGS
      -------------------------------- */}

      <p className="insight">

        💵 Amount saved:{" "}

        <strong>
          ₹
          {formatMoney(
            Math.max(
              savings,
              0
            )
          )}
        </strong>

      </p>

      {totalIncome > 0 && (
        <p className="insight">

          📈 Savings rate:{" "}

          <strong>
            {savingsRate.toFixed(
              1
            )}
            %
          </strong>

        </p>
      )}

      {/* --------------------------------
          EXPENSE PERCENTAGE
      -------------------------------- */}

      {totalIncome > 0 && (
        <p className="insight">

          📊 You spent{" "}

          <strong>
            {expensePercentage.toFixed(
              1
            )}
            %
          </strong>

          {" "}of your income.

        </p>
      )}

      {/* --------------------------------
          HIGHEST CATEGORY
      -------------------------------- */}

      {highestCategory && (
        <p className="insight">

          🛒 Highest spending
          category:{" "}

          <strong>
            {highestCategory}
          </strong>

          {" "}— ₹

          <strong>
            {formatMoney(
              highestAmount
            )}
          </strong>

        </p>
      )}

      {/* --------------------------------
          AVERAGE EXPENSE
      -------------------------------- */}

      {expenseTransactions.length >
        0 && (
        <p className="insight">

          📊 Average expense:{" "}

          <strong>
            ₹
            {averageExpense.toFixed(
              2
            )}
          </strong>

        </p>
      )}

      {/* --------------------------------
          HIGHEST MONTH
      -------------------------------- */}

      {highestMonth && (
        <p className="insight">

          📅 Highest spending month:{" "}

          <strong>
            {highestMonth}
          </strong>

          {" "}— ₹

          <strong>
            {formatMoney(
              highestMonthAmount
            )}
          </strong>

        </p>
      )}

      {/* --------------------------------
          INCOME VS EXPENSE
      -------------------------------- */}

      {totalExpense >
      totalIncome ? (
        <p className="insight budget-warning">

          🚨 Your expenses are higher
          than your income.

        </p>
      ) : totalIncome > 0 ? (
        <p className="insight budget-success">

          ✅ Your income is higher
          than your expenses.

        </p>
      ) : null}

      {/* --------------------------------
          SAVINGS ADVICE
      -------------------------------- */}

      {savingsRate >= 20 &&
        totalIncome > 0 && (
        <p className="insight budget-success">

          🌟 Your current savings rate
          is {savingsRate.toFixed(1)}%.
          You are saving a portion of
          your recorded income.

        </p>
      )}

      {savingsRate > 0 &&
        savingsRate < 20 &&
        totalIncome > 0 && (
        <p className="insight">

          💡 Your current savings rate
          is {savingsRate.toFixed(1)}%.
          Reviewing non-essential
          expenses may help increase
          your savings.

        </p>
      )}

      {savings <= 0 &&
        totalIncome > 0 && (
        <p className="insight budget-warning">

          ⚠️ Your recorded expenses
          are using all or more of
          your recorded income.

        </p>
      )}

      {/* --------------------------------
          MONTHLY BUDGET
      -------------------------------- */}

      {monthlyBudget > 0 ? (
        <>

          <p className="insight">

            💰 Monthly budget:{" "}

            <strong>
              ₹
              {formatMoney(
                monthlyBudget
              )}
            </strong>

          </p>

          <p className="insight">

            📊 Budget used:{" "}

            <strong>
              {budgetUsedPercentage.toFixed(
                1
              )}
              %
            </strong>

          </p>

          {/* BUDGET EXCEEDED */}

          {budgetRemaining < 0 ? (
            <p className="insight budget-warning">

              🚨 You have exceeded your
              monthly budget by{" "}

              <strong>
                ₹
                {formatMoney(
                  Math.abs(
                    budgetRemaining
                  )
                )}
              </strong>

            </p>

          ) : budgetUsedPercentage >=
            80 ? (
            <p className="insight budget-warning">

              ⚠️ You have used{" "}

              <strong>
                {budgetUsedPercentage.toFixed(
                  1
                )}
                %
              </strong>

              {" "}of your monthly budget.

              {" "}

              <strong>
                ₹
                {formatMoney(
                  budgetRemaining
                )}
              </strong>

              {" "}remaining.

            </p>

          ) : (
            <p className="insight budget-success">

              ✅ You are within your
              monthly budget.

              {" "}

              <strong>
                ₹
                {formatMoney(
                  budgetRemaining
                )}
              </strong>

              {" "}remaining.

            </p>
          )}

        </>
      ) : (
        <p className="insight">

          💡 No monthly budget has
          been set yet.

        </p>
      )}

      {/* --------------------------------
          HIGH EXPENSE WARNING
      -------------------------------- */}

      {totalExpense > 5000 && (
        <p className="insight">

          💡 Your recorded expenses
          have crossed ₹5,000.
          Review your spending
          categories to understand
          where your money is going.

        </p>
      )}

      {/* --------------------------------
          NO EXPENSES
      -------------------------------- */}

      {totalExpense === 0 &&
        totalIncome > 0 && (
        <p className="insight budget-success">

          🌟 You have recorded income
          but no expenses for this
          month.

        </p>
      )}

    </div>
  );
}

export default BudgetInsights;