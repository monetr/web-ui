import React, { Component, Fragment } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Formik, FormikHelpers } from "formik";
import { Button, CircularProgress, Snackbar, TextField } from "@material-ui/core";
import classnames from "classnames";
import CaptchaMaybe from "views/Captcha/CaptchaMaybe";
import { Alert, AlertTitle } from "@material-ui/lab";
import verifyEmailAddress from "util/verifyEmailAddress";
import Logo from 'assets';
import request from "shared/util/request";

interface ResendValues {
  email: string | null;
}

interface WithConnectionPropTypes extends RouteComponentProps {

}

interface State {
  loading: boolean;
  error: string | null;
  emailAddress: string | null;
  verification: string | null;
}

class ResendVerification extends Component<WithConnectionPropTypes, State> {

  state = {
    loading: false,
    error: null,
    emailAddress: null,
    verification: null,
  };

  componentDidMount() {
    const { state: routeState } = this.props.location;

    if (routeState && routeState['emailAddress']) {
      this.setState({
        emailAddress: routeState['emailAddress'],
      });
    }
  }

  resendVerification = (emailAddress: string): Promise<void> => {
    this.setState({
      loading: true,
    });

    return request().post('/authentication/verify/resend', {
      'email': emailAddress,
    })
      .then()
  };

  validateInput = (values: ResendValues): Partial<ResendValues> | null => {
    let errors: Partial<ResendValues> = {};

    if (values.email) {
      if (!verifyEmailAddress(values.email)) {
        errors['email'] = 'Please provide a valid email address.';
      }
    }

    return errors;
  };

  submit = (values: ResendValues, helpers: FormikHelpers<ResendValues>): Promise<void> => {
    helpers.setSubmitting(true);
    return this.resendVerification(values.email)
      .finally(() => helpers.setSubmitting(false));
  };

  renderErrorMaybe = () => {
    const { error } = this.state;
    if (!error) {
      return null;
    }

    return (
      <Snackbar open autoHideDuration={ 10000 }>
        <Alert variant="filled" severity="error">
          <AlertTitle>Error</AlertTitle>
          { this.state.error }
        </Alert>
      </Snackbar>
    );
  };

  render() {
    const initialValues: ResendValues = {
      email: null,
    }

    return (
      <Fragment>
        { this.renderErrorMaybe() }
        <Formik
          initialValues={ initialValues }
          validate={ this.validateInput }
          onSubmit={ this.submit }
        >
          { ({
               values,
               errors,
               touched,
               handleChange,
               handleBlur,
               handleSubmit,
               isSubmitting,
               submitForm,
             }) => (
            <form onSubmit={ handleSubmit } className="h-full overflow-y-auto">
              <div className="flex items-center justify-center w-full h-full max-h-full">
                <div className="w-full p-10 xl:w-3/12 lg:w-5/12 md:w-2/3 sm:w-10/12 max-w-screen-sm sm:p-0">
                  <div className="flex justify-center w-full mb-5">
                    <img src={ Logo } className="w-1/3"/>
                  </div>
                  <div className="w-full">
                    <div className="w-full pb-2.5">
                      <TextField
                        autoComplete="username"
                        autoFocus
                        className="w-full"
                        disabled={ isSubmitting }
                        error={ touched.email && !!errors.email }
                        helperText={ (touched.email && errors.email) ? errors.email : null }
                        id="login-email"
                        label="Email"
                        name="email"
                        onBlur={ handleBlur }
                        onChange={ handleChange }
                        value={ values.email }
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <CaptchaMaybe
                    show
                    loading={ isSubmitting }
                    onVerify={ (value) => this.setState({
                      verification: value,
                    }) }
                  />
                  <div className="w-full pt-2.5 mb-10">
                    <Button
                      className="w-full"
                      color="primary"
                      disabled={ isSubmitting || !values.email }
                      onClick={ submitForm }
                      type="submit"
                      variant="contained"
                    >
                      { isSubmitting && <CircularProgress
                        className={ classnames('mr-2', {
                          'opacity-50': isSubmitting,
                        }) }
                        size="1em"
                        thickness={ 5 }
                      /> }
                      { isSubmitting ? 'Sending Verification Link...' : 'Resend Verification Link' }
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) }
        </Formik>
      </Fragment>
    );
  }
}

export default connect(
  state => ({}),
  {},
)(withRouter(ResendVerification));
