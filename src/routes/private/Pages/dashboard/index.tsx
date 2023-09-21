import { Button, Col, Divider, Row } from "antd";
import React, { useState } from "react";
import { OrganizationBalance } from "./components/organizationBalance";
import { MerchantBalance } from "./components/merchantBalance";
import { useTranslation } from "react-i18next";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { FiltersModal } from "@src/components/FiltersModal";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { useListBanks } from "@src/services/bank/listBanks";
import { BankCard } from "./components/bankCard";
import { ValuesTable } from "./components/valuesTable";
import { ChartIn } from "./components/charts/chartIn";

export const Dashboard = () => {
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<any>({});
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  });

  return (
    <Row style={{ padding: 20 }}>
      {true && <OrganizationBalance />}
      {true && <MerchantBalance />}
      <Col span={24} style={{ marginTop: 40, padding: 15 }}>
        <Row gutter={[4, 4]} align="middle">
          <Row style={{ width: "100%", marginBottom: 16 }} gutter={[16, 16]}>
            {bankListData?.itens.find((bank) => bank.bank === "BTG") && (
              <BankCard
                bank={bankListData?.itens.find((bank) => bank.bank === "BTG")}
              />
            )}
            {bankListData?.itens.find((bank) => bank.bank === "FastCash") && (
              <BankCard
                bank={bankListData?.itens.find(
                  (bank) => bank.bank === "FastCash"
                )}
              />
            )}
            {bankListData?.itens.find(
              (bank) => bank.bank === "Mercado_Pago"
            ) && (
              <BankCard
                bank={bankListData?.itens.find(
                  (bank) => bank.bank === "Mercado_Pago"
                )}
              />
            )}
            {bankListData?.itens.find(
              (bank) => bank.label_name === "PixsBrasil"
            ) && (
              <BankCard
                bank={bankListData?.itens.find(
                  (bank) => bank.bank === "PixsBrasil"
                )}
              />
            )}
            {bankListData?.itens.find(
              (bank) => bank.label_name === "Genial"
            ) && (
              <BankCard
                bank={bankListData?.itens.find(
                  (bank) => bank.bank === "Genial"
                )}
              />
            )}
            {bankListData?.itens.find(
              (bank) => bank.label_name === "Bradesco"
            ) && (
              <BankCard
                bank={bankListData?.itens.find(
                  (bank) => bank.bank === "Bradesco"
                )}
              />
            )}
          </Row>

          <Col span={24}>
            <Divider />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <Button
              style={{ width: "100%", height: 40 }}
              type="primary"
              onClick={() => setIsFiltersOpen(true)}
            >
              {t("table.filters")}
            </Button>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 16 }}>
            <FilterChips
              startDateKeyName="start_date"
              endDateKeyName="end_date"
              query={query}
              setQuery={setQuery}
            />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            <Button
              type="dashed"
              danger
              onClick={() => {
                setQuery({});
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
          </Col>
          <Col span={24} style={{ marginTop: 16 }}>
            <ValuesTable />
          </Col>

          <Col span={24}>
            {" "}
            <ChartIn />
          </Col>
        </Row>
      </Col>

      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={[
            "start_date",
            "end_date",
            "status",
            "partner_id",
            "merchant_id",
          ]}
          refetch={() => {
            return "";
          }}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={{}}
        />
      )}
    </Row>
  );
};
