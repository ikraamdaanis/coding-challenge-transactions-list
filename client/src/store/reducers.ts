import { Actions } from '../types';

// Define the state type
export interface RootState {
  loading: boolean;
  transactionCreated: boolean;
  error: any;
}

// Initial state
const initialState: RootState = {
  loading: false,
  transactionCreated: true,
  error: null,
};

const reducer = (state = initialState, action: any): RootState => {
  switch (action.type) {
    case Actions.SendTransactionRequested:
      return { ...state, loading: true, error: null, transactionCreated: false };
    case Actions.SendTransactionSucceeded:
      return { ...state, loading: false, error: null, transactionCreated: true };
    case Actions.SendTransactionFailed:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default reducer;
