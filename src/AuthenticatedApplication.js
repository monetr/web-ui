import { AppBar, Button, IconButton, InputLabel, Menu, MenuItem, Select, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { BrowserRouter as Router, Link as RouterLink, Redirect, Route, Switch, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import logout from "shared/authentication/actions/logout";
import fetchLinksIfNeeded from "shared/links/actions/fetchLinksIfNeeded";
import { getHasAnyLinks } from "shared/links/selectors/getHasAnyLinks";
import FirstTimeSetup from "views/FirstTimeSetup";

export class AuthenticatedApplication extends Component {
  state = {
    loading: true,
    anchorEl: null,
  };

  static propTypes = {
    logout: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    fetchLinksIfNeeded: PropTypes.func.isRequired,
    hasAnyLinks: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.props.fetchLinksIfNeeded()
      .then(() => this.setState({ loading: false }));
  }

  openMenu = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  closeMenu = () => {
    this.setState({
      anchorEl: null,
    });
  };

  doLogout = () => {
    this.props.logout();
    this.props.history.push('/login');
  };

  renderNotSetup = () => {
    return (
      <Switch>
        <Route>
          <FirstTimeSetup/>
        </Route>
      </Switch>
    )
  };

  renderSetup = () => {
    return (
      <Fragment>
        <AppBar position="static">
          <Toolbar>
            <Button to="/transactions" component={ RouterLink } color="inherit">Transactions</Button>
            <Button to="/expenses" component={ RouterLink } color="inherit">Expenses</Button>
            <Button to="/goals" component={ RouterLink } color="inherit">Goals</Button>
            <div style={ { marginLeft: 'auto' } }/>
            <div style={ { marginRight: '10px', marginLeft: '10px' } }>
              <InputLabel id="demo-simple-select-outlined-label">Bank Account</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={ 10 }
                onChange={ () => {
                } }
                label="Bank Account"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={ 10 }>US Bank</MenuItem>
                <MenuItem value={ 20 }>Twenty</MenuItem>
                <MenuItem value={ 30 }>Thirty</MenuItem>
              </Select>
            </div>
            <IconButton onClick={ this.openMenu } edge="start" color="inherit" aria-label="menu">
              <MenuIcon/>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={ this.state.anchorEl }
              keepMounted
              open={ Boolean(this.state.anchorEl) }
              onClose={ this.closeMenu }
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>My account</MenuItem>
              <MenuItem onClick={ this.doLogout }>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/register">
            <Redirect to="/"/>
          </Route>
          <Route path="/login">
            <Redirect to="/"/>
          </Route>
          <Route path="/transactions">
            <h1>Transactions</h1>
          </Route>
          <Route path="/expenses">
            <h1>Expenses</h1>
          </Route>
          <Route path="/goals">
            <h1>Goals</h1>
          </Route>
          <Route path="/">
            <h1>Home/Setup</h1>
          </Route>
          <Route>
            <h1>Not found</h1>
          </Route>
        </Switch>
      </Fragment>
    );
  }

  render() {
    if (this.state.loading) {
      return <Typography>Loading...</Typography>
    }

    if (this.props.hasAnyLinks) {
      return (
        <Router>
          { this.renderSetup() }
        </Router>
      );
    }

    return (
      <Router>
        { this.renderNotSetup() }
      </Router>
    );
  }
}

export default connect(
  state => ({
    hasAnyLinks: getHasAnyLinks(state),
  }),
  dispatch => bindActionCreators({
    logout,
    fetchLinksIfNeeded,
  }, dispatch),
)(withRouter(AuthenticatedApplication));