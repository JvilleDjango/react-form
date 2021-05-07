import React from 'react';

import './error-boundry.scss'

class ErrorBoundry extends React.Component {

    constructor() {
        super()

        this.state = {
            hasErrored: false
        }
    }

    static getDerivedStateFromError(error) {

        return { hasErrored: true }
    }

    componentDidCatch(error, info) {

        console.log(error);
    }

    render() {
        if (this.state.hasErrored) {
            return (
                <div className="error__Boundry">
                    <h1>Oh No!, Something Went Wrong.</h1>
                    <h2>Please contact our sales team to further assist you.</h2>
                    <h3>1-800-999-9999 or email us at <a href="mailto:sales@intellective.com">sales@intellective.com</a></h3>
                </div>
                )
        }

        return this.props.children
    }


}

export default ErrorBoundry