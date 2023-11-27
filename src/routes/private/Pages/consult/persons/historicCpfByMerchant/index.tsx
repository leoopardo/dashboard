/* eslint-disable react-hooks/exhaustive-deps */
import {
    EyeFilled,
  FileAddOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { ColumnInterface, CustomTable } from "@components/CustomTable";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { Toast } from "@src/components/Toast";
import { useCreatePersonBlacklistReason } from "@src/services/register/persons/blacklist/createReason";
import { useDeletePersonReason } from "@src/services/register/persons/blacklist/deleteReason";
import {
  PersonBlacklistReasonsItem,
} from "@src/services/types/register/persons/blacklist/reasons.interface";
import { Button, Tooltip } from "antd";
import { useGetHistoricCpfByMerchant } from "@src/services/consult/persons/historicCpfByMerchant";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HistoricCpfByMerchantQuery } from "@src/services/types/consult/persons/hsitoricCpfByMerchant";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { FiltersModal } from "@src/components/FiltersModal";

const INITIAL_QUERY: HistoricCpfByMerchantQuery = {
  limit: 25,
  page: 1,
  start_date: "2023-11-02T03:00:00.000",
  end_date: "2023-11-27T03:00:00.000",
};

export const HistoricCpfByMerchant = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<HistoricCpfByMerchantQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const {
    HistoricCpfByMerchantData,
    HistoricCpfByMerchantDataError,
    isHistoricCpfByMerchantDataFetching,
    refetchHistoricCpfByMerchantData,
  } = useGetHistoricCpfByMerchant(query);

  console.log({ HistoricCpfByMerchantData });
  const [isCreateReasonOpen, setIsCreateReasonOpen] = useState(false);
  const [body, setBody] = useState<{ reason: string }>({
    reason: "",
  });
  const [currentItem, setCurrentItem] =
    useState<PersonBlacklistReasonsItem | null>(null);
  const { error, isLoading, isSuccess, mutate } =
    useCreatePersonBlacklistReason(body);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const {
    deletePersonReasonError,
    deletePersonReasonIsSuccess,
    deletePersonReasonMutate,
  } = useDeletePersonReason(currentItem?.id);

  const columns: ColumnInterface[] = [
    { name: "merchant_id", type: "text", head: "id"  },
    { name: "merchant_name", type: "text" },
    { name: "totalCpfChecks", type: "text" },
  ];

  useEffect(() => {
    refetchHistoricCpfByMerchantData();
  }, [query]);

  /*   useEffect(() => {
    if (!debounceSearch) {
      const q = { ...query };
      delete q.reason;
      return setQuery(q);
    }
    setQuery((state) => ({ ...state, reason: debounceSearch }));
  }, [debounceSearch]); */

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid
        container
        style={{ display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={isHistoricCpfByMerchantDataFetching}
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={7} lg={6}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>

        <Grid item xs={12} md={3} lg={2}>
          <Button
            size="large"
            type="dashed"
            // loading={isUsersDataFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
            }}
            icon={<FilterAltOffOutlinedIcon />}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t("table.clear_filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md="auto">
          <Tooltip placement="topRight" title={t("messages.export_csv")} arrow>
            <Button
              //onClick={() => setIsExportReportsOpen(true)}
              style={{ width: "100%" }}
              shape="round"
              type="dashed"
              size="large"
              // loading={isUsersDataFetching}
              icon={<FileAddOutlined style={{ fontSize: 22 }} />}
            >
              CSV
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={HistoricCpfByMerchantData}
            items={HistoricCpfByMerchantData}
            error={HistoricCpfByMerchantDataError}
            columns={columns}
            loading={isHistoricCpfByMerchantDataFetching}
            label={["cpf", "merchant_name"]}
            actions={[
                {
                    label: "details",
                    icon: <EyeFilled style={{ fontSize: "18px" }} />,
                    onClick: () =>
                    setIsViewDetailsOpen(true)
                  },
            ]}
            isConfirmOpen={isDeleteOpen}
            setIsConfirmOpen={setIsDeleteOpen}
            itemToAction={currentItem?.reason}
            onConfirmAction={() => deletePersonReasonMutate()}
          />
        </Grid>
      </Grid>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={[
            "start_date",
            "end_date",
            "merchant_id"
          ]}
          refetch={refetchHistoricCpfByMerchantData}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}

      <Toast
        actionError={t("messages.create")}
        actionSuccess={t("messages.created")}
        error={error}
        success={isSuccess}
      />
      <Toast
        actionError={t("messages.delete").toLowerCase()}
        actionSuccess={t("messages.deleted")}
        error={deletePersonReasonError}
        success={deletePersonReasonIsSuccess}
      />
    </Grid>
  );
};
