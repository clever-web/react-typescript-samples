import * as React from 'react';

export const About: React.StatelessComponent<{}> = () => {
  return (
    <div className="row about-page col-12">
      <h1 className="jumbotron col-2">08 Param Navigation</h1>

      <div className="col-10" id="header-title">
        <h1>
          <small>This sample takes as starting point sample "07 Form".</small>
        </h1>
        <div className="col-10">
          <h3>
            <small>We are adding navigaton with params and form validations</small>
          </h3>
        </div>
      </div>

      <div className="col-2 top-buffer">
        <h3>Highlights</h3>
        <hr />
        <h3>
          <small>The most interesting parts worth to take a look</small>
        </h3>
      </div>

      <div className="col-10">
        <ul>
          <li className="top-buffer">
            <h4><b>API:</b></h4>
            <ul className="top-buffer">
              <li>
                <h4>
                  api/member/index.ts: <small>Add fetchMemberById method</small>
                </h4>
              </li>
            </ul>
          </li>
          <li className="top-buffer">
            <h4><b>Validations:</b></h4>
            <ul className="top-buffer">
              <li>
                <h4>
                  components/member/memberFormValidation.ts: <small>Add member form validations</small>
                </h4>
              </li>
            </ul>
          </li>
          <li className="top-buffer">
            <h4><b>Components:</b></h4>
            <ul className="top-buffer">
              <li>
                <h4>
                  router.tsx: <small>Add new route</small>
                </h4>
              </li>
              <li>
                <h4>
                  components/member/pageContainer.tsx: <small>Component with state</small>
                </h4>
              </li>
              <li>
                <h4>
                  components/members/memberRow.tsx: <small>Add Link element to navigate</small>
                </h4>
              </li>
              <li>
                <h4>
                  components/member/pageContainer.tsx: <small>Receiving member id from props and validating fields.</small>
                </h4>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
