/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { Search } from "@src/components/Inputs/search";
import { ExportReportsModal } from "@src/components/Modals/exportReportsModal";
import { MutateModal } from "@src/components/Modals/mutateGenericModal";
import { Toast } from "@src/components/Toast";
import { queryClient } from "@src/services/queryClient";
import { useCreateBankBlacklistReports } from "@src/services/reports/support/blacklist/createBankBlacklistReports";
import { useCreateBankBlacklist } from "@src/services/support/blacklists/bankBlacklist/createBankBlacklist";
import { useDeleteBankBlacklist } from "@src/services/support/blacklists/bankBlacklist/deteteBankBlacklist";
import { useGetBankBlacklist } from "@src/services/support/blacklists/bankBlacklist/getBankBlacklist";
import {
  BankBlacklistItem,
  BankBlacklistQuery,
} from "@src/services/types/support/blacklists/bankBlacklist.interface";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const BankBlacklist = () => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const INITIAL_QUERY: BankBlacklistQuery = {
    limit: 25,
    page: 1,
  };
  const [query, setQuery] = useState<BankBlacklistQuery>(INITIAL_QUERY);
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<string | undefined>(
    undefined
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<BankBlacklistItem | null>(
    null
  );
  const [body, setBody] = useState<{ bank_name: string; ispb: string }>({
    bank_name: "",
    ispb: "",
  });
  const {
    BankBlacklist,
    BankBlacklistError,
    isBankBlacklistFetching,
    refetchBankBlacklist,
  } = useGetBankBlacklist(query);

  const { CreateError, CreateIsLoading, CreateIsSuccess, CreateMutate } =
    useCreateBankBlacklist(body);

  const { DeleteError, DeleteIsSuccess, DeleteMutate } = useDeleteBankBlacklist(
    { ispb: currentItem?.ispb }
  );

  const {
    BankBlacklistReportsError,
    BankBlacklistReportsIsLoading,
    BankBlacklistReportsIsSuccess,
    BankBlacklistReportsMutate,
  } = useCreateBankBlacklistReports(query);

  useEffect(() => {
    refetchBankBlacklist();
  }, [query]);

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
            loading={isBankBlacklistFetching}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips initial_query={INITIAL_QUERY}
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%" }}
            size="large"
            onChange={(value) => {
              setSearchOption(value);
            }}
            value={searchOption}
            placeholder={t("input.options")}
            options={[
              { value: "ispb", label: t("table.ispb") },
              { value: "bank_name", label: t("table.bank_name") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={4}>
          <Search
            query={query}
            setQuery={setQuery}
            searchOption={searchOption}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isBankBlacklistFetching}
            danger
            size="large"
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(undefined);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
        {permissions?.support?.blacklist?.banks?.support_blacklist_bank_create && (
          <Grid item xs={12} md={3} lg={2}>
            <Button
              type="primary"
              size="large"
              loading={isBankBlacklistFetching}
              onClick={() => {
                setIsCreateOpen(true);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("buttons.create_bank_blacklist")}
            </Button>
          </Grid>
        )}

        {permissions?.support?.blacklist?.banks
          ?.support_blacklist_bank_export_csv && (
          <Grid item xs={12} md="auto">
            <ExportReportsModal
              disabled={!BankBlacklist?.total || BankBlacklistError}
              mutateReport={() => BankBlacklistReportsMutate()}
              error={BankBlacklistReportsError}
              success={BankBlacklistReportsIsSuccess}
              loading={BankBlacklistReportsIsLoading}
              reportPath="/support/blacklists/blacklists_reports/bank_institutions_reports"
            />
          </Grid>
        )}
      </Grid>
      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={BankBlacklist}
            items={BankBlacklist?.items}
            error={BankBlacklistError}
            columns={[
              { name: "ispb", type: "id", sort: true },
              { name: "bank_name", type: "bankNameToIcon", head: "bank_icon" },
              { name: "bank_name", type: "text", sort: true },
              { name: "user_id", type: "text" },
              { name: "user_name", type: "text" },
              { name: "createdAt", type: "date", sort: true },
            ]}
            refetch={refetchBankBlacklist}
            loading={isBankBlacklistFetching}
            actions={
              permissions?.support?.blacklist?.banks?.support_blacklist_bank_delete
                ? [
                    {
                      label: "delete",
                      icon: <DeleteOutlined />,
                      onClick() {
                        setIsConfirmOpen(true);
                      },
                    },
                  ]
                : []
            }
            isConfirmOpen={isConfirmOpen}
            setIsConfirmOpen={setIsConfirmOpen}
            label={["bank_name", "ispb","createdAt" ]}
            itemToAction={currentItem?.bank_name}
            onConfirmAction={() => DeleteMutate()}
          />
        </Grid>
      </Grid>

        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["start_date", "end_date"]}
          refetch={refetchBankBlacklist}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />

        <MutateModal
          type="create"
          open={isCreateOpen}
          setOpen={setIsCreateOpen}
          fields={[
            { label: "bank_name", required: true },
            { label: "ispb", required: true },
          ]}
          body={body}
          setBody={setBody}
          modalName={t("modal.new_bank_blacklist")}
          submit={CreateMutate}
          submitLoading={CreateIsLoading}
          error={CreateError}
          success={CreateIsSuccess}
        />
      <Toast
        actionSuccess={t("messages.created")}
        actionError={t("messages.create")}
        errorMessage={
          t(
            `error.${CreateError?.response?.data?.message.split(" ").join("_")}`
          ) ?? undefined
        }
        error={CreateError}
        success={CreateIsSuccess}
      />
      <Toast
        actionSuccess={t("messages.deleted")}
        actionError={t("messages.delete")}
        error={DeleteError}
        success={DeleteIsSuccess}
      />
    </Grid>
  );
};
