import React, { useState } from "react";
import { Grid } from "@mui/material";
import useDebounce from "@src/utils/useDebounce";
import { Button, Descriptions, Input, Space } from "antd";
import { useTranslation } from "react-i18next";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import ReactInputMask from "react-input-mask";
import { useGetCheckCpf } from "@src/services/consult/persons/checkDocument";
import { useMediaQuery } from "react-responsive";

export const CheckDocument = () => {
  const [search, setSearch] = useState<string>("");

  const isMobile = useMediaQuery({ maxWidth: "750px" });

  const {
    CheckCpfData,
    CheckCpfDataError,
    isCheckCpfDataFetching,
    refetchCheckCpfData,
  } = useGetCheckCpf(search);

  const { t } = useTranslation();
  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={5} lg={5}>
          <Space.Compact block size="large">
            <ReactInputMask
              value={search}
              mask="999.999.999-99"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            >
              <Input size="large" placeholder={t("table.cpf") || ""} />
            </ReactInputMask>
            <Button
              type="primary"
              loading={isCheckCpfDataFetching}
              onClickCapture={() => {
                refetchCheckCpfData();
              }}
            >
              {t("buttons.check")}
            </Button>
          </Space.Compact>
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <Button
            type="dashed"
            loading={isCheckCpfDataFetching}
            danger
            onClick={() => {
              setSearch("");
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
          </Button>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: "25px" }}>
        <Grid item xs={12}>
          <Descriptions
            bordered
            style={{ margin: 0, padding: 0 }}
            column={isMobile ? 1 : 3}
          >
            {CheckCpfData &&
              Object.keys(CheckCpfData).map((key: string, index) => {
                switch (key) {
                  case "birth_date":
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {`${new Date(
                          CheckCpfData[key] ?? ""
                        ).toLocaleDateString("pt-BR", { timeZone: "UTC" })}`}
                      </Descriptions.Item>
                    );

                  case "cpf":
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {CheckCpfData[key]?.replace(
                          /(\d{3})(\d{3})(\d{3})(\d{2})/,
                          "$1.$2.$3-$4"
                        ) || "-"}
                      </Descriptions.Item>
                    );

                  case "black_list":
                    return (
                      <Descriptions.Item
                        key={key}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {CheckCpfData[key] ? t("table.true") : t("table.false")}
                      </Descriptions.Item>
                    );

                  default:
                    return (
                      <Descriptions.Item
                        key={index}
                        label={t(`table.${key}`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {(CheckCpfData as any)[key] ?? "-"}
                      </Descriptions.Item>
                    );
                }
              })}
          </Descriptions>
        </Grid>
      </Grid>
    </Grid>
  );
};
