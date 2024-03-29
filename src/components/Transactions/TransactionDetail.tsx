import { Button, Chip, Divider, Typography } from "@material-ui/core";
import classnames from 'classnames';
import EditSpentFromDialog from 'components/Transactions/EditSpentFromDialog';
import Spending from "data/Spending";
import Transaction from "data/Transaction";
import { Map } from 'immutable';
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { getSpending } from "shared/spending/selectors/getSpending";
import { getSelectedTransaction } from "shared/transactions/selectors/getSelectedTransaction";

import './styles/TransactionDetail.scss';

interface WithConnectionPropTypes {
  transaction?: Transaction;
  spending: Map<number, Spending>;
}

interface State {
  editSpentFromDialogOpen: boolean;
}

export class TransactionDetailView extends Component<WithConnectionPropTypes, State> {

  state = {
    editSpentFromDialogOpen: false,
  };

  openEditSpentFromDialog = () => {
    return this.setState({
      editSpentFromDialogOpen: true,
    });
  };

  closeEditSpentFromDialog = () => {
    return this.setState({
      editSpentFromDialogOpen: false,
    });
  };

  renderNoSelection = () => {

    return (
      <div className="h-full flex justify-center items-center">
        <div className="grid grid-cols-1 grid-rows-2 grid-flow-col gap-2">
          <Typography
            className="opacity-50 text-center"
            variant="h6"
          >
            Select a transaction to see more information about it...
          </Typography>
        </div>
      </div>
    )
  };

  render() {
    const { transaction, spending } = this.props;
    const { editSpentFromDialogOpen } = this.state;

    if (!transaction) {
      return this.renderNoSelection();
    }

    const spentFrom = spending.get(transaction.spendingId, null);

    return (
      <Fragment>
        { editSpentFromDialogOpen &&
        <EditSpentFromDialog
          isOpen={ editSpentFromDialogOpen }
          onClose={ this.closeEditSpentFromDialog }
          transaction={ transaction }
        />
        }

        <div className="w-full p-5 transaction-detail">
          <div className="grid grid-cols-1 grid-rows-2 grid-flow-col gap-1 w-auto">
            <Typography variant="h5">
              { transaction.date.format('MMMM Do, YYYY') }
            </Typography>
            <Typography variant="h6" className={ classnames('amount', {
              'addition': transaction.getIsAddition(),
            }) }>
              { transaction.getAmountString() }
            </Typography>
          </div>
          <Divider className="mt-5 mb-5"/>

          <div className="grid grid-cols-4 grid-rows-2 grid-flow-col gap-1 w-full">
            <div className="col-span-3 row-span-1">
              <Typography variant="h5">Name</Typography>
            </div>
            <div className="col-span-3 row-span-1">
              <Typography>{ transaction.name }</Typography>
            </div>
            <div className="col-span-1 row-span-2 justify-end flex">
              <Button
                color="primary"
                className="align-middle self-center"
              >
                Change
              </Button>
            </div>
          </div>
          <Divider className="mt-5 mb-5"/>

          <div className="grid grid-cols-4 grid-rows-2 grid-flow-col gap-1 w-full">
            <div className="col-span-3 row-span-1">
              <Typography variant="h5">Category</Typography>
            </div>
            <div className="col-span-3 row-span-1">
              {
                transaction.categories &&
                <Chip
                  className="mr-1 mb-1"
                  label={ transaction.categories[transaction.categories.length - 1] }
                  variant="outlined"
                />
              }
            </div>
            <div className="col-span-1 row-span-2 justify-end flex">
              <Button color="primary" className="align-middle self-center">Change</Button>
            </div>
          </div>
          <Divider className="mt-5 mb-5"/>

          {
            // Deposits are not spent from anything, so we don't want to show this for deposits.
            !transaction.getIsAddition() &&
            <Fragment>
              <div className="grid grid-cols-4 grid-rows-2 grid-flow-col gap-1 w-full">
                <div className="col-span-3 row-span-1">
                  <Typography variant="h5">Spent From</Typography>
                </div>
                <div className="col-span-3 row-span-1">
                  <Typography>{ spentFrom ? spentFrom.name : 'Safe-To-Spend' }</Typography>
                </div>
                <div className="col-span-1 row-span-2 justify-end flex">
                  <Button
                    color="primary"
                    className="align-middle self-center"
                    onClick={ this.openEditSpentFromDialog }
                  >
                    Change
                  </Button>
                </div>
              </div>
              <Divider className="mt-5 mb-5"/>
            </Fragment>
          }
        </div>
      </Fragment>
    );
  }
}

export default connect(
  (state) => ({
    transaction: getSelectedTransaction(state),
    spending: getSpending(state),
  }),
  {}
)(TransactionDetailView);
