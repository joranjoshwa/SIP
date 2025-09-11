"use client"

import { ForgotPassword } from "./src/pages/ForgotPassword/ForgotPassword";
import { Login } from "./src/pages/Login/Login";
import { ResetPassword } from "./src/pages/ResetPassword/ResetPassword";
import { SignUp } from "./src/pages/SignUp/SignUp";
import { VerifyEmail } from "./src/pages/VerifyEmail/VerifyEmail";
import { Dashboard } from "./src/pages/Dashboard/Dashboard";

const Page = () => {
    return (
        <div>
            <Dashboard />
        </div>
    );
}

export default Page;
