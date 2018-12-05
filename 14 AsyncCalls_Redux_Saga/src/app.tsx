import * as React from 'react';
import { Header } from './components';
import {LoadingSpinnerComponent} from './common/components/spinner/loadingSpinner';

export const App: React.StatelessComponent<{}> = (props) => {
  return (
    <>
      <LoadingSpinnerComponent />
      <Header />
    </>

  );
}
