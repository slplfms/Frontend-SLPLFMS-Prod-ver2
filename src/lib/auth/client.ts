import type { User } from "../../types/user";
import api from "../../axios/interceptor";
import { paths } from "../../paths";

export interface SignInWithOAuthParams {
  provider: "google" | "discord";
}

export interface SignInWithPasswordParams {
  employeeId: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {

  async signInWithPassword(params: SignInWithPasswordParams) {
    const { employeeId, password } = params;

    const res = await api.post("/auth/login", { employeeId, password });
    localStorage.setItem("auth-token", res.data.tokens.access.token);
    localStorage.setItem("refresh-token", res.data.tokens.refresh.token);
    const user = res.data.user;
    user.permissions = res.data.permissions;
    user.role = res.data.role;
    user.vehicle = res.data.vehicle;
    return user;
  }

  // async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
  //   return { error: "Password reset not implemented" };
  // }

  // async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
  //   return { error: "Update reset not implemented" };
  // }

  async getSession(): Promise<{ data?: User | null; error?: string }> {
    const res = await api.get("/auth/session");

    if (!res) {
      return { data: null };
    }

    const data = res.data.user;
    data.permissions = res.data.permissions;
    data.role = res.data.role;
    data.vehicle = res.data.vehicle
    return { data };
  }

  async signOut(){
    localStorage.removeItem("auth-token");
    localStorage.removeItem("refresh-token");
    window.location.href = paths.auth.signIn;
  }
}

export const authClient = new AuthClient();
