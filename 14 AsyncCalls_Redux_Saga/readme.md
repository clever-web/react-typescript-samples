# 10 Spinner

In this sample we will be using [react-promise-tracker](https://github.com/Lemoncode/react-promise-tracker) to display a loading spinner while loading on asynchronous calls.
To do so we will take as an startup point sample _09 Redux_.

Summary steps:

- Install [react-promise-tracker](https://github.com/Lemoncode/react-promise-tracker) 
- Create a common component for a spinner
- Create a CSS to make the spinner looks good.
- Add HOC react-promise-tracker to the component
- Update actions to use [react-promise-tracker](https://github.com/Lemoncode/react-promise-tracker) by wraping asynchronous calls. 
- Include the spinner component in our app

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (v8.11.3) if they are not already
installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v`
in a terminal/console window. Older versions may produce errors.

## Steps to build it

- Copy the content of the `09 Redux` folder to an empty folder for the sample.

- Install the npm packages described in the `package.json` and verify that it works:

 ```bash
 $ npm install
 ```
- We also need to install [react-promise-tracker](https://github.com/Lemoncode/react-promise-tracker).

```bash
$ npm install react-promise-tracker --save
```
>Note: We don't need to install any typings for this library since is already contained in this library package.

## Create a Spinner component

First, lets create a new folder to hold the component and its relative files.
### ./src/common/spinner/loadingSpinner.tsx

To do this we will make use of a very cool library called [React Spinners](https://www.npmjs.com/package/react-spinners). You can also check the [demo page](http://www.davidhu.io/react-spinners/).

To start with this. We'll need to install this library:
```bash
$npm install react-spinners --save
```

After we are done with he installation, we'll need to add some configuration to our _.babel.rc_ file:

```diff
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ]
  ],
+  "plugins": [
+    "emotion"
+  ]
}

```
Now that we are ready to go, we have to create our spinner component that will display our cool spinner.


```tsx
import * as React from 'react';
import './loadingSpinner.css';
import {BeatLoader} from 'react-spinners';

interface myProps {
  trackedPromiseInProgress?: boolean;
}

const InnerLoadingSpinerComponent: React.StatelessComponent<myProps> = (props) => {
   if (props.trackedPromiseInProgress === true) {
    return (
      <div className="loading">
        <BeatLoader loading= {props.trackedPromiseInProgress}
                    color={'#FFFF00'}
        />
      </div>
    )
  } else { return null } 
}

```

We will also add a CSS file to povide some style to our spinner, nothing too fancy as we've already defined the color with the component properties, just some positioning to display the component at the center of the screen:
>Note that [React Spinners](https://www.npmjs.com/package/react-spinners) already provide us with some properties that allows us to style our component.

### ./src/common/spinner/loadingSpinner.css
```css
.loading {
	position: absolute;
	left: 50%;
	top: 50%;
}

```

Now that we have created our component, let's wrap it around react-promise-tracker HoC. This HoC listens for any tracked ajax call update and shows / displays the inner spinner component that we have created.

> If you would like to learn more about HoC you can check this sites: https://reactjs.org/docs/higher-order-components.html
https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e
### ./src/common/spinner/loadingSpinner.tsx

```diff
import * as React from 'react';
import './loadingSpinner.css';
+import { promiseTrackerHoc } from 'react-promise-tracker';
import {BeatLoader} from 'react-spinners';

interface myProps {
  trackedPromiseInProgress?: boolean;
}

const InnerLoadingSpinerComponent: React.StatelessComponent<myProps> = (props:myProps) => {
   if (props.trackedPromiseInProgress === true) {
    return (
      <div className="loading">
        <BeatLoader loading= {props.trackedPromiseInProgress}
                    color={'#FFFF00'}
        />
      </div>
    )
  } else { return null } 
}

+ export const LoadingSpinnerComponent = promiseTrackerHoc(InnerLoadingSpinerComponent);

```

We will also need to create a barrel to ease the access to the spinner component.

### ./src/common/spinner/index.ts


```ts
export {LoadingSpinnerComponent} from './loadingSpinner';
```

After this, we only need to wrap our asynchronous calls with a *trackpromise statement* and we will have all the magic done.

## Wraping the asynchronous calls

### ./src/components/member/actions/fetchMemberById.ts

```diff
import { actionTypes } from '../../../common/constants/actionTypes';
import { MemberEntity } from '../../../model';
import { memberAPI } from '../../../api/member';
+import { trackPromise } from 'react-promise-tracker';

export const fetchMemberByIdAction = (id: number) => (dispatch) => {
+  trackPromise(
    memberAPI.fetchMemberById(id)
      .then((member) => {
        dispatch(fetchMemberByIdCompleted(member));
      })
+  );
};

const fetchMemberByIdCompleted = (member: MemberEntity) => ({
  type: actionTypes.FETCH_MEMBER_BY_ID_COMPLETED,
  payload: member,
});
```

### ./src/components/member/actions/memberFieldChange.ts

```diff

