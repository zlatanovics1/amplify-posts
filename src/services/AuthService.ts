import { signIn, signOut, signUp, getCurrentUser } from "aws-amplify/auth";

interface UserCredentials {
  username: string;
  password: string;
  email?: string;
}

// import { Auth } from "aws-amplify";
export const signup = async ({
  email,
  username,
  password,
}: UserCredentials) => {
  await signUp({ username, password, options: { userAttributes: { email } } });
};

export const signin = async ({ username, password }: UserCredentials) => {
  const { isSignedIn } = await signIn({ username, password });
  return isSignedIn;
};

export const signout = async () => await signOut();

export const getUser = async () => {
  const { username } = await getCurrentUser();
  return username;
};
