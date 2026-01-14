import { Suspense } from "react";
import VerificationClient from "./VerificationClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6">Carregando...</div>}>
            <VerificationClient />
        </Suspense>
    );
}
