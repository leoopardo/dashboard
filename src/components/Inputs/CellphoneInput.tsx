/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import { DDIs } from "@src/utils/DDIsList";
import { AutoComplete, Avatar, Input, Space, Typography } from "antd";
import { Country } from "country-state-city";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";

interface CellphoneInterface {
  body: any;
  setBody: Dispatch<SetStateAction<any>>;
}

export const CellphoneInput = ({ body, setBody }: CellphoneInterface) => {
  const [codeFlag, setCodeFlag] = useState<any>(null);
  const { Countries } = useGetrefetchCountries();
  const countries = Country.getAllCountries();
  const [DDI, setDDI] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    if (Countries && countries && !started) {
      setCodeFlag(
        Countries?.filter((item, index, self) => {
          return self.indexOf(item) === index;
        }).map((c) => {
          return {
            phoneCode: countries?.find((c2) => c2.isoCode === c.cca2)
              ?.phonecode,
            flag: c.flags.svg,
          };
        })
      );
      setStarted(true);
    }
  }, [Countries, countries]);

  useEffect;

  function parsePhoneNumber(phoneNumber?: string) {
    const item = { ddi: "", phone: "" };
    for (const ddi in DDIs) {
      if (phoneNumber?.includes(DDIs[ddi])) {
        item.ddi = DDIs[ddi];
        item.phone = phoneNumber.split(DDIs[ddi])[1];
      }
    }
    return item;
  }

  useEffect(() => {
    if (body.cellphone) {
      setSearch(parsePhoneNumber(body?.cellphone).ddi);
      setDDI(parsePhoneNumber(body?.cellphone).ddi);
      setNumber(parsePhoneNumber(body?.cellphone).phone);
    }
  }, []);

  useEffect(() => {
    setBody((state: any) => ({
      ...state,
      cellphone: DDI && number ? `${DDI}${number}` : undefined,
    }));
  }, [DDI, number]);

  function getCellphoneFormat() {
    switch (DDI) {
      case "+1": // EUA e Canadá
        return "(999) 999-9999";

      case "+55": // Brasil
        return "(99) 9 9999-9999";

      case "+54": // Argentina
        return "(99) 9 9999-9999";

      case "+57": // Colômbia
        return "(999) 999-9999";

      case "+56": // Chile
        return "(9) 9999-9999";

      case "+51": // Peru
        return "(999) 999-999";

      // Europa
      case "+44": // Reino Unido
        return "99999 999999";

      case "+33": // França
        return "99 99 99 99 99";

      case "+49": // Alemanha
        return "9999 9999999";

      case "+39": // Itália
        return "999 999 9999";

      case "+34": // Espanha
        return "999 99 99 99";

      // Ásia
      case "+7": // Rússia
        return "(999) 999-99-99";

      case "+91": // Índia
        return "99999 99999";

      case "+86": // China
        return "9999 9999 9999";

      case "+81": // Japão
        return "99 9999 9999";

      case "+65": // Cingapura
        return "9999 9999";

      default:
        return "999999999999";
    }
  }

  return (
    <Space.Compact size="large" style={{ width: "100%" }}>
      <AutoComplete
        style={{ width: "60%" }}
        value={search}
        options={codeFlag?.map((item: any) => {
          return {
            label: (
              <Typography>
                <Avatar src={item.flag} />
                {` +${item.phoneCode.split("+")}`}
              </Typography>
            ),
            value: `+${item.phoneCode.split("+")}`,
          };
        })}
        filterOption={(inputValue, option) =>
          `+${option?.value}`
            ?.toUpperCase()
            .indexOf(inputValue.toUpperCase()) !== -1
        }
        onChange={(value) => {
          if (!value) {
            setDDI(undefined);
          }
          setSearch(value);
        }}
        onSelect={(value) => setDDI(value)}
      >
        <Input
          size="large"
          prefix={
            <Avatar
              style={{ height: 25, width: 25 }}
              src={
                codeFlag?.find(
                  (item: any) => item?.phoneCode === DDI?.split("+")[1]
                )?.flag
              }
            />
          }
        />
      </AutoComplete>
      <ReactInputMask
        value={number}
        mask={getCellphoneFormat()}
        disabled={!DDI}
        onChange={(event) => {
          const value = event.target.value.replace(/[^\d]/g, "");
          if (!value) {
            setNumber("");
          }
          setNumber(value);
        }}
        placeholder={getCellphoneFormat()}
      >
        <Input />
      </ReactInputMask>
    </Space.Compact>
  );
};
