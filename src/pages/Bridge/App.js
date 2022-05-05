import React from 'react';
import './App.scss';

import ProgressBar from "./app/components/progress-bar";
import Form from './app/components/form';
import NoteContainer from './app/components/note-container';
import Transaction from "./app/components/transaction";
import Footer from "./app/components/footer";
import ChooseWalletModal from './app/components/modal/chooseWallet';
import AlertModal from './app/components/modal/alertNote';
import * as config from './app/config/config_front';
export const App = () => (
    <div className="App-bridge">
        <div className="container">
            <div className='wrapper-bridge'>
                {(config.isProgressBar ?
                    <ProgressBar/> :
                    null
                )}
                <Form/>
            </div>
            <Transaction />
            {config.isFooter ? <Footer /> : null}
        </div>
        <NoteContainer />
        <ChooseWalletModal />
        <AlertModal />
    </div>
);
