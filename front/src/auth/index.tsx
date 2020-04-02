import * as React from "react";
import { Component } from "react";
import { Authenticator } from "aws-amplify-react";

import {
  SignUp,
  ConfirmSignIn,
  VerifyContact,
  ForgotPassword,
  RequireNewPassword,
  Loading,
  ConfirmSignUp
} from "aws-amplify-react";

import CustomSignIn from "./SignIn";

export class CustomAuthenticator extends Component<any> {
  state = {
    authState: ""
  };
  render() {
    return (
      <div>
        {this.state.authState === "signedIn" ? (
          !!this.props.children && this.props.children
        ) : (
          <Authenticator
            hideDefault={true}
            onStateChange={authState => {
              console.log("authState", authState);
              this.setState({ authState });
            }}
            signUpConfig={
              {
                hideAllDefaults: true,
                signUpFields: [
                  {
                    label: "Phone Number",
                    key: "phone_number",
                    required: true,
                    displayOrder: 1,
                    type: "string"
                  },
                  {
                    label: "Password",
                    key: "password",
                    required: true,
                    displayOrder: 2,
                    type: "password"
                  },
                  {
                    label: "Name",
                    key: "name",
                    required: false,
                    displayOrder: 3,
                    type: "string"
                  }
                ]
              } as any
            }
            usernameAttributes={"phone_number" as any}
          >
            <CustomSignIn override={"SignIn"} />
            <ConfirmSignIn />
            <VerifyContact />
            <ForgotPassword />
            <ForgotPassword />
            <RequireNewPassword />
            <ConfirmSignUp />
            <Loading />
          </Authenticator>
        )}
      </div>
    );
  }
}
