import {
    SearchCategorySelect,
    SearchCategorySelectRef,
} from "./SearchCategorySelect";
import { useRef, useState } from "react";
import { DateRangeSelector, DateRangeSelectorRef } from "./DateRangeSelector";
import { Button } from "@/src/components/ui/Button";
import { SquareToggle, SquareToggleRef } from "@/src/components/ui/SquareToggle";
import { FilterGroup } from "@/src/types/recovery";
import { FilterType } from "@/src/types/item";
import { PillSelector, PillSelectorRef } from "@/src/components/ui/PillSelector";
import React from "react";

type VisibleFiltersConfig = Record<
    FilterGroup,
    Partial<Record<FilterType, boolean>>
>;

const FILTER_VISIBILITY: VisibleFiltersConfig = {
    search: {
        status: false,
        donation: false
    },

    requestsSelf: {
        donation: false,
        lastDays: false,
    },
};

const isFilterVisible = (group: FilterGroup, filter: FilterType): boolean => {
    return FILTER_VISIBILITY[group]?.[filter] !== false;
};

type Props = {
    filterGroup: FilterGroup;
    handleCategorySelection: (categories: string[]) => void;
    handleDateSelection: (start: Date | null, end: Date | null) => void;
    handleToggleChange?: (enabled: boolean) => void;
    handleStatusChange?: (status: RequestStatus | null) => void;
    handleSubmit: () => void;
    handleCleanFilters: () => void;
};

export const SearchFilter = ({
    filterGroup = "search",
    handleCategorySelection,
    handleDateSelection,
    handleToggleChange,
    handleStatusChange,
    handleSubmit,
    handleCleanFilters,
}: Props) => {
    const categoryRef = useRef<SearchCategorySelectRef>(null);
    const dateRef = useRef<DateRangeSelectorRef>(null);
    const toggleRef = useRef<SquareToggleRef>(null);
    const statusRef = useRef<PillSelectorRef>(null);
    const [status, setStatus] = React.useState<RequestStatus | null>(null);

    const changeStatus = (currentStatus: RequestStatus) => {
        if (!handleStatusChange) return;
        if (currentStatus === status) {
            setStatus(null);
            handleStatusChange(null);
        }
        setStatus(currentStatus);
        handleStatusChange(currentStatus);
    }

    const cleanFilters = () => {
        if (isFilterVisible(filterGroup, "categoria")) categoryRef.current?.reset();
        if (isFilterVisible(filterGroup, "data")) dateRef.current?.reset();
        if (isFilterVisible(filterGroup, "donation")) toggleRef.current?.reset();
        if (isFilterVisible(filterGroup, "status")) statusRef.current?.reset();

        handleCleanFilters();
    };

    return (
        <div className="md:border md:border-gray-300 md:dark:border-gray-600 md:rounded-2xl md:p-6">
            <h2 className="text-lg md:text-md font-bold">Filtros</h2>

            {isFilterVisible(filterGroup, "categoria") && (
                <div className="mt-[1.5rem]">
                    <span className="text-sm">Categoria</span>
                    <SearchCategorySelect
                        setCategory={handleCategorySelection}
                        ref={categoryRef}
                    />
                </div>
            )}

            {isFilterVisible(filterGroup, "data") && (
                <div className="mt-5">
                    <span className="text-sm">Data</span>
                    <DateRangeSelector
                        ref={dateRef}
                        handleDateSelection={handleDateSelection}
                    />
                </div>
            )}

            {isFilterVisible(filterGroup, "donation") && (
                <div className="mt-5">
                    <SquareToggle
                        ref={toggleRef}
                        label="Para ser doado:"
                        onChange={handleToggleChange as ((enabled: boolean) => void)}
                    />
                </div>
            )}

            {isFilterVisible(filterGroup, "status") && (
                <div>
                    <PillSelector<RequestStatus>
                        ref={statusRef}
                        label="Status"
                        className="pt-2"
                        value={status as RequestStatus | null}
                        onChange={changeStatus as ((status: RequestStatus | null) => void)}
                        options={[
                            { value: "APPROVED", label: "Aceito" },
                            { value: "PENDING", label: "Pendente" },
                            { value: "REFUSED", label: "Recusado" },
                        ]}
                    />
                </div>
            )}

            <div className="mt-10">
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
