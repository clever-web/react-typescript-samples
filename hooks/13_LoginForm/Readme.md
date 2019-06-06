# 13 Login Form

In this sample we are going to implement a basic login page, that will redirect the user to another page whenever the login has completed successfully.

We will attempt to create a realistic layout, in order to keep simplicity we will break it into subcomponents and perform some refactor in order to make the solution more maintainable.

We will take a starting point the sample 12 ReactRouter:

## Steps

- Copy the content from _12 ReactRouter_ and execute `npm install`.

```bash
npm install
```

- Let's rename _pageA.tsx_ to _loginPage.tsx_.

- Let's update as well the name of the component.

_./src/pages/loginPage.tsx_

```diff
import * as React from "react";
import { Link } from "react-router-dom";

- export const PageA = () => (
+ export const LoginPage = () => (
    <div>
-     <h2>Hello from page A</h2>
+     <h2> Hello from login Page</h2>
      <br />
      <Link to="/pageB">Navigate to Page B</Link>
    </div>
  );
```

- Let's update _app.tsx_ (routes, names and add a redirect from root to login page).

_./src/app.tsx_

```diff
import * as React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
- import { PageA } from "./pages/pageA";
+ import { LoginPage } from "./pages/loginPage";
import { PageB } from "./pages/pageB";

export const App = () => {

  return (
    <>
      <HashRouter>
        <Switch>
-         <Route exact={true} path="/" component={PageA} />
+         <Route exact={true} path="/" component={LoginPage} />
          <Route path="/pageB" component={PageB} />
        </Switch>
      </HashRouter>
    </>
  );
};
```

- Let's update as well the navigation from _pageB_ to _loginPage_.

_./src/pages/b/pageB.tsx_

```diff
import * as React from "react"
import { Link } from 'react-router-dom';

export const PageB = () => {
  return (
    <div>
      <h2>Hello from page B</h2>
      <br />
-      <Link to="/">Navigate to Page A</Link>
+      <Link to="/">Navigate to Login</Link>
    </div>
  )
}
```

- Let's make a quick test and check that everything is still working fine.

```
npm start
```

- Time to remove 'Sample app' text from the main _html_.

_./src/index.html_

```diff
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div class="well">
-      <h1>Sample app</h1>
      <div id="root"></div>
    </div>
  </body>
</html>
```

- Let's build a proper _login_ layout, _loginPage.tsx_. To build a nice layout, we will install _@material-ui/core_ and _@material-ui/icons_

```bash
npm install @material-ui/core @material-ui/icons --save
```

- However, we must be careful with the compatibility of certain versions of _typescript_ with the new _hooks_ of _material-ui_. For this example, we can install _typescript@3.3.3_ version. You can get more information about this issue in the following link https://github.com/mui-org/material-ui/issues/14018

- Now we could create a login form it could look something like:

_./src/pages/loginPage.tsx_

```javascript
import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import makeStyles from "@material-ui/styles/makeStyles";
import createStyles from "@material-ui/styles/createStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// https://material-ui.com/styles/api/#makestyles-styles-options-hook
const useStyles = makeStyles(theme =>
  createStyles({
    card: {
      maxWidth: 400,
      margin: "0 auto"
    }
  })
);

interface Props extends RouteComponentProps {}

const LoginPageInner = (props: Props) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title="Login" />
      <CardContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <TextField label="Name" margin="normal" />
          <TextField label="Password" type="password" margin="normal" />
          <Button variant="contained" color="primary">
            Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const LoginPage = withRouter < Props > LoginPageInner;
```

- This can be ok, but if we take a deeper look to this component, we could break down into two, one is the card itself the other the form dialog, so it should finally look like:

** Proposal **

```javascript
<Card className={classes.card}>
  <CardHeader title="Login" />
  <CardContent>
    <LoginForm />
  </CardContent>
</Card>
```

- Let's create the LoginForm component (append it to the loginPage file):

_./src/pages/loginPage.tsx_

```javascript
const LoginForm = props => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <TextField label="Name" margin="normal" />
      <TextField label="Password" type="password" margin="normal" />
      <Button variant="contained" color="primary">
        Login
      </Button>
    </div>
  );
};
```

- And let's update the _loginPage.tsx_

_./src/pages/loginPage.tsx_

