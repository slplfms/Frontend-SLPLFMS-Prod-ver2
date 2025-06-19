import * as React from "react";
import type { User } from "../types/user";
import { authClient } from "../lib/auth/client";
import { logger } from "../lib/default-logger";

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;

  setState: React.Dispatch<
    React.SetStateAction<{
      user: User | null;
      error: string | null;
      isLoading: boolean;
    }>
  >;
}

export const UserContext = React.createContext<UserContextValue | undefined>(
  undefined
);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({
  children,
}: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{
    user: User | null;
    error: string | null;
    isLoading: boolean;
  }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const { data } = await authClient.getSession();
      setState((prev) => ({
        ...prev,
        user: data ?? null,
        error: null,
        isLoading: false,
      }));
    } catch (error) {
      logger.error(error);
      setState((prev) => ({
        ...prev,
        user: null,
        error: "Something went wrong",
        isLoading: false,
      }));
    }
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      return setState((prev) => ({ ...prev, isLoading: false }));
    }

    checkSession().catch((err) => {
      // TODO handle unauthorize error
      logger.error(err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  return (
    <UserContext.Provider value={{ ...state, setState }}>
      {children}
    </UserContext.Provider>
  );
}

export const UserConsumer = UserContext.Consumer;
