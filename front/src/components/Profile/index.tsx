import React, { useEffect } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Header from "@components/Layout/header";
import Paper from "@material-ui/core/Paper";
import PhoneInput, {
  isValidPhoneNumber,
  formatPhoneNumberIntl,
  parsePhoneNumber
} from "react-phone-number-input";
import { PhoneNumberInput } from "./phone-number-input";
import { CountrySelect } from "./country-select";
import { Typography, Button } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { connect, useSelector } from "react-redux";
import { processes } from "@redux/actions";
import { ReduxState, ProcessStatus } from "@models/redux";
import * as actions from "@redux/actions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      "& > *": {
        padding: 30,
        minWidth: 400,
        minHeight: 300
      }
    }
  })
);

const ProfileComponent = (props: any) => {
  const { dispatch } = props;
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = React.useState("");
  const [primaryPhoneNumber, setPrimaryPhoneNumber] = React.useState("");
  const updatingSecondaryNumberProcess = useSelector((state: ReduxState) =>
    state.processes.find(
      proc => proc.name === processes.SECONDARY_NUMBER_UPDATING
    )
  );
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => Auth.userAttributes(user))
      .then(attributes => {
        const primaryAttr = attributes.find(
          att => att.getName() === "phone_number"
        );
        const secondaryAttr = attributes.find(
          att => att.getName() === "custom:sec_phone_number"
        );
        setLoading(false);
        setPrimaryPhoneNumber(!!primaryAttr ? primaryAttr.getValue() : "");
        setSecondaryPhoneNumber(
          !!secondaryAttr ? secondaryAttr.getValue() : ""
        );
      });
  }, []);
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh"
      }}
    >
      <Header />
      <div className={classes.root}>
        <Paper
          style={{
            position: "relative"
          }}
        >
          {!!loading ||
          (!!updatingSecondaryNumberProcess &&
            updatingSecondaryNumberProcess.status === ProcessStatus.RUNNING) ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <CircularProgress size={80} />
            </div>
          ) : (
            <>
              <Typography style={{ marginBottom: 20 }} variant="h4">
                Profile
              </Typography>
              <PhoneInput
                style={{ marginTop: 50 }}
                placeholder="Primary number"
                label="Primary number"
                defaultCountry={"US"}
                inputComponent={PhoneNumberInput}
                countrySelectComponent={CountrySelect}
                name="primaryPhoneNumber"
                data-cy="primary-phone"
                displayInitialValueAsLocalNumber={true}
                disabled={true}
                value={primaryPhoneNumber}
              />
              <PhoneInput
                style={{ marginTop: 50 }}
                placeholder="Secondary number"
                label="Secondary number"
                defaultCountry={"US"}
                inputComponent={PhoneNumberInput}
                countrySelectComponent={CountrySelect}
                name="secondaryPhoneNumber"
                data-cy="secondary-phone"
                international={true}
                onChange={(number: string) => {
                  setSecondaryPhoneNumber(number);
                }}
                value={secondaryPhoneNumber}
                displayInitialValueAsLocalNumber={true}
              />
              <div style={{ textAlign: "center" }}>
                <Button
                  onClick={() => {
                    dispatch(
                      actions.updateSecondaryNumber(
                        !!secondaryPhoneNumber &&
                          secondaryPhoneNumber !== "undefined"
                          ? secondaryPhoneNumber
                          : ""
                      )
                    );
                  }}
                  style={{ position: "absolute", bottom: 15 }}
                  color="primary"
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default connect()(ProfileComponent as any);
