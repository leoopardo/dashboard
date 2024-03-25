/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useGetRowsAggregatorBlacklistReasons } from "@src/services/register/aggregator/blacklist/getAggregatorBlacklistReason";
import { Empty, Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface MerchantSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions: any;
  currentValue?: string;
  onReasonChange?: (e: any) => void;
}

export const AggregatorReasonSelect = ({
  setQueryFunction,
  queryOptions,
  currentValue,
  onReasonChange,
}: MerchantSelectProps) => {
  const { t } = useTranslation();
  const { AggregatorBlacklistData } = useGetRowsAggregatorBlacklistReasons();
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    console.log({queryOptions})
    if (AggregatorBlacklistData) {
      const initial = AggregatorBlacklistData?.items?.find(
        (reason) => reason?.reason_name === queryOptions?.reason
      );

      setValue(initial?.reason_name);
    }
  }, [queryOptions, AggregatorBlacklistData]);

  return (
    <Select
      size="large"
      options={
        AggregatorBlacklistData?.items?.map((item, index) => {
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
