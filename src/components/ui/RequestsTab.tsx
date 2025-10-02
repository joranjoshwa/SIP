import { RequestItem } from "./RequestItem";

type Props = {
    requestsItemArr: ItemRequest[];
    itemStatus: string;
};

export function RequestsTab({ requestsItemArr, itemStatus }: Props) {
    return (
        <div className="w-full md:w-[90%] rounded-lg pt-3 md:pt-0">
            <hr className="border-t border-gray-300 dark:border-gray-700" />

            <h2 className="hidden md:block text-lg font-semibold mb-4">Solicitações</h2>

            <div className="space-y-2 mt-4">
                {requestsItemArr.map((req) => (
                    <RequestItem
                        key={req.id}
                        requestItem={req}
                        itemStatus={itemStatus}
                        onApprove={(id) => console.log("approve", id)}
                        onReject={(id) => console.log("reject", id)}
                    />
                ))}
            </div>
        </div>
    );
}
