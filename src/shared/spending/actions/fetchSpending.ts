import Spending, { SpendingFields } from "data/Spending";
import { Map } from 'immutable';
import { Dispatch } from "redux";
import { getSelectedBankAccountId } from "shared/bankAccounts/selectors/getSelectedBankAccountId";
import { FETCH_SPENDING_FAILURE, FETCH_SPENDING_REQUEST, FETCH_SPENDING_SUCCESS } from "shared/spending/actions";
import request from "shared/util/request";

export const fetchSpendingRequest = {
  type: FETCH_SPENDING_REQUEST,
};

export const fetchSpendingFailure = {
  type: FETCH_SPENDING_FAILURE,
};

export default function fetchSpending() {
  return (dispatch: Dispatch, getState) => {
    const selectedBankAccountId = getSelectedBankAccountId(getState());
    if (!selectedBankAccountId) {
      return Promise.resolve();
    }

    dispatch(fetchSpendingRequest);

    return request().get(`/bank_accounts/${selectedBankAccountId}/spending`)
      .then(result => {
        dispatch({
          type: FETCH_SPENDING_SUCCESS,
          payload: Map<number, Map<number, Spending>>().withMutations(map => {
            (result.data || []).forEach((spending: SpendingFields) => {
              map.setIn([spending.bankAccountId, spending.spendingId], new Spending(spending));
            })
          }),
        });
      })
      .catch(error => {
        dispatch(fetchSpendingFailure);
        throw error;
      })
  }
}