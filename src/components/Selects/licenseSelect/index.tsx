/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetLicenses } from "@src/services/register/licenses/getLicenses";
import { LicenseQuery } from "@src/services/types/register/licenses/licenses.interface";
import useDebounce from "@src/utils/useDebounce";
import { Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface licenseSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
}

export const LicenseSelect = ({
  setQueryFunction,
  queryOptions,
}: licenseSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<LicenseQuery>({
    page: 1,
    limit: 200,
    sort_field: "name",
    sort_order: "ASC",
    name: "",
  });
  const { LicenseData, isLicenseDataFetching, refetchLicenseData } =
    useGetLicenses(query);

  const [value, setValue] = useState<any>(null);
  const debounceSearch = useDebounce(query.name);

  useEffect(() => {
    if (!queryOptions?.license_id) {
      setValue(undefined);
    }
    if (!value) {
      const initial = LicenseData?.items.find(
        (license) =>
          license.id === (queryOptions?.license?.id || queryOptions?.license_id)
      );
      if (initial) {
        setValue(initial?.name);
      }
    }
  }, [queryOptions, LicenseData]);

  useEffect(() => {
    refetchLicenseData();
  }, [debounceSearch]);

  useEffect(() => {
    if (
      !LicenseData?.items.some(
        (license) => license.id === queryOptions?.license_id
      )
    ) {
      return setValue(undefined);
    }
  }, [LicenseData]);

  return (
    <Select
      data-test-id="license-select"
      allowClear
      showSearch
      size="large"
      loading={isLicenseDataFetching}
      value={value}
      onSelect={() => {
        delete query.name;
        refetchLicenseData();
      }}
      onSearch={(value) => {
        if (value === "") {
          delete query.name;
          refetchLicenseData();
          return;
        }

        setQuery((state: any) => ({ ...state, name: value }));
      }}
      onChange={(value) => {
        if (!value) {
          setValue(undefined);
          setQueryFunction((state: any) => ({
            ...state,
            license_id: undefined,
          }));
          return;
        }
        setQueryFunction((state: any) => ({
          ...state,
          license_id: value,
        }));
        setValue(
          LicenseData?.items.find((license) => license.id === value)?.name
        );
      }}
      options={LicenseData?.items.map((license) => {
        return {
          label: license.name,
          value: license.id,
        };
      })}
      filterOption={(input, option) => {
        return (
          `${option?.label}`?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        );
      }}
      placeholder={t("table.license")}
    />
  );
};
