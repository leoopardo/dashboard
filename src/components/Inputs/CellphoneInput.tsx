/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
import { DDIs } from "@src/utils/DDIsList";
import { Avatar, Input, Select, Space, Typography } from "antd";
import { Country } from "country-state-city";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";

interface CellphoneInterface {
  body: any;
  setBody: Dispatch<SetStateAction<any>>;
  setMask?: Dispatch<SetStateAction<string>>;
}

export const CellphoneInput = ({
  body,
  setBody,
  setMask,
}: CellphoneInterface) => {
  const [codeFlag, setCodeFlag] = useState<any>(null);
  const { Countries } = useGetrefetchCountries();
  const countries = Country.getAllCountries();
  const [DDI, setDDI] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);

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

  function getCellphoneFormat() {
    switch (DDI) {
      case "+1": // EUA e Canadá
        setMask && setMask("(999) 999-9999");
        return "(999) 999-9999";

      case "+55": // Brasil
        setMask && setMask("(99) 99999-9999");
        return "(99) 9 9999-9999";

      case "+54": // Argentina
        setMask && setMask("(99) 9 9999-9999");
        return "(99) 9 9999-9999";

      case "+57": // Colômbia
        setMask && setMask("(999) 999-9999");
        return "(999) 999-9999";

      case "+56": // Chile
        setMask && setMask("(9) 9999-9999");
        return "(9) 9999-9999";

      case "+51": // Peru
        setMask && setMask("(999) 999-999");
        return "(999) 999-999";

      // Europa
      case "+44": // Reino Unido
        setMask && setMask("99999 999999");
        return "99999 999999";

      case "+33": // França
        setMask && setMask("99 99 99 99 99");
        return "99 99 99 99 99";

      case "+49": // Alemanha
        setMask && setMask("9999 9999999");
        return "9999 9999999";

      case "+39": // Itália
        setMask && setMask("999 999 9999");
        return "999 999 9999";

      case "+34": // Espanha
        setMask && setMask("999 999 9999");
        return "999 99 99 99";

      // Ásia
      case "+7": // Rússia
        setMask && setMask("(999) 999-99-99");
        return "(999) 999-99-99";

      case "+91": // Índia
        setMask && setMask("99999 99999");
        return "99999 99999";

      case "+86": // China
        setMask && setMask("9999 9999 9999");
        return "9999 9999 9999";

      case "+81": // Japão
        setMask && setMask("99 9999 9999");
        return "99 9999 9999";

      case "+65": // Cingapura
        setMask && setMask("9999 9999");
        return "9999 9999";

      default:
        setMask && setMask("999999999999");
        return "999999999999";
    }
  }

  useEffect(() => {
    if (body?.cellphone) {
      setSearch(parsePhoneNumber(body?.cellphone).ddi);
      setDDI(parsePhoneNumber(body?.cellphone).ddi);
      setNumber(parsePhoneNumber(body?.cellphone).phone);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () =>
        setBody((state: any) => ({
          ...state,
          cellphone: DDI && number ? `${DDI}${number}` : undefined,
        })),
      500
    );

    return () => {
      clearTimeout(timer);
    };
  }, [DDI, number]);

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

  return (
    <Space.Compact size="large" style={{ width: "100%" }}>
      <Select
        showSearch
        allowClear
        data-test-id="cellphone-ddi"
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
          data-test-id="cellphone-ddi"
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
      </Select>
      <ReactInputMask
        data-test-id="cellphone-number"
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
        <Input data-test-id="cellphone-number" />
      </ReactInputMask>
    </Space.Compact>
  );
};
