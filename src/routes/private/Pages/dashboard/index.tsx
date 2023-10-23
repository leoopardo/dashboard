import { InfoCircleOutlined } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { useListBanks } from "@src/services/bank/listBanks";
import { useGetMerchantBankStatementTotals } from "@src/services/consult/merchant/bankStatement/getTotals";
import { queryClient } from "@src/services/queryClient";
import { MerchantBankStatementTotalsQuery } from "@src/services/types/consult/merchant/bankStatement";
import { ValidateInterface } from "@src/services/types/validate.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Button,
  Col,
  Layout,
  Row,
  Tooltip,
  Tour,
  TourProps,
  Typography,
} from "antd";
import moment from "moment";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TabsTable } from "./components/TabsTable";
import { BankCard } from "./components/bankCard";
import { ChartIn } from "./components/charts/chartIn";
import { ChartOut } from "./components/charts/chartOut";
import { MerchantBalance } from "./components/merchantBalance";
import { MerchantsBalance } from "./components/merchantsBalance";
import { OrganizationBalance } from "./components/organizationBalance";
import { ValuesTable } from "./components/valuesTable";

const INITIAL_QUERY = {
  start_date: moment(new Date())
    .startOf("day")
    .add(3, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .add(3, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const Dashboard = () => {
  const { t } = useTranslation();
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [query, setQuery] =
    useState<MerchantBankStatementTotalsQuery>(INITIAL_QUERY);
  const [isTuorOpen, setIsTuorOpen] = useState<boolean>(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  });

  const { refetchMerchantBankStatementTotalsTotal } =
    useGetMerchantBankStatementTotals(query);

  // TUOR --------------------------------------
  const steps: TourProps["steps"] = [
    {
      title: "Painel.",
      description: "Aqui você encontra seus principais totalizadores.",
    },
  ];

  if (
    permissions?.report?.paybrokers?.balance?.report_paybrokers_balance_list
  ) {
    steps.splice(1, 0, {
      title: "Saldos da organização",
      description: (
        <Typography>
          Os principais saldos dispóniveis na sua organização.
          <Typography>
            <span style={{ color: defaultTheme.colors.info }}>
              Saldo transação:
            </span>
          </Typography>
          <Typography>
            <span style={{ color: defaultTheme.colors.error }}>
              Saldo pagamento:
            </span>
          </Typography>
          <Typography>
            <span style={{ color: defaultTheme.colors.pending }}>
              Saldo reservado:
            </span>
          </Typography>
        </Typography>
      ),
      target: () => ref1.current,
    });
  }

  if (permissions?.report?.merchant?.balance?.report_merchant_balance_list) {
    steps.splice(2, 0, {
      title: "Saldos da empresa",
      description: (
        <Typography>
          Os principais saldos dispóniveis na sua empresa.
          <Typography>
            <span style={{ color: defaultTheme.colors.info }}>
              Saldo transação:
            </span>
          </Typography>
          <Typography>
            <span style={{ color: defaultTheme.colors.error }}>
              Saldo pagamento:
            </span>
          </Typography>
          <Typography>
            <span style={{ color: defaultTheme.colors.pending }}>
              Saldo reservado:
            </span>
          </Typography>
        </Typography>
      ),
      target: () => ref2.current,
    });
  }

  if (permissions?.report?.merchant?.balance?.report_merchant_balance_list) {
    steps.splice(3, 0, {
      title: "Saldos bancários",
      description: (
        <Typography>
          <Typography>
            <span style={{ color: defaultTheme.colors.info }}>Total:</span>O
            valor total disponível naquele banco;
          </Typography>
          <Typography>
            <span style={{ color: defaultTheme.colors.error }}>
              Valor bloqueado:
            </span>
            O valor bloqueado (indisponível) naquele banco;
          </Typography>
          <Typography>
            <span style={{ color: defaultTheme.colors.pending }}>
              Data de pesquisa:
            </span>
            Pode estar marcada em amarelo caso aquela pesquisa tenha sido
            realizada a mais de 20 minutos.
          </Typography>
        </Typography>
      ),
      target: () => ref3.current,
    });
  }

  // TUOR --------------------------------------

  return (
    <Row style={{ padding: 20 }}>
      <Tour
        open={isTuorOpen}
        onClose={() => setIsTuorOpen(false)}
        steps={steps}
        animated
      />
      <Col span={24} ref={ref1}>
        {permissions?.report?.paybrokers?.balance
          ?.report_paybrokers_balance_list && <OrganizationBalance />}
      </Col>
      <Col span={24} ref={ref2}>
        {permissions?.report?.merchant?.balance
          ?.report_merchant_balance_list && <MerchantBalance />}
      </Col>

      <Col
        span={24}
        style={{
          marginTop:
            permissions?.report?.merchant?.balance
              ?.report_merchant_balance_list ||
            permissions?.report?.paybrokers?.balance
              ?.report_paybrokers_balance_list
              ? 40
              : 0,
          padding: 15,
        }}
      >
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <Tooltip title={t("buttons.help")}>
            <Button
              type="link"
              onClick={() => setIsTuorOpen((state) => !state)}
            >
              <InfoCircleOutlined />
            </Button>
          </Tooltip>
        </div>

        {permissions?.report?.paybrokers?.bank_balance?.menu && (
          <Row gutter={[8, 4]} align="middle" justify="center">
            <Row
              style={{
                width: "100%",
                marginBottom: 16,
                display: "flex",
                justifyContent: "center",
              }}
              gutter={[16, 16]}
              ref={ref3}
            >
              <>
                {bankListData?.itens.map((bank) => (
                  <BankCard bank={bank} key={bank.id} />
                ))}
              </>
            </Row>

            <Layout
              style={{
                width: "100%",
                marginLeft: "-40px",
                marginRight: "-40px",
                padding: 25,
              }}
            >
              <Row gutter={[4, 4]} align="middle">
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
                    haveInitialDate
                  />
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 4 }}>
                  <Button
                    type="dashed"
                    danger
                    onClick={() => {
                      setQuery(INITIAL_QUERY);
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
                <Col span={24} style={{ marginTop: 16, marginBottom: 16 }}>
                  <ValuesTable query={query} />
                </Col>
              </Row>
            </Layout>

            <Col span={24} style={{ paddingTop: "20px" }}>
              <Row gutter={[16, 16]}>
                <ChartIn query={query} />
                <ChartOut query={query} />
              </Row>
            </Col>
          </Row>
        )}

        <Row
          style={{
            marginTop: permissions?.report?.paybrokers?.bank_balance?.menu
              ? 16
              : -65,
          }}
        >
          <Layout
            style={{
              width: "100%",
              marginLeft: -50,
              marginRight: -50,
              marginTop: 25,
              padding: 25,
            }}
          >
            <MerchantsBalance />
          </Layout>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <TabsTable />
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
            "partner_id",
            "merchant_id",
            "aggregator_id",
            "operator_id",
            "type",
            "payment_type",
          ]}
          refetch={refetchMerchantBankStatementTotalsTotal}
          selectOptions={{
            type: ["deposit", "withdraw"],
            payment_type: ["pix"],
          }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
          haveInitialDate
        />
      )}
    </Row>
  );
};
