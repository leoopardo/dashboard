import { FC } from "react";
import { Empty, Select } from "antd";
import { useGetOrganizationCurrentAccounts } from "@src/services/reports/register/organization/getCurrentAccounts";
import { useTranslation } from "react-i18next";

interface CurrentAccountsSelectProps {
  setBody: any;
  body: any;
  query: any;
  setQuery: any;
  filterIdProp: string;
  filterIdValue: number | undefined;
}

const CurrentAccountsSelect: FC<CurrentAccountsSelectProps> = ({
  body,
  setBody,
  query,
  setQuery,
}) => {
  const { t } = useTranslation();
  const {
    CurrentAccountData,
    isCurrentAccountDataFetching,
    refetchCurrentAccountData,
  } = useGetOrganizationCurrentAccounts({ locked: false });

  return (
    <Select
      data-test-id="account-select"
      allowClear
      showSearch
      size="large"
      loading={isCurrentAccountDataFetching}
      onSearch={(value) => {
        if (value === "") {
          delete query.filterIdProp;
          return;
        }

        setQuery((state: any) => ({ ...state, filterIdProp: value }));
      }}
      options={
        CurrentAccountData?.items?.map((field, index) => {
          return {
            key: index,
            label: field.name,
            value: field.id,
          };
        }) ?? []
      }
      value={
        body?.group_id === null
          ? null
          : (CurrentAccountData?.items.find(
              (account) => account?.id === body?.account_id
            )?.name ||
              query?.name) ??
            ""
      }
      notFoundContent={<Empty />}
      style={{ width: "100%", height: 40 }}
      filterOption={(input, option) => {
        return (
          `${option?.label}`?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        );
      }}
      onChange={(value) => {
        setBody((state: any) => ({ ...state, account_id: value }));
      }}
      onSelect={() => refetchCurrentAccountData()}
      placeholder={t("table.bank_acc_number")}
    />
  );
};

export default CurrentAccountsSelect;
