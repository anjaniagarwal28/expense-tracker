import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { signOut } from "firebase/auth";

import Papa from "papaparse";

import { auth, db } from "../firebase";

import ExpenseChart from "../components/ExpenseChart";
import MonthlyChart from "../components/MonthlyChart";
import BudgetInsights from "../components/BudgetInsights";
import FinancialSummaryChart from "../components/FinancialSummaryChart";
import FinancialReport from "../components/FinancialReport";
import PDFReport from "../components/PDFReport";
import Navbar from "../components/Navbar";

import "./Dashboard.css";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const currentMonth = new Date()
    .toISOString()
    .substring(0, 7);

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [monthlyBudget, setMonthlyBudget] =
    useState(0);

  const [budgetInput, setBudgetInput] =
    useState("");

  /* ==========================================
     GET TRANSACTIONS
     ========================================== */

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }

    const q = query(
      collection(db, "transactions"),
      where(
        "userId",
        "==",
        auth.currentUser.uid
      )
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const transactionData =
          snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }));

        setTransactions(transactionData);
      },
      (error) => {
        console.error(
          "Error loading transactions:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  /* ==========================================
     GET MONTHLY BUDGET
     ========================================== */

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }

    const budgetId =
      `${auth.currentUser.uid}_${selectedMonth}`;

    const budgetRef = doc(
      db,
      "budgets",
      budgetId
    );

    const unsubscribe = onSnapshot(
      budgetRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();

          setMonthlyBudget(
            Number(data.amount) || 0
          );

          setBudgetInput(
            data.amount?.toString() || ""
          );
        } else {
          setMonthlyBudget(0);
          setBudgetInput("");
        }
      },
      (error) => {
        console.error(
          "Error loading budget:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, [selectedMonth]);

  /* ==========================================
     ADD / UPDATE TRANSACTION
     ========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !date) {
      alert(
        "Please enter amount and date."
      );
      return;
    }

    try {
      const transactionData = {
        userId:
          auth.currentUser.uid,

        type: type,

        amount: Number(amount),

        category: category,

        date: date,

        description:
          description.trim(),
      };

      if (editingId) {
        const transactionRef = doc(
          db,
          "transactions",
          editingId
        );

        await updateDoc(
          transactionRef,
          transactionData
        );

        alert(
          "Transaction updated successfully!"
        );
      } else {
        await addDoc(
          collection(db, "transactions"),
          transactionData
        );

        alert(
          "Transaction added successfully!"
        );
      }

      setAmount("");
      setCategory("Food");
      setDate("");
      setDescription("");
      setEditingId(null);

    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong: " +
          error.message
      );
    }
  };

  /* ==========================================
     EDIT TRANSACTION
     ========================================== */

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);

    setType(transaction.type);

    setAmount(
      transaction.amount.toString()
    );

    setCategory(
      transaction.category || "Food"
    );

    setDate(
      transaction.date || ""
    );

    setDescription(
      transaction.description || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================
     CANCEL EDIT
     ========================================== */

  const handleCancelEdit = () => {
    setEditingId(null);

    setAmount("");
    setCategory("Food");
    setDate("");
    setDescription("");
  };

  /* ==========================================
     DELETE TRANSACTION
     ========================================== */

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this transaction?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "transactions", id)
      );

      alert(
        "Transaction deleted successfully!"
      );

    } catch (error) {
      console.error(error);

      alert(
        "Delete failed: " +
          error.message
      );
    }
  };

  /* ==========================================
     LOGOUT
     ========================================== */

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);

      alert(
        "Logout failed: " +
          error.message
      );
    }
  };

  /* ==========================================
     MONTHLY TRANSACTIONS
     ========================================== */

  const monthlyTransactions =
    transactions.filter(
      (transaction) =>
        transaction.date &&
        transaction.date.startsWith(
          selectedMonth
        )
    );

  /* ==========================================
     SEARCH + FILTER
     ========================================== */

  const filteredTransactions =
    monthlyTransactions.filter(
      (transaction) => {
        const searchText =
          search.toLowerCase();

        const matchesSearch =
          transaction.category
            ?.toLowerCase()
            .includes(searchText) ||
          transaction.description
            ?.toLowerCase()
            .includes(searchText);

        const matchesType =
          filterType === "all" ||
          transaction.type ===
            filterType;

        return (
          matchesSearch &&
          matchesType
        );
      }
    );

  /* ==========================================
     TOTAL INCOME
     ========================================== */

  const totalIncome =
    monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "income"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount),
        0
      );

  /* ==========================================
     TOTAL EXPENSE
     ========================================== */

  const totalExpense =
    monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount),
        0
      );

  /* ==========================================
     BALANCE
     ========================================== */

  const balance =
    totalIncome - totalExpense;

  /* ==========================================
     BUDGET REMAINING
     ========================================== */

  const budgetRemaining =
    Number(monthlyBudget) -
    totalExpense;

  /* ==========================================
     SAVE MONTHLY BUDGET
     ========================================== */

  const handleSaveBudget =
    async () => {
      if (
        !budgetInput ||
        Number(budgetInput) <= 0
      ) {
        alert(
          "Please enter a valid budget amount."
        );

        return;
      }

      try {
        const budgetId =
          `${auth.currentUser.uid}_${selectedMonth}`;

        await setDoc(
          doc(
            db,
            "budgets",
            budgetId
          ),
          {
            userId:
              auth.currentUser.uid,

            month:
              selectedMonth,

            amount:
              Number(budgetInput),
          }
        );

        alert(
          "Monthly budget saved successfully!"
        );

      } catch (error) {
        console.error(error);

        alert(
          "Budget save failed: " +
            error.message
        );
      }
    };

  /* ==========================================
     CSV EXPORT
     ========================================== */

  const handleExportCSV = () => {
    if (
      monthlyTransactions.length ===
      0
    ) {
      alert(
        "No transactions available for this month!"
      );

      return;
    }

    const csvData =
      monthlyTransactions.map(
        (transaction) => ({
          Type:
            transaction.type,

          Amount:
            transaction.amount,

          Category:
            transaction.category,

          Date:
            transaction.date,

          Description:
            transaction.description ||
            "",
        })
      );

    const csv =
      Papa.unparse(csvData);

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `expense-transactions-${selectedMonth}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  /* ==========================================
     FORMAT MONEY
     ========================================== */

  const formatMoney = (value) => {
    return Number(value).toLocaleString(
      "en-IN"
    );
  };

  return (
    <div className="dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div className="header-brand">

          <h1>
            💰 Expense Tracker
          </h1>

          <p>
            Manage your money smarter
          </p>

        </div>

        <div className="header-right">

          <span className="user-email">
            👤 {auth.currentUser?.email}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* NAVBAR */}

      <Navbar />

      <main className="dashboard-container">

        {/* MONTH SELECTOR */}

        <section className="card month-selector">

          <div>
            <h2>
              📅 Select Month
            </h2>

            <p>
              View your financial activity
              for a specific month.
            </p>
          </div>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                e.target.value
              )
            }
          />

        </section>

        {/* SUMMARY CARDS */}

        <section
          className="summary-grid"
          id="dashboard"
        >

          <div className="summary-card income-card">

            <div className="summary-icon">
              💰
            </div>

            <div>
              <p>Total Income</p>

              <h2>
                ₹{formatMoney(totalIncome)}
              </h2>
            </div>

          </div>

          <div className="summary-card expense-card">

            <div className="summary-icon">
              💸
            </div>

            <div>
              <p>Total Expense</p>

              <h2>
                ₹{formatMoney(totalExpense)}
              </h2>
            </div>

          </div>

          <div className="summary-card balance-card">

            <div className="summary-icon">
              💵
            </div>

            <div>
              <p>Balance</p>

              <h2>
                ₹{formatMoney(balance)}
              </h2>
            </div>

          </div>

          <div className="summary-card transaction-card">

            <div className="summary-icon">
              📋
            </div>

            <div>
              <p>Transactions</p>

              <h2>
                {monthlyTransactions.length}
              </h2>
            </div>

          </div>

        </section>

        {/* ADD TRANSACTION */}

        <section className="card">

          <h2>
            {editingId
              ? "✏️ Edit Transaction"
              : "➕ Add Transaction"}
          </h2>

          <form
            className="transaction-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>
                Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >

                <option value="expense">
                  Expense
                </option>

                <option value="income">
                  Income
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Amount
              </label>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                min="0"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                <option value="Food">
                  Food
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Travel">
                  Travel
                </option>

                <option value="Bills">
                  Bills
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Description
              </label>

              <input
                type="text"
                placeholder="Optional description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="form-buttons">

              <button
                type="submit"
                className="primary-btn"
              >
                {editingId
                  ? "Update Transaction"
                  : "Add Transaction"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={
                    handleCancelEdit
                  }
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* BUDGET */}

        <section
          className="card budget-section"
          id="budget"
        >

          <div className="section-header">

            <div>

              <h2>
                🎯 Monthly Budget
              </h2>

              <p>
                Set a spending limit for{" "}
                <strong>
                  {selectedMonth}
                </strong>
              </p>

            </div>

          </div>

          <div className="budget-input-row">

            <input
              type="number"
              placeholder="Enter monthly budget"
              value={budgetInput}
              onChange={(e) =>
                setBudgetInput(
                  e.target.value
                )
              }
              min="0"
            />

            <button
              className="primary-btn"
              onClick={
                handleSaveBudget
              }
            >
              Save Budget
            </button>

          </div>

          <div className="budget-summary">

            <div>
              <span>
                Monthly Budget
              </span>

              <strong>
                ₹
                {formatMoney(
                  monthlyBudget
                )}
              </strong>
            </div>

            <div>
              <span>
                Amount Spent
              </span>

              <strong>
                ₹
                {formatMoney(
                  totalExpense
                )}
              </strong>
            </div>

            <div>
              <span>
                Remaining
              </span>

              <strong
                className={
                  budgetRemaining < 0
                    ? "negative"
                    : "positive"
                }
              >
                ₹
                {formatMoney(
                  budgetRemaining
                )}
              </strong>
            </div>

          </div>

          {monthlyBudget > 0 && (
            <div className="budget-progress">

              <div className="progress-header">

                <span>
                  Budget Usage
                </span>

                <span>
                  {(
                    (totalExpense /
                      monthlyBudget) *
                    100
                  ).toFixed(1)}
                  %
                </span>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      (totalExpense /
                        monthlyBudget) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>
          )}

        </section>

        {/* TRANSACTIONS */}

        <section
          className="card"
          id="transactions"
        >

          <div className="section-header">

            <div>

              <h2>
                🔎 Transactions
              </h2>

              <p>
                Search and filter your
                monthly transactions.
              </p>

            </div>

            <button
              className="secondary-btn"
              onClick={
                handleExportCSV
              }
            >
              📥 Export CSV
            </button>

          </div>

          <div className="filter-row">

            <input
              type="text"
              placeholder="Search category or description..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Transactions
              </option>

              <option value="income">
                Income
              </option>

              <option value="expense">
                Expense
              </option>

            </select>

          </div>

          {filteredTransactions.length ===
          0 ? (

            <div className="empty-state">

              <p>
                📭 No transactions found
                for this month.
              </p>

            </div>

          ) : (

            <div className="transaction-list">

              {filteredTransactions.map(
                (transaction) => (

                  <div
                    className="transaction-item"
                    key={
                      transaction.id
                    }
                  >

                    <div className="transaction-info">

                      <div className="transaction-title">

                        <span
                          className={
                            transaction.type ===
                            "income"
                              ? "transaction-badge income-badge"
                              : "transaction-badge expense-badge"
                          }
                        >
                          {transaction.type ===
                          "income"
                            ? "Income"
                            : "Expense"}
                        </span>

                        <strong>
                          {transaction.category}
                        </strong>

                      </div>

                      {transaction.description && (
                        <p>
                          {
                            transaction.description
                          }
                        </p>
                      )}

                      <small>
                        📅{" "}
                        {transaction.date}
                      </small>

                    </div>

                    <div className="transaction-right">

                      <strong
                        className={
                          transaction.type ===
                          "income"
                            ? "amount-income"
                            : "amount-expense"
                        }
                      >
                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}
                        ₹
                        {formatMoney(
                          transaction.amount
                        )}
                      </strong>

                      <div className="transaction-actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(
                              transaction
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              transaction.id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* REPORTS */}

        <section
          id="reports"
          className="reports-section"
        >

          <div className="section-title">

            <h2>
              📊 Financial Reports
            </h2>

            <p>
              Analyze your financial
              activity for{" "}
              <strong>
                {selectedMonth}
              </strong>
            </p>

          </div>

          {/* CHARTS */}

          <div className="charts-grid">

            <div className="card chart-card">

              <MonthlyChart
                transactions={
                  monthlyTransactions
                }
              />

            </div>

            <div className="card chart-card">

              <ExpenseChart
                transactions={
                  monthlyTransactions
                }
              />

            </div>

            <div className="card chart-card">

              <FinancialSummaryChart
                income={
                  totalIncome
                }
                expense={
                  totalExpense
                }
                balance={
                  balance
                }
              />

            </div>

          </div>

          {/* FINANCIAL REPORT + PDF */}

          <div className="card financial-report-card">

            <FinancialReport
              income={
                totalIncome
              }
              expense={
                totalExpense
              }
              balance={
                balance
              }
              monthlyBudget={
                monthlyBudget
              }
            />

            <PDFReport
              selectedMonth={
                selectedMonth
              }
              income={
                totalIncome
              }
              expense={
                totalExpense
              }
              balance={
                balance
              }
              monthlyBudget={
                monthlyBudget
              }
              transactions={
                monthlyTransactions
              }
            />

          </div>

        </section>

        {/* BUDGET INSIGHTS */}

        <section className="card">

          <BudgetInsights
            transactions={
              monthlyTransactions
            }
            monthlyBudget={
              monthlyBudget
            }
          />

        </section>

        {/* ACCOUNT */}

        <section
          className="card account-section"
          id="account"
        >

          <h2>
            👤 Account
          </h2>

          <div className="account-info">

            <div className="account-avatar">
              👤
            </div>

            <div>

              <p>
                <strong>
                  Email
                </strong>
              </p>

              <p>
                {auth.currentUser?.email}
              </p>

            </div>

          </div>

          <button
            className="logout-btn account-logout"
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="dashboard-footer">

        <p>
          💰 Expense Tracker
        </p>

        <p>
          BCA Final Year Project
        </p>

        <p>
          Built with React.js +
          Firebase + Chart.js
        </p>

      </footer>

    </div>
  );
}

export default Dashboard;