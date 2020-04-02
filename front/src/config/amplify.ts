import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_sj1lrpMkn",
    userPoolWebClientId: "72scs224ie4gabmn38denrelri",
    mandatorySignIn: true,
    authenticationFlowType: "USER_SRP_AUTH"
  },
  API: {
    endpoints: [
      {
        name: "dev",
        endpoint: "https://d8s9u2l490.execute-api.us-east-1.amazonaws.com/dev",
        region: "us-east-1"
      }
    ]
  }
});
