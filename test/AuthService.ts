import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Amplify } from "aws-amplify";
import {
  SignInOutput,
  fetchAuthSession,
  getCurrentUser,
  signIn,
} from "aws-amplify/auth";

const awsRegion = process.env.AWS_REGION;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.userPoolId,
      userPoolClientId: process.env.userPoolClientId,
      identityPoolId: process.env.identityPoolId,
    },
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const signInOutput: SignInOutput = await signIn({
      username,
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    });
    const a = await getCurrentUser();
    return signInOutput;
  }

  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString();
  }

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${process.env.userPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: process.env.identityPoolId,
        logins: {
          [cognitoIdentityPool]: idToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
