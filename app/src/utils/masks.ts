export const formatCPF = (value: string) => {
    let v = value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
};

export const formatPhone = (value: string) => {
    let v = value.replace(/\D/g, ""); 

    v = v.replace(/^(\d{2})(\d)/, "($1) $2");

    v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");

    return v;
};