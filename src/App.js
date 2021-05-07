import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectResponse } from './redux/form/form.selectors';

import { Switch, Route } from 'react-router-dom';

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import './App.scss';

import Header from './components/header/header';
import Home from './pages/home';
import ThankYouPage from './pages/thankyou/ThankYouPage';

import GuardedRoute from './components/guarded-route/guarded-route';
import ErrorBoundry from './components/error-boundry/error-boundry';

import theme from './theme'


function App({ formResponse }) {

  const [isAuthenticated, setIstAuthenticated] = useState(false)

  useEffect(() => {
    const { status } = formResponse || {};
    if (status !== null && status === 201) {
      setIstAuthenticated(true)
    }

  }, [formResponse])

  return (
    <ThemeProvider theme={theme}>
      <main >
        <Header />
        <CssBaseline />
        <Switch>
          <ErrorBoundry>
            <Route exact path='/' component={Home} />
            {/* <Route exact path='/thankyou' component={ThankYouPage} /> */}
            <GuardedRoute path='/thankyou' component={ThankYouPage} auth={isAuthenticated} />
          </ErrorBoundry>
        </Switch>
      </main>
    </ThemeProvider>
  );
}

const mapStateToProps = createStructuredSelector({
  formResponse: selectResponse
})

export default connect(mapStateToProps, null)(App);
