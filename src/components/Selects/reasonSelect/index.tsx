/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useGetRowsMerchantBlacklistReasons } from "@services/register/merchant/blacklist/getMerchantBlacklistReason";
import { Empty, Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface MerchantSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
  currentValue?: string;
  onReasonChange?: (e: any) => void;
}

export const ReasonSelect = ({
  setQueryFunction,
  queryOptions,
  currentValue,
  onReasonChange,
}: MerchantSelectProps) => {
  const { t } = useTranslation();
  const { merchantBlacklistData } = useGetRowsMerchantBlacklistReasons();
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    if (merchantBlacklistData && !value) {
      const initial = merchantBlacklistData?.items?.find(
        (reason) => reason === queryOptions?.reason
      );
      if (initial) {
        setValue(initial);
      }
    }
  }, [queryOptions, merchantBlacklistData]);

  useEffect(() => {
    if (merchantBlacklistData) {
      const initial = merchantBlacklistData?.items?.find(
        (reason) => reason === queryOptions?.reason
      );

      setValue(initial);
    }
  }, [queryOptions]);

  return (
    <Select
      size="large"
      options={
        merchantBlacklistData?.items?.map((item, index) => {
          return { key: index, value: item.reason_name, label: item.reason_name };
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
