import {
  Button,
  Drawer,
  DatePicker,
  Select,
  Divider,
  Form,
  ConfigProvider,
} from "antd";
import { t } from "i18next";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import moment from "moment";
const { RangePicker } = DatePicker;
import "dayjs/locale/zh-cn";
import locale from "antd/locale/pt_BR";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { PartnerSelect } from "../partnerSelect";
import { MerchantSelect } from "../merchantSelect";

dayjs.extend(weekday);
dayjs.extend(localeData);

interface FilterModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  query: any;
  setQuery: Dispatch<SetStateAction<any>>;
  refetch: () => void;
  filters: string[];
  selectOptions: any;
  startDateKeyName: string;
  endDateKeyName: string;
}

export const FiltersModal = ({
  open,
  setOpen,
  query,
  setQuery,
  refetch,
  filters,
  selectOptions,
  startDateKeyName,
  endDateKeyName,
}: FilterModalProps) => {
  const [filtersQuery, setFiltersQuery] = useState<any>(query);

  useEffect(() => {
    setFiltersQuery({
      ...query,
      page: null,
      limit: null,
      sort_order: null,
      sort_field: null,
      [startDateKeyName]: moment(query[startDateKeyName]),
      [endDateKeyName]: moment(query[endDateKeyName]),
    });
  }, [query]);

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Drawer
      title={`${t("table.filters")}`}
      placement="right"
      onClose={() => setOpen(false)}
      open={open}
      footer={
        <Button
          type="primary"
          onClick={() => {
            setQuery({ ...filtersQuery, page: 1, limit: 25 });
            setOpen(false);
          }}
          style={{ width: "100%", height: "50px" }}
        >
          Aplicar filtros
        </Button>
      }
    >
      <Grid container spacing={2}>
        <Form>
          {filters.map((filter) => {
            switch (filter) {
              case startDateKeyName:
                return (
                  <Grid item xs={12}>
                    <ConfigProvider locale={locale}>
                      <RangePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime
                        value={[
                          dayjs(
                            filtersQuery[startDateKeyName],
                            "YYYY-MM-DD HH:mm:ss"
                          ),
                          dayjs(
                            filtersQuery[endDateKeyName],
                            "YYYY-MM-DD HH:mm:ss"
                          ),
                        ]}
                        style={{
                          width: "100%",
                          height: "35px",
                          margin: "2px",
                        }}
                        placeholder={[
                          t("table.initial_date"),
                          t("table.final_date"),
                        ]}
                        onChange={(value: any) => {
                          setFiltersQuery((state: any) => ({
                            ...state,
                            [startDateKeyName]: moment(value[0]?.$d).format(
                              "YYYY-MM-DDTHH:mm:ss.SSS"
                            ),
                            [endDateKeyName]: moment(value[1]?.$d).format(
                              "YYYY-MM-DDTHH:mm:ss.SSS"
                            ),
                          }));
                          console.log(filtersQuery);
                        }}
                      />
                    </ConfigProvider>
                  </Grid>
                );

              case "partner_id":
                return (
                  <Grid xs={12}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ height: 15 }}
                    >
                      <PartnerSelect
                        queryOptions={filtersQuery}
                        setQueryFunction={setFiltersQuery}
                      />
                    </Form.Item>
                  </Grid>
                );
              case "merchant_id":
                return (
                  <Grid xs={12}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ height: 15 }}
                    >
                      <MerchantSelect
                        queryOptions={filtersQuery}
                        setQueryFunction={setFiltersQuery}
                      />
                    </Form.Item>
                  </Grid>
                );
              case endDateKeyName:
                return;

              default:
                return (
                  <Grid item xs={12}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ height: 15 }}
                    >
                      <Select
                        style={{ width: "100%", height: "40px", margin: "2px" }}
                        placeholder={filter}
                        value={filtersQuery[filter]}
                        onChange={(value) => {
                          setFiltersQuery((state: any) => ({
                            ...state,
                            [filter]: value,
                          }));
                          console.log(value);
                        }}
                        options={selectOptions[filter].map((option: any) => {
                          return {
                            value: option,
                            label: t(`table.${option.toLowerCase()}`),
                          };
                        })}
                      />
                    </Form.Item>
                  </Grid>
                );
                break;
            }
          })}
        </Form>
      </Grid>
    </Drawer>
  );
};
