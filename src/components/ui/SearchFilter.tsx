import {
    SearchCategorySelect,
    SearchCategorySelectRef,
} from "./SearchCategorySelect";
import { useRef, useState } from "react";
import {
    DateRangeSelector,
    DateRangeSelectorRef,
} from "./DateRangeSelector";
import { Button } from "@/src/components/ui/Button";
import { SquareToggle, SquareToggleRef } from "@/src/components/ui/SquareToggle";
import { NumberInputField, NumberInputFieldRef } from "@/src/components/ui/NumberInputField ";

type Props = {
    handleCategorySelection: (categories: string[]) => void;
    handleDateSelection: (start: Date | null, end: Date | null) => void;
    handleToggleChange: (enabled: boolean) => void;
    handleNumberChange: (value: number | null) => void;
    handleSubmit: () => void;
    handleCleanFilters: () => void;
};

export const SearchFilter = ({
    handleCategorySelection,
    handleDateSelection,
    handleToggleChange,
    handleNumberChange,
    handleSubmit,
    handleCleanFilters,
}: Props) => {
    const categoryRef = useRef<SearchCategorySelectRef>(null);
    const dateRef = useRef<DateRangeSelectorRef>(null);
    const toggleRef = useRef<SquareToggleRef>(null);
    const numberRef = useRef<NumberInputFieldRef>(null);

    const cleanFilters = () => {
        categoryRef.current?.reset();
        dateRef.current?.reset();
        toggleRef.current?.reset();
        numberRef.current?.reset();
        handleCleanFilters();
    };

    return (
        <div className="md:border md:border-gray-300 md:dark:border-gray-600 md:rounded-2xl md:p-6">
            <h2 className="text-lg md:text-md font-bold">Filtros</h2>

            {/* Category */}
            <div className="mt-7">
                <span className="text-sm">Categoria</span>
                <SearchCategorySelect
                    setCategory={handleCategorySelection}
                    ref={categoryRef}
                />
            </div>

            {/* Date */}
            <div className="mt-5">
                <span className="text-sm">Data</span>
                <DateRangeSelector
                    ref={dateRef}
                    handleDateSelection={handleDateSelection}
                />
            </div>

            {/* Toggle */}
            <div className="mt-5">
                <SquareToggle
                    ref={toggleRef}
                    label="Para ser doado:"
                    onChange={handleToggleChange} />
            </div>

            <div className="mt-5">
                <NumberInputField
                    ref={numberRef}
                    label="Perdido a quantos dias:"
                    onChange={handleNumberChange} />
            </div>

            {/* Buttons */}
            <div className="mt-20">
                <Button variant="secondary" onClick={cleanFilters}>
                    Limpar Filtros
                </Button>
            </div>
            <div className="mt-2">
                <Button variant="primary" onClick={handleSubmit}>
                    Salvar Filtros
                </Button>
            </div>
        </div>
    );
};
