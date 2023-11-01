/* eslint-disable @typescript-eslint/no-explicit-any */
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Grid } from "@mui/material";
import { useGetCheckCpf } from "@src/services/consult/persons/checkDocument";
import { Button, Descriptions, Input, Space } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactInputMask from "react-input-mask";
import { useMediaQuery } from "react-responsive";
import { ViewModal } from "./components/ViewModal";

export const CheckDocument = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: "750px" });

  const {
    CheckCpfData,
    isCheckCpfDataFetching,
    refetchCheckCpfData,
    CheckCpfDataSuccess,
  } = useGetCheckCpf(search);

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
        {CheckCpfDataSuccess && (
          <Grid
            container
            item
            xs={12}
            justifyContent={"flex-end"}
            style={{ marginBottom: 10 }}
          >
            <Button onClick={() => setIsViewModalOpen(true)}>{t('table.details')}</Button>
          </Grid>
        )}
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
                        {CheckCpfData[key]
                          ? `${new Date(
                              CheckCpfData[key] ?? ""
                            ).toLocaleDateString("pt-BR", { timeZone: "UTC" })}`
                          : "-"}
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

      {isViewModalOpen && (
        <ViewModal
          modalName={`Blacklist: ${CheckCpfData?.cpf}`}
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
          cpf={CheckCpfData?.cpf}
        />
      )}
    </Grid>
  );
};
