import { SearchCategorySelect } from "@/src/components/ui/SearchCategorySelect";
import { DateRangeSelector } from "@/src/components/ui/DateRangeSelector";
import { Dropdown } from "@/src/components/ui/Dropdown";
import { Button } from "@/src/components/ui/Button";

type Props = {
    handleCategorySelection: (categories: string[]) => void;
};

export const SearchFilter = ({ handleCategorySelection }: Props) => {
    const cleanFilters = () => {
        console.log("clean filters");
    }
    const options = [
        { value: "opcao1", label: "pedro" },
        { value: "opcao2", label: "Opção 2" },
        { value: "opcao3", label: "Opção 3" }
    ];

    return (
        <div className="md:border md:border-gray-300 md:dark:border-gray-600 md:rounded-lg md:p-4 md:mt-4">
            <h2 className="text-md mt-4">Filtros</h2>
            <div className="mt-7">
                <span className="text-sm">Categoria</span>
                <SearchCategorySelect setCategory={handleCategorySelection} />
            </div>
            <div className="mt-5">
                <span className="text-sm">Data</span>
                <DateRangeSelector />
            </div>

            <div className="mt-5">
                <span className="text-sm">Local</span>
                <Dropdown options={options} />
            </div>

            <div className="mt-20">
                <Button
                    variant="secondary"
                    onClick={cleanFilters}
                >{"Limpar Filtros"}</Button>
            </div>
            <div className="mt-2">
                <Button
                    variant="primary"
                    onClick={cleanFilters}
                >{"Salvar Filtros"}</Button>
            </div>
        </div>
    );
}
