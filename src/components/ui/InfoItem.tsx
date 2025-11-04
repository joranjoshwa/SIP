type Props = {
    label: string;
    value: string;
}

export const InfoItem = ({ label, value }: Props) => {
    return (
        <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white">{value}</p>
        </div>
    );
}