import {
  Button,
  Drawer,
  DatePicker,
  Select,
  Divider,
  Form,
  ConfigProvider,
  AutoComplete,
  Slider,
  Checkbox,
} from "antd";
import { t } from "i18next";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import moment from "moment";
const { RangePicker } = DatePicker;
import "dayjs/locale/zh-cn";
import locale from "antd/locale/pt_BR";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { PartnerSelect } from "../Selects/partnerSelect";
import { MerchantSelect } from "../Selects/merchantSelect";
import { BanksSelect } from "../Selects/bankSelect";
import { ClientBanksSelect } from "../Selects/clientBanksSelect";
import { FilterChips } from "./filterChips";
import { useGetStates } from "../../services/states_cities/getStates";
import { useGetCities } from "../../services/states_cities/getCities";

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
  haveInitialDate?: boolean;
  initialQuery: any;
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
  haveInitialDate,
  initialQuery,
}: FilterModalProps) => {
  const [filtersQuery, setFiltersQuery] = useState<any>(query);
  const { isStatesFetching, states } = useGetStates();
  const [isAgeRangeAbled, setIsAgeRangeAbled] = useState<boolean>(false);
  const [isValueRangeAbled, setIsValueRangeAbled] = useState<boolean>(false);
  const { cities, isCitiesFetching, refetchCities } = useGetCities(
    filtersQuery.state
  );

  useEffect(() => {
    if (query.age_start) {
      setIsAgeRangeAbled(true);
    }
    if (query.value_start) {
      setIsValueRangeAbled(true);
    }

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

  useEffect(() => {
    refetchCities();
  }, [filtersQuery.state]);

  useEffect(() => {
    const q = { ...filtersQuery };

    if (!isAgeRangeAbled) {
      delete q.age_start;
      delete q.age_end;
      setFiltersQuery(q);
    }
    if (isAgeRangeAbled && !query.age_start) {
      setFiltersQuery((state: any) => ({
        ...state,
        age_start: 0,
        age_end: 100,
      }));
    }
  }, [isAgeRangeAbled]);

  useEffect(() => {
    const q = { ...filtersQuery };

    if (!isValueRangeAbled) {
      delete q.value_start;
      delete q.value_end;
      setFiltersQuery(q);
    }
    if (isValueRangeAbled && !query.value_start) {
      setFiltersQuery((state: any) => ({
        ...state,
        value_start: 0,
        value_end: 50000,
      }));
    }
  }, [isValueRangeAbled]);

  return (
    <Drawer
      title={`${t("table.filters")}`}
      placement="right"
      bodyStyle={{ overflowX: "hidden" }}
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
          {t("table.apply_filters")}
        </Button>
      }
    >
      <Grid
        container
        style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={10}>
          {t("table.used_filters")}:
        </Grid>
        <Grid item xs={2}>
          <Button type="dashed" onClick={() => setQuery(initialQuery)} danger>
            <FilterAltOffOutlinedIcon />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FilterChips
            query={filtersQuery || query}
            setQuery={setQuery}
            startDateKeyName={startDateKeyName}
            endDateKeyName={endDateKeyName}
            haveInitialDate={haveInitialDate}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Form initialValues={filtersQuery}>
          {filters.map((filter) => {
            switch (filter) {
              case startDateKeyName:
                return (
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ConfigProvider locale={locale}>
                      <RangePicker
                        size="small"
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
                  <Grid item xs={12}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ margin: 10 }}
                    >
                      <PartnerSelect
                        queryOptions={filtersQuery}
                        setQueryFunction={setFiltersQuery}
                      />
                    </Form.Item>
                  </Grid>
                );

              case "bank":
                return (
                  <Grid item xs={12}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ margin: 10 }}
                    >
                      <BanksSelect
                        queryOptions={filtersQuery}
                        setQueryFunction={setFiltersQuery}
                      />
                    </Form.Item>
                  </Grid>
                );

              case "payer_bank":
                return (
                  <Grid item xs={12}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ margin: 10 }}
                    >
                      <ClientBanksSelect
                        queryOptions={filtersQuery}
                        setQueryFunction={setFiltersQuery}
                      />
                    </Form.Item>
                  </Grid>
                );

              case "age_start":
                return (
                  <Grid
                    container
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Grid item xs={3}>
                      <Checkbox
                        checked={isAgeRangeAbled}
                        onChange={(event: any) => {
                          setIsAgeRangeAbled(event.target.checked);
                          console.log(isAgeRangeAbled);
                        }}
                      >
                        {t("table.age")}
                      </Checkbox>
                    </Grid>
                    <Grid item xs={8}>
                      <Slider
                        disabled={!isAgeRangeAbled}
                        range
                        step={10}
                        value={[filtersQuery.age_start, filtersQuery.age_end]}
                        onChange={(value) => {
                          setFiltersQuery((state: any) => ({
                            ...state,
                            age_start: value[0],
                            age_end: value[1],
                          }));
                        }}
                      />
                    </Grid>
                  </Grid>
                );

              case "value_start":
                return (
                  <Grid
                    container
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Grid item xs={3}>
                      <Checkbox
                        checked={isValueRangeAbled}
                        onChange={(event: any) => {
                          setIsValueRangeAbled(event.target.checked);
                          console.log(isAgeRangeAbled);
                        }}
                      >
                        {t("table.value")}
                      </Checkbox>
                    </Grid>
                    <Grid item xs={8}>
                      <Slider
                        disabled={!isValueRangeAbled}
                        range
                        step={10}
                        max={50000}
                        value={[
                          filtersQuery.value_start,
                          filtersQuery.value_end,
                        ]}
                        onChange={(value) => {
                          setFiltersQuery((state: any) => ({
                            ...state,
                            value_start: value[0],
                            value_end: value[1],
                          }));
                        }}
                      />
                    </Grid>
                  </Grid>
                );

              case "state":
                return (
                  <Grid item xs={12} style={{ margin: "2px" }}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ margin: 10 }}
                    >
                      <AutoComplete
                        size="large"
                        style={{ width: "100%", height: "40px" }}
                        placeholder={t(`table.${filter}`)}
                        value={filtersQuery[filter] ?? null}
                        onSelect={(value) => {
                          setFiltersQuery((state: any) => ({
                            ...state,
                            [filter]: value,
                          }));
                        }}
                        filterOption={(inputValue, option) =>
                          option!.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                        options={states?.map((state) => {
                          return {
                            value: state.sigla,
                            label: state.sigla,
                          };
                        })}
                      />
                    </Form.Item>
                  </Grid>
                );
              case "city":
                return (
                  <Grid item xs={12} style={{ margin: "2px" }}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ margin: 10 }}
                    >
                      <AutoComplete
                        size="large"
                        disabled={!filtersQuery.state}
                        style={{ width: "100%", height: "40px" }}
                        placeholder={t(`table.${filter}`)}
                        value={filtersQuery[filter] ?? null}
                        onSelect={(value) => {
                          setFiltersQuery((state: any) => ({
                            ...state,
                            [filter]: value,
                          }));
                          console.log(value);
                        }}
                        filterOption={(inputValue, option) =>
                          option!.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                        options={cities?.map((state) => {
                          return {
                            value: state.nome,
                            label: state.nome,
                          };
                        })}
                      />
                    </Form.Item>
                  </Grid>
                );

              case "merchant_id":
                return (
                  <Grid item xs={12}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ margin: 10 }}
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
                  <Grid item xs={12} style={{ margin: "2px" }}>
                    <Form.Item
                      label={t(`table.${filter}`)}
                      name={filter}
                      style={{ margin: 10 }}
                    >
                      <Select
                        size="large"
                        style={{ width: "100%", height: "40px" }}
                        placeholder={t(`table.${filter}`)}
                        value={filtersQuery[filter] ?? null}
                        onChange={(value) => {
                          setFiltersQuery((state: any) => ({
                            ...state,
                            [filter]: value,
                          }));
                          console.log(value);
                        }}
                        options={
                          selectOptions[filter]?.map((option: any) => {
                            return {
                              value: option,
                              label: t(`table.${option.toLowerCase()}`),
                            };
                          }) ?? []
                        }
                      />
                    </Form.Item>
                  </Grid>
                );
            }
          })}
        </Form>
      </Grid>
    </Drawer>
  );
};
