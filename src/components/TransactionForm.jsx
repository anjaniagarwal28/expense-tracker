import { useState } from "react";

function TransactionForm() {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      type,
      amount,
      category,
      description,
      date,
    });

    alert("Transaction added!");

    setAmount("");
    setDescription("");
    setDate("");
  };

  return (
    <div className="transaction-form">
      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit}>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Shopping</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Entertainment</option>
          <option>Salary</option>
          <option>Other</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">
          Add Transaction
        </button>

      </form>
    </div>
  );
}

export default TransactionForm;