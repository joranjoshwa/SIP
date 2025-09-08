type Props = {
    label: string;
    value: string;
}

export const InfoItem = ({ label, value }: Props) => {
    return (
        <div className="mt-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-base font-semibold text-gray-800">{value}</p>
        </div>
    );
}