```diff
  return (
    <Card className={classes.card}>
      <CardHeader title="Login" />
      <CardContent>
+        <LoginForm/>
-        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
-          <TextField
-            label="Name"
-            margin="normal"
-          />
-          <TextField
-            label="Password"
-            type="password"
-            margin="normal"
-          />
-          <Button variant="contained" color="primary">
-            Login
-          </Button>
-        </div>
      </CardContent>
    </Card>
  )
```

- Let's give a try and check how is it looking.

```bash
npm start
```

- Let's add the navigation on button clicked, we will do it in two steps.

- First we will expose a method to do that in the loginPage.

_./src/pages/login/loginPage.tsx_

```diff
// ...

// https://material-ui.com/styles/api/#makestyles-styles-options-hook
const useStyles = makeStyles(theme =>
  createStyles({
    card: {
      maxWidth: 400,
      margin: "0 auto"
    }
  })
);

interface Props extends RouteComponentProps {}

const LoginPageInner = (props) => {
  const { classes } = props;

+   const onLogin = () => {
+      props.history.push('/pageB');
+   }

  return (
    <Card className={classes.card}>
      <CardHeader title="Login" />
      <CardContent>
-        <LoginForm/>
+        <LoginForm onLogin={onLogin}/>
      </CardContent>
    </Card>
  )
}

export const LoginPage = withRouter<Props>(LoginPageInner);
```

- Let's add the navigation on button clicked (later on we will check for user and pwd) _form.tsx_.
  In order to do this we have used react-router 4 "withRouter" HoC (High order component), and pass it
  down to the LoginForm component.

_./src/pages/loginPage.tsx_

```diff
+interface PropsForm {
+  onLogin : () => void;
+}
-const LoginForm = props => {
+const LoginForm = (props : PropsForm) => {
+   const { onLogin } = props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <TextField label="Name" margin="normal" />
        <TextField label="Password" type="password" margin="normal" />
-       <Button variant="contained" color="primary">
+       <Button variant="contained" color="primary" onClick={onLogin}>
          Login
        </Button>
      </div>
    );
  };
```

- Let's give a quick try.

```bash
npm start
```

Ok, we can navigate whenever we click on the login page.

- Let's keep on progressing, now it is time to collect the username and password info, and check if password is valid or not.

- Let's define an entity for the loginInfo. Let's create the following path and file

_src/model/login.ts_

```javascript
export interface LoginEntity {
  login: string;
  password: string;
}

export const createEmptyLogin = (): LoginEntity => ({
  login: "",
  password: ""
});
```

- Let's add login validation fake restApi: create a folder _src/api_ and a file called _login.ts_

_./src/api/login.ts_

```javascript
import { LoginEntity } from "../model/login";

// Just a fake loginAPI
export const isValidLogin = (loginInfo: LoginEntity): boolean =>
  loginInfo.login === "admin" && loginInfo.password === "test";
```

- Let's add the _api_ integration, plus navigation on login succeeded:

- First let's create a login state and add the api integration.

_./src/pages/loginPage.tsx_

```diff
+ import { LoginEntity, createEmptyLogin } from '../model/login';
+ import { isValidLogin } from '../api/login';
```

_./src/pages/loginPage.tsx_

```diff
const LoginPageInner = (props: Props) => {
+  const [loginInfo, setLoginInfo] = React.useState<LoginEntity>(createEmptyLogin());
  const { classes } = props;

  const onLogin = () => {
+    if(isValidLogin(loginInfo)) {
       props.history.push("/pageB");
+    }
  };

```

- Now let's read the data from the textfields components (user and password).

_./src/pages/loginPage.tsx_

```diff
  const onLogin = () => {
    if (isValidLogin(loginInfo)) {
      props.history.push("/pageB");
    }
  };

+  const onUpdateLoginField = (name, value) => {
+    setLoginInfo({
+      ...loginInfo,
+      [name]: value,
+    })
+  }

  return (
    <Card className={classes.card}>
      <CardHeader title="Login" />
      <CardContent>
        <LoginForm onLogin={onLogin}
+            onUpdateField={onUpdateLoginField}
+            loginInfo={loginInfo}
        />
      </CardContent>
    </Card>
  );
```

- And update _LoginForm_ props and textField onChange.

_./src/pages/loginPage.tsx_

