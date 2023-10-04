/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowUpOutlined, DollarOutlined, EyeFilled } from "@ant-design/icons";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { CustomTable } from "@src/components/CustomTable";
import { FiltersModal } from "@src/components/FiltersModal";
import { FilterChips } from "@src/components/FiltersModal/filterChips";
import { Button, Col, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const TransfersBetweenAccounts = () => {
  //   const { permissions } = queryClient.getQueryData(
  //     "validate"
  //   ) as ValidateInterface;
  const INITIAL_QUERY = {
    limit: 25,
    page: 1,
  };
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [
    ,
    // isViewModalOpen
    setIsViewModalOpen,
  ] = useState<boolean>(false);
  const [
    ,
    //isNewTransferModalOpen
    setIsNewtransferModalOpen,
  ] = useState<boolean>(false);
  const [
    ,
    //currentItem
    setCurrentItem,
  ] = useState<any>({});
  const [query, setQuery] = useState<any>(INITIAL_QUERY);
  const { t } = useTranslation();

  return (
    <Row style={{ padding: 25 }}>
      <Row gutter={[8, 8]} style={{ width: "100%", marginBottom: 16 }}>
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Button
            size="large"
            style={{ width: "100%" }}
            loading={false}
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
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
            loading={false}
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
        <Col xs={{ span: 24 }} md={{ span: 4 }}>
          <Button
            type="default"
            loading={false}
            onClick={() => {
              setIsNewtransferModalOpen(true);
            }}
            style={{
              height: 40,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpOutlined
              style={{ fontSize: 16, marginRight: -8, marginBottom: 12 }}
            />
            <DollarOutlined style={{ fontSize: 22 }} /> {t("table.transfer")}
          </Button>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            actions={[
              {
                label: "details",
                icon: <EyeFilled style={{ fontSize: "20px" }} />,
                onClick: () => {
                  setIsViewModalOpen(true);
                },
              },
            ]}
            data={{}}
            items={[]}
            error={false}
            columns={[
              { name: "id", type: "id", sort: true },
              { name: "origin_account", type: "text" },
              { name: "final_account", type: "text" },
              { name: "created_by", type: "text" },
              { name: "description", type: "text" },
              { name: "value", type: "value" },
              { name: "status", type: "status" },
              { name: "created_at", type: "date", sort: true },
            ]}
            loading={false}
            label={["name", "description"]}
          />
        </Col>
      </Row>
      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={["start_date", "end_date", "merchant_id", "value_start"]}
          refetch={() => {
            return "";
          }}
          selectOptions={{}}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Row>
  );
};
