import { Suspense } from "react";
import RecoverPasswordClient from "./RecoverPasswordClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6">Carregando...</div>}>
            <RecoverPasswordClient />
        </Suspense>
    );
}
