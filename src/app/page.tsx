"use client"

import { ForgotPassword } from "../pages/ForgotPassword/ForgotPassword";
import { Login } from "../pages/Login/Login";
import { Profile } from "../pages/Profile/Profile";
import { ResetPassword } from "../pages/ResetPassword/ResetPassword";
import { SignUp } from "../pages/SignUp/SignUp";
import { VerifyEmail } from "../pages/VerifyEmail/VerifyEmail";
import { redirect } from "next/navigation";

const Page = () => {
    return (
        <div>
            <Login />
        </div>
    );
}

export default Page;
