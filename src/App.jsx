import React, { useState, useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, editExpense, resetExpenses } from './store';

function App() {
  const [totalBudget, setTotalBudget] = useState(null);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [isBudgetSet, setIsBudgetSet] = useState(false);

  const expenses = useSelector((state) => state.expenses);
  const dispatch = useDispatch();

 
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    savedExpenses.forEach((expense) => {
      dispatch(addExpense(expense.name, expense.amount, expense.date, expense.id));
    });
  }, [dispatch]);


  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = () => {
    if (expenseName && expenseAmount) {
      const date = expenseDate || new Date().toISOString().split('T')[0]; // Use provided date or today's date
      dispatch(addExpense(expenseName, Number(expenseAmount), date));
      setExpenseName('');
      setExpenseAmount('');
      setExpenseDate('');
    }
  };

  const handleEditExpense = (id) => {
    const expense = expenses.find((expense) => expense.id === id);
    if (expense) {
      setExpenseName(expense.name);
      setExpenseAmount(expense.amount);
      setExpenseDate(expense.date);
      setEditMode(true);
      setSelectedExpenseId(id);
    }
  };

  const handleSaveEditedExpense = () => {
    if (expenseName && expenseAmount && selectedExpenseId) {
      const date = expenseDate || new Date().toISOString().split('T')[0];
      dispatch(editExpense(selectedExpenseId, expenseName, Number(expenseAmount), date));
      setExpenseName('');
      setExpenseAmount('');
      setExpenseDate('');
      setEditMode(false);
      setSelectedExpenseId(null);
    }
  };
 console.log("budgetcorect");
  const handleSetBudget = () => {
    if (totalBudget && totalBudget > 0) {
      setIsBudgetSet(true);
    }
  };
  console.log("handlerequest");
  const handleReset = () => {
    dispatch(resetExpenses());
    localStorage.removeItem('expenses');
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const remainingBudget = Math.max(0, totalBudget - totalExpenses); // Prevent negative remaining budget

  return (
    <div className="App">
      <h1>💸Expense Tracker💸</h1>

      {!isBudgetSet && (
        <div className="set-budget">
          <h2>Set Your Budget</h2>
     <input
           type="number"
           value={totalBudget || ''}
          onChange={(e) => setTotalBudget(Number(e.target.value))}
          placeholder="Enter Budget"
          />
          <button onClick={handleSetBudget} disabled={!totalBudget || totalBudget <= 0}>
            Set Budget
          </button>
        </div>
      )}

      {isBudgetSet && (
        <div className="budget-info">
          <div className="Total">Total Budget: ${totalBudget}💵</div>
          <div className="Left">Remaining Budget: ${remainingBudget}💵</div>
        </div>
      )}

      {isBudgetSet && (
        <>
          <div className="add-expense-form">
            <input
              type="text"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              placeholder="Expense Name"
            />
            <input
              type="number"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="Amount"
            />
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              placeholder="Date"
            />
            {editMode ? (
              <button onClick={handleSaveEditedExpense}>Save Expense</button>
            ) : (
              <button onClick={handleAddExpense}>+</button>
            )}
            <button onClick={handleReset}>Reset</button>
          </div>

          <h2>Expenses</h2>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id} className="expense-item">
                <div className="expense-name-amount">
                  <span>{expense.name} - ${expense.amount}</span>
                </div>
                <div className="expense-date">
                  <span>{expense.date}</span>
                </div>
                <button onClick={() => handleEditExpense(expense.id)}>Edit</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
