import { createStore } from 'redux';
const initialState = {
  expenses: [],
};
const ADD_EXPENSE = 'ADD_EXPENSE';
const EDIT_EXPENSE = 'EDIT_EXPENSE';
const RESET_EXPENSES = 'RESET_EXPENSES';
const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };

    case EDIT_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? { ...expense, ...action.payload } : expense
        ),
      };

    case RESET_EXPENSES:
      return { ...state, expenses: [] };

    default:
      return state;
  }
};
export const addExpense = (name, amount, date, id = Date.now()) => ({
  type: ADD_EXPENSE,
  payload: { id, name, amount, date },
});

export const editExpense = (id, name, amount, date) => ({
  type: EDIT_EXPENSE,
  payload: { id, name, amount, date },
});

export const resetExpenses = () => ({
  type: RESET_EXPENSES,
});
const store = createStore(expenseReducer);

export default store;