import { FieldValidationResult } from 'lc-form-validation';
import { actionTypes } from '../../../common/constants/actionTypes';
import { MemberEntity } from '../../../model';
import { memberFormValidation } from '../memberFormValidation';
+ import { trackPromise } from 'react-promise-tracker';

export const memberFieldChangeAction = (member: MemberEntity, fieldName: string, value: any) => (dispatch) => {
+  trackPromise(
    memberFormValidation.validateField(member, fieldName, value)
    .then((fieldValidationResult) => {
      dispatch(memberFieldChangeCompleted(fieldValidationResult, value));
    })
+    );
};

export interface MemberFieldChangePayload {
  fieldValidationResult: FieldValidationResult;
  value: any;
}

const memberFieldChangeCompleted = (fieldValidationResult: FieldValidationResult, value: any) => ({
  type: actionTypes.UPDATE_MEMBER_FIELD,
  payload: {
    fieldValidationResult,
    value,
  } as MemberFieldChangePayload,
});

```

### ./src/components/member/actions/saveMember.ts

```diff
import { FormValidationResult } from 'lc-form-validation';
import * as toastr from 'toastr';
import { actionTypes } from '../../../common/constants/actionTypes';
import { MemberEntity } from '../../../model';
import { memberAPI } from '../../../api/member';
import { memberFormValidation } from '../memberFormValidation';
+ import {trackPromise} from 'react-promise-tracker';

export const saveMemberAction = (member: MemberEntity) => (dispatch) => {
+  trackPromise(
    memberFormValidation.validateForm(member)
      .then((formValidationResult) => {
        if (formValidationResult.succeeded) {
          saveMember(member);
        }
        dispatch(saveMemberActionCompleted(formValidationResult));
      })
+    );
};

const saveMember = (member: MemberEntity) => {
+  trackPromise(
    memberAPI.saveMember(member)
      .then(() => {
        toastr.success('Member saved.');
        history.back();
      })
      .catch(toastr.error)
+  );
};

const saveMemberActionCompleted = (formValidationResult: FormValidationResult) => ({
  type: actionTypes.SAVE_MEMBER,
  payload: formValidationResult,
});

```

### ./src/components/members/actions/fetchMembers.ts

```diff
import { actionTypes } from '../../../common/constants/actionTypes';
import { MemberEntity } from '../../../model';
import { memberAPI } from '../../../api/member';
+ import { trackPromise } from 'react-promise-tracker';

export const fetchMembersAction = () => (dispatch) => {
+  trackPromise(
    memberAPI.fetchMembersAsync()
    .then((members) => {
      dispatch(fetchMembersCompleted(members));
    })
+  );
};

const fetchMembersCompleted = (members: MemberEntity[]) => ({
  type: actionTypes.FETCH_MEMBERS_COMPLETED,
  payload: members,
});

```

After this, we will only need to place the spinner in the app component.

```diff
import * as React from 'react';
import { Header } from './components';
+ import {LoadingSpinnerComponent} from '../src/common/components/spinner/loadingSpinner';

export const App: React.StatelessComponent<{}> = (props) => {
  return (
    <div className="container-fluid">
+      <LoadingSpinnerComponent />
      <Header />
    </div>

  );
}

```

## Repository
To make the spinner display more visible, we'll add a new component with and asynchronous call into the members page that will show a list of repositories. To do so, we will start by creating a new folder to hold this new component and the necessary api calls.

First thing we need to do is to define a new model with a repository interface and ipdate its barrel:
### ./src/model/repositoryEntity.ts
```ts
export interface RepositoryEntity {
    id: string;
    name: string;
    description:string;
}
```
### ./src/model/index.ts
```diff
export * from './memberEntity';
export * from './memberErrors';
+ export * from './repositoryEntity';

```

Now that we have our model define, we can begin createing the needed calls.

### ./src/api/member/index.ts
```diff

-import { MemberEntity } from '../../model';
+import { MemberEntity, RepositoryEntity } from '../../model';
import { members } from './mockData';

const baseURL = 'https://api.github.com/orgs/lemoncode';
const userURL = 'https://api.github.com/user';
+const repoURL = 'https://api.github.com/orgs/lemoncode/repos';
let mockMembers = members;

...

+const mapToRepositories = (githubRepositories: any[]): RepositoryEntity[] => {
+  return githubRepositories.map(mapToRepository);
+};

+const mapToRepository = (githubRepository: any):RepositoryEntity => {
+  return{
+    id: githubRepository.id,
+    name: githubRepository.name,
+    description: githubRepository.description
+  }
+}

...

+const fetchRepositoriesAsync = (): Promise<RepositoryEntity[]> => {
+  const repositoryURL = `${repoURL}`;

+  return fetch (repositoryURL)
+    .then((response) => (response.json()))
+    .then(mapToRepositories);
+}

export const memberAPI = {
  fetchMembers,
  fetchMembersAsync,
  saveMember,
  fetchMemberById,
  fetchMemberByIdAsync,
+ fetchRepositoriesAsync,
};


