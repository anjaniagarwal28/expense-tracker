function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <a href="#dashboard">
          🏠 Dashboard
        </a>

        <a href="#transactions">
          💰 Transactions
        </a>

        <a href="#reports">
          📊 Reports
        </a>

        <a href="#budget">
          💡 Budget
        </a>

        <a href="#account">
          👤 Account
        </a>

      </div>
    </nav>
  );
}

export default Navbar;