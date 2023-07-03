import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AutoComplete, Avatar, Empty, Input, Spin } from "antd";
import { MerchantQuery } from "../../../services/types/register/merchants/merchants.interface";
import { useListBanks } from "../../../routes/public/bank/listBanks";
import { useTranslation } from "react-i18next";

interface BankSelectProps {
  setQueryFunction: Dispatch<SetStateAction<any>>;
  queryOptions?: any;
  onChange?: (value: string) => void
  currentValue?: any
  setCurrentValue?: Dispatch<SetStateAction<any>>;
}

export const BanksSelect = ({
  setQueryFunction,
  queryOptions,
  currentValue,
  setCurrentValue,
}: BankSelectProps) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState<MerchantQuery>({
    page: 1,
    limit: 200,
  });
  const { bankListData, isBankListFetching, refetchBankList } =
    useListBanks(query);
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    setValue(
      bankListData?.itens.find((bank) => bank?.label_name === queryOptions?.bank)
        ?.label_name
    );
  }, [bankListData, queryOptions]);

  return (
    <AutoComplete
      size="large"
      options={
        bankListData?.itens?.map((item, index) => {
          return {
            key: index,
            value: item.label_name,
            label: (
              <>
                <Avatar src={item.icon_url} style={{ marginRight: 10 }} />
                {item.label_name}
              </>
            ),
          };
        }) ?? []
      }
      notFoundContent={<Empty />}
      value={currentValue || value}
      style={{ width: "100%", height: 40 }}
      onChange={(value) => setCurrentValue ? setCurrentValue(value) : setValue(value)}
      onSelect={(value) =>
        setQueryFunction((state: any) => ({ ...state, bank: value }))
      }
     /*  filterOption={(inputValue, option) =>
        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      } */
      placeholder={t("table.bank")}
    />
  );
};
