import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Store } from "pullstate";
import { auth, app } from "../configs/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { useUser } from "../contexts/UserContext";

interface AuthStoreInterface {
  isLoggedin: boolean;
  initialized: boolean;
  userAuthInfo: User | null;
}

export const AuthStore = new Store<AuthStoreInterface>({
  isLoggedin: false,
  initialized: false,
  userAuthInfo: null,
});

const unsub = onAuthStateChanged(auth, (user) => {
  console.log("onAuthStateChanged", user);
  AuthStore.update((store) => {
    (store.initialized = true),
      (store.isLoggedin = user ? true : false),
      (store.userAuthInfo = user);
  });
});

export const appSignIn = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    AuthStore.update((store) => {
      store.userAuthInfo = response?.user;
      store.isLoggedin = response?.user ? true : false;
    });
    return { user: auth.currentUser };
  } catch (e) {
    return { error: e };
  }
};

export const appSignOut = async () => {
  try {
    await signOut(auth);
    AuthStore.update((store) => {
      store.userAuthInfo = null;
      store.isLoggedin = false;
    });
    return { user: null };
  } catch (e) {
    return { error: e };
  }
};

export const appSignUp = async (email: string, password: string) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    AuthStore.update((store) => {
      store.userAuthInfo = response.user;
      store.isLoggedin = response.user ? true : false;
    });
    return { user: auth.currentUser };
  } catch (e) {
    return { error: e };
  }
};
