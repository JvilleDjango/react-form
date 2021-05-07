import React from 'react';

import LicenseAgreementPreconfig from './license-agreement-preconfig';
import LicenseAgreementOnlineHosting from './license-agreement-online-hosted';
import LicenseAgreementOnlineCustomerHosting from './license-agreement-online-customer-hosted';


const agreement = (props) => {
    switch (props) {
        case 'PreConfigured_SharePoint_Demo_ICloud':
            return <LicenseAgreementPreconfig />
        case 'SharePoint_Online_ICloud':
            return <LicenseAgreementOnlineHosting />
        case 'SharePoint_Online_Customer_Env':
            return <LicenseAgreementOnlineHosting />
        case 'SharePoint_OnPremise':
            return <LicenseAgreementOnlineCustomerHosting />
        case 'Other_Deployment_Options':
            return null
    }
}

const LicenseAgreement = ({ agreementType }) => {
    return (
        <div>
            {agreement(agreementType)}
        </div>
    )
}

export default LicenseAgreement;