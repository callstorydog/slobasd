import * as React from "react";
import { I18n, JS, ConsoleLogger as Logger } from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";

import {
  IAuthPieceProps,
  IAuthPieceState
} from "aws-amplify-react/lib-esm/Auth/AuthPiece";
import AuthPiece from "./AuthPiece";
import { FederatedButtons } from "aws-amplify-react/lib-esm/Auth/FederatedSignIn";
import SignUp from "aws-amplify-react/lib-esm/Auth/SignUp";
import ForgotPassword from "aws-amplify-react/lib-esm/Auth/ForgotPassword";

import {
  FormSection,
  FormField,
  SectionHeader,
  SectionBody,
  SectionFooter,
  Button,
  Link,
  Hint,
  Input,
  InputLabel,
  SectionFooterPrimaryContent,
  SectionFooterSecondaryContent
} from "aws-amplify-react/lib-esm/Amplify-UI/Amplify-UI-Components-React";

import { auth } from "aws-amplify-react/lib-esm/Amplify-UI/data-test-attributes";

const logger = new Logger("SignIn");

export interface ISignInProps extends IAuthPieceProps {
  federated?: any;
  override?: any;
}

export interface ISignInState extends IAuthPieceState {
  loading?: boolean;
}

export default class SignIn extends AuthPiece<ISignInProps, ISignInState> {
  constructor(props: ISignInProps) {
    super(props);

    this.checkContact = this.checkContact.bind(this);
    this.signIn = this.signIn.bind(this);

    this._validAuthStates = ["signIn", "signedOut", "signedUp"];
    this.state = {};
  }

  checkContact(user: any) {
    if (!Auth || typeof Auth.verifiedContact !== "function") {
      throw new Error(
        "No Auth module found, please ensure @aws-amplify/auth is imported"
      );
    }
    Auth.verifiedContact(user).then(data => {
      if (!JS.isEmpty(data.verified)) {
        this.changeState("signedIn", user);
      } else {
        user = Object.assign(user, data);
        this.changeState("verifyContact", user);
      }
    });
  }

  async signIn(event: any) {
    // avoid submitting the form
    if (event) {
      event.preventDefault();
    }

    const username = this.getUsernameFromInput() || "";
    const password = this.inputs.password;

    if (!Auth || typeof Auth.signIn !== "function") {
      throw new Error(
        "No Auth module found, please ensure @aws-amplify/auth is imported"
      );
    }
    this.setState({ loading: true });
    try {
      const user = await Auth.signIn(username, password);
      logger.debug(user);
      if (
        user.challengeName === "SMS_MFA" ||
        user.challengeName === "SOFTWARE_TOKEN_MFA"
      ) {
        logger.debug("confirm user with " + user.challengeName);
        this.changeState("confirmSignIn", user);
      } else if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        logger.debug("require new password", user.challengeParam);
        this.changeState("requireNewPassword", user);
      } else if (user.challengeName === "MFA_SETUP") {
        logger.debug("TOTP setup", user.challengeParam);
        this.changeState("TOTPSetup", user);
      } else if (
        user.challengeName === "CUSTOM_CHALLENGE" &&
        user.challengeParam &&
        user.challengeParam.trigger === "true"
      ) {
        logger.debug("custom challenge", user.challengeParam);
        this.changeState("customConfirmSignIn", user);
      } else {
        this.checkContact(user);
      }
    } catch (err) {
      if (err.code === "UserNotConfirmedException") {
        logger.debug("the user is not confirmed");
        this.changeState("confirmSignUp", { username });
      } else if (err.code === "PasswordResetRequiredException") {
        logger.debug("the user requires a new password");
        this.changeState("forgotPassword", { username });
      } else {
        this.error(err);
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  showComponent(theme: any) {
    const {
      authState,
      hide = [],
      federated,
      onStateChange,
      onAuthEvent,
      override = []
    } = this.props;
    if (hide && hide.includes(SignIn)) {
      return null;
    }
    const hideSignUp =
      !override.includes("SignUp") &&
      hide.some((component: any) => component === SignUp);
    const hideForgotPassword =
      !override.includes("ForgotPassword") &&
      hide.some((component: any) => component === ForgotPassword);
    return (
      <FormSection theme={theme} data-test={auth.signIn.section}>
        <h1>StoryDog</h1>
        <SectionHeader theme={theme} data-test={auth.signIn.headerSection}>
          {I18n.get("Sign in to your account")}
        </SectionHeader>
        <FederatedButtons
          federated={federated}
          theme={theme}
          authState={authState}
          onStateChange={onStateChange}
          onAuthEvent={onAuthEvent}
        />
        <form onSubmit={this.signIn}>
          <SectionBody theme={theme}>
            {this.renderUsernameField(theme)}
            <FormField theme={theme}>
              <InputLabel theme={theme}>{I18n.get("Password")} *</InputLabel>
              <Input
                placeholder={I18n.get("Enter your password")}
                theme={theme}
                key="password"
                type="password"
                name="password"
                onChange={this.handleInputChange}
                data-test={auth.signIn.passwordInput}
              />
            </FormField>
          </SectionBody>
          <SectionFooter
            style={{ display: "block" }}
            theme={theme}
            data-test={auth.signIn.footerSection}
          >
            <SectionFooterPrimaryContent
              style={{ display: "block", marginBottom: 30 }}
              theme={theme}
            >
              <Button
                theme={theme}
                type="submit"
                disabled={this.state.loading}
                data-test={auth.signIn.signInButton}
              >
                {I18n.get("Sign In")}
              </Button>
            </SectionFooterPrimaryContent>
            {
              <SectionFooterSecondaryContent theme={theme}>
                {I18n.get("Need help? Call 484-402-4901")}
              </SectionFooterSecondaryContent>
            }
          </SectionFooter>
        </form>
      </FormSection>
    );
  }
}
