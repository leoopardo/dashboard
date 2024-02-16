/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Drawer } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import { Dispatch, SetStateAction, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiltersModalFields } from "./filterModalFields";

dayjs.extend(weekday);
dayjs.extend(localeData);

interface FilterModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  query: any;
  setQuery: Dispatch<SetStateAction<any>>;
  refetch?: () => void;
  filters: string[];
  selectOptions: any;
  startDateKeyName: string;
  endDateKeyName: string;
  haveInitialDate?: boolean;
  initialQuery: any;
  maxRange?: boolean;
  disabled?: string[];
  disableMinutes?: boolean;
}

export const FiltersModal = ({
  open,
  setOpen,
  query,
  setQuery,
  filters,
  selectOptions,
  startDateKeyName,
  endDateKeyName,
  haveInitialDate,
  maxRange,
  initialQuery,
  disabled,
  disableMinutes,
}: FilterModalProps) => {
  const { t } = useTranslation();
  const submitRef = useRef<HTMLButtonElement>(null);
  return (
    <Drawer
      data-test-id="filters-modal"
      title={`${t("table.filters")}`}
      placement="right"
      bodyStyle={{ overflowX: "hidden" }}
      onClose={() => setOpen(false)}
      open={open}
      footerStyle={{ padding: 0 }}
      footer={
        <Button
          data-test-id="button-apply-filters"
          type="primary"
          onClick={() => {
            submitRef.current?.click();
          }}
          style={{ width: "100%", height: "50px", borderRadius: 0 }}
        >
          {t("table.apply_filters")}
        </Button>
      }
    >
      {/* Foi criado um componente somente para os campos do modal de filtro
      pois da forma que estava a animação de fechar o modal nao acontecia
      da forma correta pois estava o modal estava sendo exibido 
      de acordo com a variável "open", dessa forma os campos são exibidos
      com o "open" e o modal pode ser fechado normalmente */}

      {open && (
        <FiltersModalFields
          endDateKeyName={endDateKeyName}
          filters={filters}
          initialQuery={initialQuery}
          open={open}
          query={query}
          selectOptions={selectOptions}
          setOpen={setOpen}
          setQuery={setQuery}
          startDateKeyName={startDateKeyName}
          disableMinutes={disableMinutes}
          disabled={disabled}
          haveInitialDate={haveInitialDate}
          maxRange={maxRange}
          submitRef={submitRef}
        />
      )}
    </Drawer>
  );
};
