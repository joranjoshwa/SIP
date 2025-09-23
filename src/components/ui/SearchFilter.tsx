import {
    SearchCategorySelect,
    SearchCategorySelectRef,
} from "./SearchCategorySelect";
import { useRef } from "react";
import {
    DateRangeSelector,
    DateRangeSelectorRef,
} from "./DateRangeSelector";
import { Button } from "@/src/components/ui/Button";

type Props = {
    handleCategorySelection: (categories: string[]) => void;
    handleDateSelection: (start: Date | null, end: Date | null) => void;
    handleSubmit: () => void;
    handleCleanFilters: () => void;
};

export const SearchFilter = ({ handleCategorySelection, handleDateSelection, handleSubmit, handleCleanFilters }: Props) => {
    const categoryRef = useRef<SearchCategorySelectRef>(null);
    const dateRef = useRef<DateRangeSelectorRef>(null);
    const cleanFilters = () => {
        categoryRef.current?.reset();
        dateRef.current?.reset();
        handleCleanFilters();
    }

    return (
        <div className="md:border md:border-gray-300 md:dark:border-gray-600 md:rounded-2xl md:p-6">
            <h2 className="text-md">Filtros</h2>
            <div className="mt-7">
                <span className="text-sm">Categoria</span>
                <SearchCategorySelect
                    setCategory={handleCategorySelection}
                    ref={categoryRef} />
            </div>
            <div className="mt-5">
                <span className="text-sm">Data</span>
                <DateRangeSelector
                    ref={dateRef}
                    handleDateSelection={handleDateSelection} />
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
                    onClick={handleSubmit}
                >{"Salvar Filtros"}</Button>
            </div>
        </div>
    );
}
