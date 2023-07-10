/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select, Empty } from "antd";
import { useTranslation } from "react-i18next";
import { useGetRowsMerchantBlacklist } from "@services/register/merchant/blacklist/getMerchantBlacklistReason";

interface MerchantSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
  currentValue?: string;
  onReasonChange?: (e: any) => void
}

export const ReasonSelect = ({
  setQueryFunction,
  queryOptions,
  currentValue,
  onReasonChange,
}: MerchantSelectProps) => {
  const { t } = useTranslation();
  const { merchantBlacklistData } = useGetRowsMerchantBlacklist();
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    if (merchantBlacklistData && !value) {
      const initial = merchantBlacklistData?.find(
        (reason) => reason === queryOptions?.reason
      );
      if (initial) {
        setValue(initial);
      }
    }
  }, [queryOptions, merchantBlacklistData]);

  useEffect(() => {
    if (merchantBlacklistData) {
      const initial = merchantBlacklistData?.find(
        (reason) => reason === queryOptions?.reason
      );

      setValue(initial);
    }
  }, [queryOptions]);

  return (
    <Select
      size="large"
      options={
        merchantBlacklistData?.map((item, index) => {
          return { key: index, value: item, label: item };
        }) ?? []
      }
      value={currentValue || value}
      notFoundContent={<Empty />}
      onChange={(e) => {
        if (onReasonChange) {
          onReasonChange(e);
        }
        setValue(e);
      }}
      style={{ width: "100%", height: 40 }}
      onSelect={(value) =>
        setQueryFunction((state: any) => ({
          ...state,
          reason: value,
        }))
      }
      placeholder={t("table.black_list_reason")}
    />
  );
};
