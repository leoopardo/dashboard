/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { getUtcOffset } from "@src/utils/getUtc";
import {
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Drawer,
  Form,
  FormInstance,
  Segmented,
  Select,
  Slider,
  Typography,
} from "antd";
import locale from "antd/locale/pt_BR";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useGetCities } from "../../services/states_cities/getCities";
import { useGetStates } from "../../services/states_cities/getStates";
import { AggregatorSelect } from "../Selects/aggregatorSelect";
import { BanksSelect } from "../Selects/bankSelect";
import { ClientBanksSelect } from "../Selects/clientBanksSelect";
import { MerchantSelect } from "../Selects/merchantSelect";
import { OperatorSelect } from "../Selects/operatorSelect";
import { PartnerSelect } from "../Selects/partnerSelect";
import { ReasonSelect } from "../Selects/reasonSelect";
import { FilterChips } from "./filterChips";
import { StyleWrapperDatePicker } from "./styles";
const { RangePicker } = DatePicker;

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
  maxRange?: boolean;
  disabled?: string[];
  disableMinutes?: boolean;
}

export const FiltersModal = ({
  open,
  setOpen,
  query,
  setQuery,
  filters,
  selectOptions,
  startDateKeyName,
  endDateKeyName,
  haveInitialDate,
  maxRange,
  initialQuery,
  disabled,
  disableMinutes,
}: FilterModalProps) => {
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const user = queryClient.getQueryData("validate") as ValidateInterface;
  const { t } = useTranslation();
  const [filtersQuery, setFiltersQuery] = useState<any>(query);
  const { states } = useGetStates();
  const [isAgeRangeAbled, setIsAgeRangeAbled] = useState<boolean>(false);
  const [isValueRangeAbled, setIsValueRangeAbled] = useState<boolean>(false);
  const [currState, setCurrState] = useState<string>("");
  const { cities, refetchCities } = useGetCities(currState);
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<FormInstance>(null);
  const [rangePickerValue, setRangePickerValue] = useState<
    "today" | "yesterday" | "this_month" | "custom" | undefined
  >("today");
  const isMobile = useMediaQuery({ maxWidth: "750px" });
  const [viewDateInput, setViewDateInput] = useState<boolean>(false);
  const rangePickerRef = useRef<any>(null);

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
      [startDateKeyName]: query[startDateKeyName]
        ? moment(query[startDateKeyName]).add(getUtcOffset(), "hours").toString()
        : null,
      [endDateKeyName]: query[endDateKeyName]
        ? moment(query[endDateKeyName]).add(getUtcOffset(), "hours").toString()
        : null,
    });
  }, [query]);

  useEffect(() => {
    refetchCities();
  }, [currState]);

  const isAgeAbled = (isAbled: boolean) => {
    const q = { ...filtersQuery };

    if (!isAbled) {
      delete q.age_start;
      delete q.age_end;
      setFiltersQuery(q);
    }
    if (isAbled && !query.age_start) {
      setFiltersQuery((state: any) => ({
        ...state,
        age_start: 1,
        age_end: 100,
      }));
    }
  };

  const isValueAbled = (isAbled: boolean) => {
    const q = { ...filtersQuery };

    if (!isAbled) {
      delete q.value_start;
      delete q.value_end;
      setFiltersQuery(q);
    }
    if (isAbled && !query.value_start) {
      setFiltersQuery((state: any) => ({
        ...state,
        value_start: 0,
        value_end: 50000,
      }));
    }
  };

  const panelRender = (panelNode: any) => (
    <StyleWrapperDatePicker>{panelNode}</StyleWrapperDatePicker>
  );

  useEffect(() => {
    if (
      moment(new Date(query[startDateKeyName])).format(
        "YYYY-MM-DDTHH:mm:00.000"
      ) ===
        moment(new Date())
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000") &&
      moment(new Date(query[endDateKeyName])).format(
        "YYYY-MM-DDTHH:mm:00.000"
      ) ===
        moment(new Date())
          .add(1, "day")
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000")
    ) {
      setRangePickerValue("today");
    } else if (
      moment(new Date(query[startDateKeyName])).format(
        "YYYY-MM-DDTHH:mm:00.000"
      ) ===
        moment(new Date())
          .subtract(1, "day")
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000") &&
      moment(new Date(query[endDateKeyName])).format(
        "YYYY-MM-DDTHH:mm:00.000"
      ) ===
        moment(new Date())
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000")
    ) {
      setRangePickerValue("yesterday");
    } else if (
      moment(new Date(query[startDateKeyName])).format(
        "YYYY-MM-DDTHH:mm:00.000"
      ) ===
        moment(new Date())
          .startOf("M")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000") &&
      moment(new Date(query[endDateKeyName])).format(
        "YYYY-MM-DDTHH:mm:00.000"
      ) ===
        moment(new Date())
          .endOf("M")
          .add(1, "day")
          .startOf("day")
          .utc()
          .format("YYYY-MM-DDTHH:mm:00.000")
    ) {
      setRangePickerValue("this_month");
    } else {
      if (!query[startDateKeyName] && !query[endDateKeyName]) {
        if (!haveInitialDate) return;
        setFiltersQuery((state: any) => ({
          ...state,
          [startDateKeyName]: moment(new Date())
            .startOf("day")
            .format("YYYY-MM-DDTHH:mm:00.000"),
          [endDateKeyName]: moment(new Date())
            .add(1, "day")
            .startOf("day")
            .format("YYYY-MM-DDTHH:mm:00.000"),
        }));
        return;
      }
      setRangePickerValue("custom");
      setViewDateInput(true);
    }
  }, [query]);

  return (
    <Drawer
      data-test-id="filters-modal"
      title={`${t("table.filters")}`}
      placement="right"
      bodyStyle={{ overflowX: "hidden" }}
      onClose={() => setOpen(false)}
      open={open}
      footer={
        <Button
          data-test-id="button-apply-filters"
          type="primary"
          onClick={() => {
            submitRef.current?.click();
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
          <Typography data-test-id="used-filters-text">
            {t("table.used_filters")}:
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            data-test-id="button-clear-filters"
            type="dashed"
            onClick={() => {
              setQuery(initialQuery);
            }}
            danger
          >
            <FilterAltOffOutlinedIcon />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FilterChips
            data-test-id="filter-chips"
            query={{
              ...filtersQuery,
              [startDateKeyName]: filtersQuery[startDateKeyName]
                ? moment(new Date(filtersQuery[startDateKeyName])).utc().toString()
                : undefined,
              [endDateKeyName]: filtersQuery[endDateKeyName]
                ? moment(new Date(filtersQuery[endDateKeyName])).utc().toString()
                : undefined,
            }}
            setQuery={setQuery}
            startDateKeyName={startDateKeyName}
            endDateKeyName={endDateKeyName}
            haveInitialDate={haveInitialDate}
            disabled={disabled}
          />
        </Grid>
      </Grid>

      <Form
        data-test-id="form-filters"
        ref={formRef}
        initialValues={filtersQuery}
        layout="vertical"
        onFinish={() => {
          setQuery({
            ...filtersQuery,
            [startDateKeyName]: filtersQuery[startDateKeyName]
              ? moment(filtersQuery[startDateKeyName])
                  .utc()
                  .format("YYYY-MM-DDTHH:mm:00.000")
              : undefined,
            [endDateKeyName]: filtersQuery[endDateKeyName]
              ? moment(filtersQuery[endDateKeyName])
                  .utc()
                  .format("YYYY-MM-DDTHH:mm:00.000")
              : undefined,
            page: 1,
            limit: 25,
          });
          setOpen(false);
        }}
      >
        {filters.map((filter) => {
          switch (filter) {
            case startDateKeyName:
              return (
                <Form.Item
                  data-test-id="form-item-start-date"
                  label={t("table.date")}
                  style={{ marginBottom: 10 }}
                >
                  <Segmented
                    style={{ marginBottom: 8 }}
                    options={[
                      { label: t("table.today"), value: "today" },
                      { label: t("table.yesterday"), value: "yesterday" },
                      { label: t("table.this_month"), value: "this_month" },
                      {
                        label: t("table.custom_date"),
                        value: "custom",
                        icon: <CalendarOutlined />,
                      },
                    ]}
                    value={rangePickerValue}
                    defaultValue={rangePickerValue}
                    onChange={(value: any) => {
                      setRangePickerValue(value);
                      if (value === "today") {
                        setFiltersQuery((state: any) => ({
                          ...state,
                          [startDateKeyName]: moment(new Date())
                            .startOf("day")
                            .format("YYYY-MM-DDTHH:mm:00.000"),
                          [endDateKeyName]: moment(new Date())
                            .add(1, "day")
                            .startOf("day")
                            .format("YYYY-MM-DDTHH:mm:00.000"),
                        }));
                      }
                      if (value === "yesterday") {
                        setFiltersQuery((state: any) => ({
                          ...state,
                          [startDateKeyName]: moment(new Date())
                            .subtract(1, "day")
                            .startOf("day")
                            .format("YYYY-MM-DDTHH:mm:00.000"),
                          [endDateKeyName]: moment(new Date())
                            .startOf("day")
                            .format("YYYY-MM-DDTHH:mm:00.000"),
                        }));
                      }
                      if (value === "this_month") {
                        setFiltersQuery((state: any) => ({
                          ...state,
                          [startDateKeyName]: moment(new Date())
                            .startOf("M")
                            .format("YYYY-MM-DDTHH:mm:00.000"),
                          [endDateKeyName]: moment(new Date())
                            .endOf("M")
                            .add(1, "day")
                            .startOf("day")
                            .format("YYYY-MM-DDTHH:mm:00.000"),
                        }));
                      }
                      if (value === "custom") {
                        setTimeout(() => {
                          setViewDateInput(true);
                        }, 250);
                      } else {
                        setViewDateInput(false);
                      }
                    }}
                  />

                  {viewDateInput && (
                    <Form.Item
                      data-test-id="form-item-start-date"
                      name={"date"}
                      style={{ marginBottom: 10 }}
                      rules={[
                        {
                          required:
                            haveInitialDate && !filtersQuery[startDateKeyName],
                        },
                        {
                          validator: () => {
                            if (
                              maxRange &&
                              filtersQuery[endDateKeyName] >
                                moment(new Date(filtersQuery[startDateKeyName]))
                                  .add(32, "days")
                                  .format("YYYY-MM-DDTHH:mm:00.000")
                            ) {
                              return Promise.reject(t("error.date_too_log"));
                            } else return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <ConfigProvider locale={locale}>
                        <RangePicker
                          presets={
                            !isMobile
                              ? [
                                  {
                                    label: t("table.today"),
                                    value: [
                                      dayjs().startOf("day"),
                                      dayjs().add(1, "day").startOf("day"),
                                    ],
                                  },
                                  {
                                    label: t("table.yesterday"),
                                    value: [
                                      dayjs().subtract(1, "day").startOf("day"),
                                      dayjs().startOf("day"),
                                    ],
                                  },
                                  {
                                    label: t("table.this_month"),
                                    value: [
                                      dayjs().startOf("M"),
                                      dayjs()
                                        .endOf("M")
                                        .add(1, "D")
                                        .startOf("day"),
                                    ],
                                  },
                                  {
                                    label: t("table.last_month"),
                                    value: [
                                      dayjs().subtract(1, "M").startOf("M"),
                                      dayjs()
                                        .subtract(1, "M")
                                        .endOf("M")
                                        .add(1, "D")
                                        .startOf("day"),
                                    ],
                                  },
                                  {
                                    label: t("table.last_7"),
                                    value: [
                                      dayjs().add(-7, "d").startOf("day"),
                                      dayjs().add(1, "day").startOf("day"),
                                    ],
                                  },
                                  {
                                    label: t("table.last_14"),
                                    value: [
                                      dayjs().add(-14, "d").startOf("day"),
                                      dayjs().add(1, "day").startOf("day"),
                                    ],
                                  },
                                  {
                                    label: t("table.last_30"),
                                    value: [
                                      dayjs().add(-30, "d").startOf("day"),
                                      dayjs().add(1, "day").startOf("day"),
                                    ],
                                  },
                                ]
                              : undefined
                          }
                          changeOnBlur
                          ref={rangePickerRef}
                          data-test-id="range-picker-date-filter"
                          panelRender={panelRender}
                          format={
                            navigator.language === "pt-BR"
                              ? "DD/MM/YYYY HH:mm"
                              : "YYYY/MM/DD HH:mm"
                          }
                          showMinute={disableMinutes ? false : true}
                          popupStyle={{ marginLeft: "40px" }}
                          showTime
                          value={[
                            filtersQuery[startDateKeyName]
                              ? dayjs(
                                  moment(
                                    new Date(filtersQuery[startDateKeyName])
                                  )
                                    .toString()
                                )
                              : dayjs(
                                  moment(new Date())
                                    .startOf("day")
                                    .format("YYYY-MM-DDTHH:mm:00.000")
                                ),
                            filtersQuery[endDateKeyName]
                              ? dayjs(
                                  moment(new Date(filtersQuery[endDateKeyName]))
                                    .toString()
                                    .toString()
                                )
                              : dayjs(
                                  moment(new Date())
                                    .add(1, "day")
                                    .startOf("day")
                                    .format("YYYY-MM-DDTHH:mm:00.000")
                                ),
                          ]}
                          clearIcon={<></>}
                          placeholder={[
                            t("table.initial_date"),
                            t("table.final_date"),
                          ]}
                          onCalendarChange={(value: any) => {
                            console.log(value);
                          }}
                          onChange={(value: any) => {
                            const [startDate, endDate] = value;
                            setFiltersQuery((state: any) => ({
                              ...state,
                              [startDateKeyName]: startDate
                                ? startDate.format("YYYY-MM-DDTHH:mm:00.000")
                                : null,
                              [endDateKeyName]: endDate
                                ? endDate.format("YYYY-MM-DDTHH:mm:59.999")
                                : null,
                            }));

                            console.log(startDate);

                            formRef?.current?.validateFields();
                          }}
                          autoFocus={false}
                          autoComplete="off"
                          allowClear
                          inputReadOnly
                        />
                      </ConfigProvider>
                    </Form.Item>
                  )}
                </Form.Item>
              );

            case "partner_id":
              if (
                permissions.register.partner.partner.partner_list &&
                !user.partner_id
              ) {
                return (
                  <Form.Item
                    data-test-id="form-item-partner"
                    label={t(`table.partner`)}
                    name={filter}
                    style={{ marginBottom: 10 }}
                  >
                    <PartnerSelect
                      data-test-id="partner-select"
                      queryOptions={filtersQuery}
                      setQueryFunction={setFiltersQuery}
                    />
                  </Form.Item>
                );
              } else return;

            case "bank":
              return (
                <Form.Item
                  data-test-id="form-item-bank"
                  label={t(`table.${filter}`)}
                  name={filter}
                  style={{ marginBottom: 10 }}
                >
                  <BanksSelect
                    data-test-id="bank-select"
                    queryOptions={filtersQuery}
                    setQueryFunction={setFiltersQuery}
                    field={filter}
                  />
                </Form.Item>
              );

            case "cash_in_bank":
            case "cash_out_bank":
              if (
                permissions.register.merchant.merchant.merchant_config_banks
              ) {
                return (
                  <Form.Item
                    data-test-id="form-item-cash-in-out-bank"
                    label={t(`table.${filter}`)}
                    name={filter}
                    style={{ marginBottom: 10 }}
                  >
                    <BanksSelect
                      data-test-id="cash-in-out-bank-select"
                      queryOptions={filtersQuery}
                      setQueryFunction={setFiltersQuery}
                      field={filter}
                    />
                  </Form.Item>
                );
              } else return;

            case "payer_bank":
              if (
                permissions.register.person.client_banks
                  .person_client_banks_list
              ) {
                return (
                  <Form.Item
                    data-test-id="form-item-payer-bank"
                    label={t(`table.${filter}`)}
                    name={filter}
                    style={{ marginBottom: 10 }}
                  >
                    <ClientBanksSelect
                      data-test-id="payer-bank-select"
                      queryOptions={filtersQuery}
                      setQueryFunction={setFiltersQuery}
                    />
                  </Form.Item>
                );
              } else return;

            case "age_start":
              return (
                <Grid
                  container
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: 10,
                  }}
                >
                  <Grid item xs={3}>
                    <Checkbox
                      data-test-id="checkbox-age-range"
                      checked={isAgeRangeAbled}
                      onChange={(event: any) => {
                        isAgeAbled(event.target.checked);
                        setIsAgeRangeAbled(event.target.checked);
                      }}
                    >
                      {t("table.age")}
                    </Checkbox>
                  </Grid>
                  <Grid item xs={8}>
                    <Slider
                      data-test-id="slider-age-range"
                      disabled={!isAgeRangeAbled}
                      range
                      min={1}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: 10,
                  }}
                >
                  <Grid item xs={3}>
                    <Checkbox
                      data-test-id="checkbox-value-range"
                      checked={isValueRangeAbled}
                      onChange={(event: any) => {
                        isValueAbled(event.target.checked);
                        setIsValueRangeAbled(event.target.checked);
                      }}
                    >
                      {t("table.value")}
                    </Checkbox>
                  </Grid>
                  <Grid item xs={8}>
                    <Slider
                      data-test-id="slider-value-range"
                      disabled={!isValueRangeAbled}
                      range
                      step={10}
                      max={50000}
                      value={[filtersQuery.value_start, filtersQuery.value_end]}
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
                <Form.Item
                  data-test-id="form-item-state"
                  label={t(`table.${filter}`)}
                  name={filter}
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    allowClear
                    data-test-id="autocomplete-state"
                    size="large"
                    style={{ width: "100%", height: "40px" }}
                    onClear={() => {
                      const filter = { ...filtersQuery };
                      delete filter.city;
                      delete filter.state;
                      setFiltersQuery(filter);
                    }}
                    placeholder={t(`table.${filter}`)}
                    value={filtersQuery[filter] ?? null}
                    onSelect={(value) => {
                      delete filtersQuery.city;
                      setFiltersQuery((state: any) => ({
                        ...state,
                        [filter]: value,
                      }));
                      setCurrState(value);
                    }}
                    filterOption={(inputValue, option) =>
                      option?.value
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
              );
            case "city":
              return (
                <Form.Item
                  data-test-id="form-item-city"
                  label={t(`table.${filter}`)}
                  name={filter}
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    allowClear
                    data-test-id="autocomplete-city"
                    size="large"
                    disabled={!filtersQuery.state}
                    style={{ width: "100%", height: "40px" }}
                    placeholder={t(`table.${filter}`)}
                    value={filtersQuery[filter] ?? null}
                    onClear={() => {
                      const filter = { ...filtersQuery };
                      delete filter.city;
                      setFiltersQuery(filter);
                    }}
                    onSelect={(value) => {
                      setFiltersQuery((state: any) => ({
                        ...state,
                        [filter]: value,
                      }));
                    }}
                    filterOption={(inputValue, option) =>
                      option?.value
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
              );

            case "merchant_id":
              if (
                permissions.register.merchant.merchant.merchant_list &&
                !user.merchant_id
              ) {
                return (
                  <Form.Item
                    data-test-id="form-item-merchant"
                    label={t(`table.merchant`)}
                    style={{ marginBottom: 10 }}
                  >
                    <MerchantSelect
                      queryOptions={filtersQuery}
                      setQueryFunction={setFiltersQuery}
                    />
                  </Form.Item>
                );
              } else return;

            case "aggregator_id":
              if (
                permissions.register.aggregator.aggregator.aggregator_list &&
                !user.aggregator_id
              ) {
                return (
                  <Form.Item
                    data-test-id="form-item-aggregator"
                    label={t(`table.aggregator`)}
                    name={filter}
                    style={{ marginBottom: 10 }}
                  >
                    <AggregatorSelect
                      data-test-id="aggregator-select"
                      aggregatorId={filtersQuery?.aggregator_id}
                      setQueryFunction={setFiltersQuery}
                    />
                  </Form.Item>
                );
              }
              return;

            case "operator_id":
              if (
                permissions.register.operator.operator.operator_list &&
                !user.operator_id
              ) {
                return (
                  <Form.Item
                    data-test-id="form-item-operator"
                    label={t(`table.operator`)}
                    name={filter}
                    style={{ marginBottom: 10 }}
                  >
                    <OperatorSelect
                      data-test-id="operator-select"
                      queryOptions={filtersQuery}
                      setQueryFunction={setFiltersQuery}
                    />
                  </Form.Item>
                );
              } else return;

            case "reason":
              return (
                <Form.Item
                  data-test-id="form-item-reason"
                  label={t(`table.${filter}`)}
                  name={filter}
                  style={{ marginBottom: 10 }}
                >
                  <ReasonSelect
                    data-test-id="reason-select"
                    queryOptions={filtersQuery}
                    setQueryFunction={setFiltersQuery}
                  />
                </Form.Item>
              );

            case "profiles":
              return (
                <Form.Item
                  data-test-id="form-item-default"
                  label={t(`table.${filter}`)}
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    mode="multiple"
                    data-test-id="select-default"
                    size="large"
                    style={{ width: "100%", height: "40px" }}
                    placeholder={t(`table.${filter}`)}
                    value={
                      filtersQuery[filter] && filtersQuery[filter].length >= 1
                        ? filtersQuery[filter]
                            .split("[")[1]
                            .split("]")[0]
                            .split(",")
                            .map((item: any) => Number(item))
                        : undefined
                    }
                    onChange={(value) => {
                      if (value.length === 0) {
                        setFiltersQuery((state: any) => ({
                          ...state,
                          [filter]: undefined,
                        }));
                        return;
                      }
                      setFiltersQuery((state: any) => ({
                        ...state,
                        [filter]: `[${value}]`,
                      }));
                    }}
                    allowClear
                    onClear={() => {
                      const filters = { ...filtersQuery };
                      delete filters[filter];
                      setFiltersQuery(filters);
                    }}
                    showSearch
                    options={
                      [...selectOptions[filter]]?.map((option: any) => {
                        if (option === "") {
                          return { value: "", label: "" };
                        }
                        return {
                          value: option?.value || option,
                          label: option?.label,
                        };
                      }) ?? []
                    }
                  />
                </Form.Item>
              );

            case "status":
              return (
                <Form.Item
                  data-test-id="form-item-status"
                  label={t(`table.${filter}`)}
                  name={filter}
                  style={{ marginBottom: 10 }}
                >
                  {!selectOptions[filter] ? (
                    <Select
                      data-test-id="select-status"
                      showSearch
                      size="large"
                      removeIcon={<>x</>}
                      style={{ width: "100%", height: "40px" }}
                      placeholder={t("table.status")}
                      onClear={() => {
                        const filters = { ...filtersQuery };
                        delete filters[filter];
                        setFiltersQuery(filters);
                      }}
                      allowClear
                      options={[
                        { value: "true", label: t("table.active") },
                        { value: "false", label: t("table.inactive") },
                      ]}
                      value={filtersQuery?.status ?? null}
                      onChange={(value) => {
                        setFiltersQuery((state: any) => ({
                          ...state,
                          status: value,
                        }));
                      }}
                    />
                  ) : (
                    <Select
                      data-test-id="select-status"
                      size="large"
                      style={{ width: "100%", height: "40px" }}
                      placeholder={t(`table.${filter}`)}
                      value={filtersQuery[filter] ?? null}
                      onChange={(value) => {
                        setFiltersQuery((state: any) => ({
                          ...state,
                          [filter]: value,
                        }));
                      }}
                      onClear={() => {
                        const filters = { ...filtersQuery };
                        delete filters[filter];
                        setFiltersQuery(filters);
                      }}
                      allowClear
                      options={
                        [...selectOptions[filter]]?.map((option: any) => {
                          if (option === "") {
                            return { value: "", label: "" };
                          }
                          return {
                            value: option?.value || option,
                            label:
                              option?.label || filter === "status"
                                ? option == "true"
                                  ? t("table.active")
                                  : option == "false"
                                  ? t("table.inactive")
                                  : t(`table.${option?.toLowerCase()}`)
                                : t(`table.${option?.toLowerCase()}`),
                          };
                        }) ?? []
                      }
                    />
                  )}
                </Form.Item>
              );

            case endDateKeyName:
              return;

            case "refund_reason":
              return (
                <Form.Item
                  data-test-id="form-item-default"
                  label={t(`table.${filter}`)}
                  name={filter}
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    data-test-id="select-default"
                    size="large"
                    style={{ width: "100%", height: "40px" }}
                    placeholder={t(`table.${filter}`)}
                    value={[filtersQuery[filter]] ?? null}
                    onChange={(value) => {
                      setFiltersQuery((state: any) => ({
                        ...state,
                        reason: value,
                      }));
                    }}
                    showSearch
                    onClear={() => {
                      const filters = { ...filtersQuery };
                      delete filters[filter];
                      setFiltersQuery(filters);
                    }}
                    allowClear
                    options={
                      [...selectOptions[filter]]?.map((option: any) => {
                        if (option === "") {
                          return { value: "", label: "" };
                        }
                        return {
                          value: option,
                          label: t(
                            `table.${option
                              ?.split(":")
                              ?.join("")
                              ?.split(" ")
                              ?.join("_")
                              ?.toLowerCase()}`
                          ),
                        };
                      }) ?? []
                    }
                  />
                </Form.Item>
              );

            default:
              return (
                <Form.Item
                  data-test-id="form-item-default"
                  label={t(`table.${filter}`)}
                  name={filter}
                  style={{ marginBottom: 10 }}
                >
                  <Select
                    data-test-id="select-default"
                    size="large"
                    style={{ width: "100%", height: "40px" }}
                    placeholder={t(`table.${filter}`)}
                    value={[filtersQuery[filter]] ?? null}
                    onChange={(value) => {
                      setFiltersQuery((state: any) => ({
                        ...state,
                        [filter]: value,
                      }));
                    }}
                    showSearch
                    filterOption={(input, option) => {
                      return (
                        `${option?.label}`
                          ?.toLowerCase()
                          ?.indexOf(input?.toLowerCase()) >= 0
                      );
                    }}
                    onClear={() => {
                      const filters = { ...filtersQuery };
                      delete filters[filter];
                      setFiltersQuery(filters);
                    }}
                    allowClear
                    options={
                      [...selectOptions[filter]]?.map((option: any) => {
                        if (option === "") {
                          return { value: "", label: "" };
                        }
                        return {
                          value: option?.value || option,
                          label: option?.label
                            ? option.label
                            : filter === "step"
                            ? t(`logs.${option?.toLowerCase()}`)
                            : Number(option) || option == 0
                            ? option
                            : filter === "status"
                            ? option == "true"
                              ? t("table.active")
                              : option == "false"
                              ? t("table.inactive")
                              : t(`table.${option?.toLowerCase()}`)
                            : t(`table.${option?.toLowerCase()}`),
                        };
                      }) ?? []
                    }
                  />
                </Form.Item>
              );
          }
        })}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button type="submit" ref={submitRef} style={{ display: "none" }}>
            Submit
          </button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
