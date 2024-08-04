import { useEffect, useState } from "react";
import { getUser, signin, signout, signup } from "../services/AuthService";
import { confirmSignUp } from "aws-amplify/auth";

export default function Auth() {
  const [user, setUser] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const [email, setEmail] = useState("");

  async function fetchUser() {
    try {
      const user = await getUser();
      setUser(user);
    } catch {
      setUser(null);
    }
  }

  const handleSignUp = async () => {
    try {
      await signup({ username, password, email });
    } catch (err) {
      console.log("error sign up", err);
    }
  };
  const handleConfirm = async () =>
    await confirmSignUp({ username, confirmationCode });

  const handleSignIn = async () => {
    try {
      await signin({ username, password });
      fetchUser();
    } catch (err) {
      console.log("error sign in", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signout();
    } finally {
      setUser(null);
    }
  };

  useEffect(function () {
    fetchUser();
  }, []);

  return user ? (
    <div>
      <p>Hi, {user}</p> <button onClick={handleSignOut}>sign out</button>
    </div>
  ) : (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Confirm code"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
}