```diff
interface PropsForm {
  onLogin: () => void;
+  onUpdateField: (name: string, value: any) => void;
+  loginInfo : LoginEntity;
}

const LoginForm = (props: PropsForm) => {
-  const { onLogin } = props;
+  const { onLogin, onUpdateField, loginInfo } = props;

+  // TODO: Enhacement move this outside the stateless component discuss why is a good idea
+  const onTexFieldChange = (fieldId) => (e) => {
+    onUpdateField(fieldId, e.target.value);
+  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <TextField label="Name" margin="normal"
+        value={loginInfo.login}
+        onChange={onTexFieldChange('login')}
      />
      <TextField label="Password" type="password" margin="normal"
+        value={loginInfo.password}
+        onChange={onTexFieldChange('password')}
      />
      <Button variant="contained" color="primary" onClick={onLogin}>
        Login
      </Button>
    </div>
  );
};
```

- We will add material-ui classes to LoginForm component.

_./src/pages/loginPage.tsx_

```diff
interface PropsForm {
  onLogin: () => void;
  onUpdateField: (name: string, value: any) => void;
  loginInfo : LoginEntity;
}

+ // https://material-ui.com/styles/api/#makestyles-styles-options-hook
+ const useFormStyles = makeStyles(theme =>
+   createStyles({
+     formContainer: {
+       display: "flex",
+       flexDirection: "column",
+       justifyContent: "center"
+     }
+   })
+ );

const LoginForm = (props: PropsForm) => {
+ const classes = useFormStyles();
  const { onLogin, onUpdateField, loginInfo } = props;

  // TODO: Enhacement move this outside the stateless component discuss why is a good idea
  const onTexFieldChange = (fieldId) => (e) => {
    onUpdateField(fieldId, e.target.value);
  }

  return (
-   <div
-     style={{
-       display: "flex",
-       flexDirection: "column",
-       justifyContent: "center"
-     }}
-   >
+   <div className={classes.formContainer}>
      <TextField label="Name" margin="normal"
        value={loginInfo.login}
        onChange={onTexFieldChange('login')}
      />
      <TextField label="Password" type="password" margin="normal"
        value={loginInfo.password}
        onChange={onTexFieldChange('password')}
      />
      <Button variant="contained" color="primary" onClick={onLogin}>
        Login
      </Button>
    </div>
  );
};
```

- Let's display a notification when the login validation fails.

- First we will create a simple notification component, base on _react material ui_ _snackbar_

_./src/common/notification.tsx_

```javascript
import * as React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface Props {
  message: string;
  show: boolean;
  onClose: () => void;
}

const useStyles = makeStyles(theme =>
  createStyles({
    close: {
      padding: theme.spacing(0.5)
    }
  })
);

export const NotificationComponent = (props: Props) => {
  const { message, show, onClose } = props;
  const classes = useStyles();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={show}
      autoHideDuration={3000}
      onClose={onClose}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
};
```

- Let's expose this common component via an _index_ file.

_./src/common/index.ts_

```javascript
export * from "./notification";
```

- Now let's instantiate this in our _loginPage_

_./src/pages/loginPage.tsx_

```diff
+ import { NotificationComponent } from "../common";

// (...)

const LoginPageInner = (props: Props) => {
  const [loginInfo, setLoginInfo] = React.useState<LoginEntity>(
    createEmptyLogin()
  );
+ const [showLoginFailedMsg, setShowLoginFailedMsg] = React.useState(false);
  const classes = useStyles();

  const onLogin = () => {
    if (isValidLogin(loginInfo)) {
      props.history.push("/pageB");
-    }
+    } else {
+      setShowLoginFailedMsg(true);
+    }
  }

  const onUpdateLoginField = (name, value) => {
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });
  };

  return (
+   <>
    <Card className={classes.card}>
      <CardHeader title="Login" />
      <CardContent>
        <LoginForm
          onLogin={onLogin}
          onUpdateField={onUpdateLoginField}
          loginInfo={loginInfo}
        />
      </CardContent>
    </Card>
+        <NotificationComponent
+          message="Invalid login or password, please type again"
+          show={showLoginFailedMsg}
+          onClose={() => setShowLoginFailedMsg(false)}
+        />
+   </>
  );
};
```

- Now we can give a try, enter a wrong combination of user and password, check that the snack is shown, then
  enter the right combination (admin / test) and check that the application navigates to PageB.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