```
Now we need to create new folder _./src/components/repos_ and also another folder to hold the actions to this component _./src/components/repos/actions_

On _./src/components/repos_ we will create a repoHeader and a repoRow just like we did for the _members_ component.
### ./src/components/repos/repoHeader.tsx

```tsx
import * as React from 'react';

export const RepoHeader: React.StatelessComponent<{}> = () => {
    return (
        <tr>
            <th>id</th>
            <th>Name</th>
            <th>Description</th>
        </tr>
    );
};

```

### ./src/components/repos/repoHeader.tsx

```tsx
import * as React from 'react';
import { RepositoryEntity } from '../../model';


interface Props {
    repo: RepositoryEntity;
}

export const RepoRow: React.StatelessComponent<Props> = ({ repo }) => {
    return (
        <tr>
            <td>
                <span>{repo.id}</span>
            </td>
            <td>
                <span>{repo.name}</span>
            </td>
            <td>
                <span>{repo.description}</span>
            </td>
        </tr>
    );
};

```

We also need to update our constant file with a new action type.
### ./src/common/constants/actionTypes.ts

```diff
export const actionTypes = {
  FETCH_MEMBERS_COMPLETED: 'FETCH_MEMBERS_COMPLETED',
  FETCH_MEMBER_BY_ID_COMPLETED: 'FETCH_MEMBER_BY_ID_COMPLETED',
  UPDATE_MEMBER_FIELD: 'UPDATE_MEMBER_FIELD',
  SAVE_MEMBER: 'SAVE_MEMBER', 
+ FETCH_REPOSITORIES_COMPLETED:'FETCH_REPOSITORIES_COMPLETED',
};

```
Now we can proceed to create our new repositories reducer.
### ./src/reducers/repositories.ts

```ts
import {actionTypes} from '../common/constants/actionTypes';
import {RepositoryEntity} from '../model/repositoryEntity';

export const repositoriesReducer = (state: RepositoryEntity[] = [], action) => {
    switch (action.type) {
        case actionTypes.FETCH_REPOSITORIES_COMPLETED:
            return handleFetchRepositoriesCompleted(state, action.payload);
    }

    return state;
};

const handleFetchRepositoriesCompleted = (state: RepositoryEntity[], payload: RepositoryEntity[]) => {
    return payload;
};
```
Because we want to show our new component into the members page, we will have to reference the needed components inside the members site. 
To help us look more undestandable we'll use a barrel.
### ./src/components/members/actions/index.ts
```ts
export * from './fetchMembers';
export * from '../../repos/actions/fetchRepositories';
```
Now we move the wanted data with redux.
### ./src/components/members/pageContainer.tsx

```diff
import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers';
-import { fetchMembersAction} from './actions/fetchMembers.ts';
+import { fetchMembersAction, fetchRepositoriesAction } from './actions';
import { MembersPage } from './page';

const mapStateToProps = (state: State) => ({
  members: state.members,
+ repos: state.repositories,
});

const mapDispatchToProps = (dispatch) => ({
  fetchMembers: () => dispatch(fetchMembersAction()),
+ fetchRepos: () =>dispatch(fetchRepositoriesAction()),
});

export const MembersPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MembersPage);

```
### ./src/components/members/page.tsx
```diff
import * as React from 'react';
import { Link } from 'react-router-dom';
-import { MemberEntity } from '../../model';
+import { MemberEntity, RepositoryEntity } from '../../model';
import { MemberHeader } from './memberHeader';
import { MemberRow } from './memberRow';

+import {RepoHeader} from '../repos/repoHeader';
+import {RepoRow} from '../repos/repoRow';

interface Props {
  members: MemberEntity[];
+  repos: RepositoryEntity[];
  fetchMembers(): void;
+  fetchRepos(): void;
}

export class MembersPage extends React.Component<Props,{}> {
  constructor(props) {
    super(props);
    this.state = { 
      members: [], 
+      repos:[] 
    };
  }
  public componentDidMount() {
    this.props.fetchMembers();
+    this.props.fetchRepos();
  }

  public render() {
    return (
      <div className="row">
+        <div className="col-5">
+         <div className="row">
          <h2> Members Page</h2>
          <Link to="/member">New Member</Link>
+          </div>
          <table className="table" id="members_table">
            <thead>
              <MemberHeader />
            </thead>
            <tbody>
              {
                this.props.members.map((member) =>
                  <MemberRow
                    key={member.id}
                    member={member}
                  />
                )
              }
            </tbody>
          </table>
+        </div>

+      <div className="col-5">
+        <h2> Repo Page</h2>
+          <table className="table" id="repos_table">
+          <thead>
+            <RepoHeader />
+          </thead>
+          <tbody>
+            {
+              this.props.repos.map((repo) =>
+                <RepoRow
+                  key={repo.id}
+                  repo={repo}
+                />
+              )
+            }
+          </tbody>
+        </table>
+      </div>
    </div>
    );
  }
};

```


- Execute the example:

Finally, lets give it a try:

 ```bash
 $ npm start
 ```

# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us. 
