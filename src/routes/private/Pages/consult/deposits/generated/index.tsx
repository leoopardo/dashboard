import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { generatedDepositTotalQuery } from "../../../../../../services/types/generatedDeposits.interface";
import { useGetTotalGeneratedDeposits } from "../../../../../../services/generatedDeposits/getTotal";
import moment from "moment";
import { TotalizersCards } from "./components/TotalizersCards";
import { ButtonComponent } from "../../../../../../components/Button";
import { Alert, Button, Input, Select, Space, DatePicker } from "antd";
import { useGetRowsGeneratedDeposits } from "../../../../../../services/generatedDeposits/getRows";
import { CustomTable } from "../../../../../../components/CustomTable";
import { ViewModal } from "./components/ViewModal";
import { SearchOutlined } from "@ant-design/icons";
import { FiltersModal } from "../../../../../../components/FiltersModal";
const { RangePicker } = DatePicker;

const INITIAL_QUERY: generatedDepositTotalQuery = {
  page: 1,
  limit: 25,
  initial_date: moment(new Date())
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  final_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const GeneratedDeposits = () => {
  const [query, setQuery] = useState<generatedDepositTotalQuery>(INITIAL_QUERY);
  const {
    depositsTotal,
    depositsTotalError,
    isDepositsTotalFetching,
    refetchDepositsTotal,
  } = useGetTotalGeneratedDeposits(query);

  const {
    depositsRows,
    depositsRowsError,
    isDepositsRowsFetching,
    refetchDepositsTotalRows,
  } = useGetRowsGeneratedDeposits(query);

  useEffect(() => {
    refetchDepositsTotal();
    refetchDepositsTotalRows();
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const columns = [
    "_id",
    "bank",
    "merchant_name",
    "value",
    "createdAt",
    "delivered_at",
    "buyer_name",
    "buyer_document",
    "status",
  ];

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid container>
        {depositsTotalError ? (
          <Grid item xs={12} style={{ marginBottom: "10px" }}>
            <Alert
              message={depositsTotalError?.message}
              type="error"
              closable
            />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>

      <TotalizersCards
        data={depositsTotal}
        fetchData={refetchDepositsTotal}
        loading={isDepositsTotalFetching}
        query={query}
      />

      <Grid container style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={4} lg={2}>
          <ButtonComponent
            loading={isDepositsRowsFetching || isDepositsTotalFetching}
            title="filtros"
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: "5px" }} spacing={1}>
        <Grid item xs={12} md={2} lg={2}>
          <Select
            style={{ width: "100%", height: "35px" }}
            size="large"
            onChange={(value) => setSearchOption(value)}
            value={searchOption}
            placeholder="Opções"
            options={[
              { value: "id", label: "ID" },
              { value: "endToEndId", label: "endToEndId" },
              { value: "payer_document", label: "Documento comprador" },
              { value: "buyer_document", label: "Documento pagador" },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={2} lg={4}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Pesquisa"
              size="large"
              disabled={!searchOption}
              style={{ height: "40px", width: "100%" }}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button
              loading={isDepositsRowsFetching}
              type="primary"
              onClick={() => refetchDepositsTotalRows()}
              style={{ height: "40px" }}
              disabled={typeof searchOption === "string" && !search}
            >
              <SearchOutlined />
            </Button>
          </Space.Compact>
        </Grid>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            type="dashed"
            loading={isDepositsRowsFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(null);
              setSearch(null);
              refetchDepositsTotalRows();
              refetchDepositsTotal();
            }}
            style={{ height: 40 }}
          >
            Limpar filtros
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={12}>
          {" "}
          <CustomTable
            query={query}
            setCurrentItem={setCurrentItem}
            setQuery={setQuery}
            data={depositsRows}
            items={depositsRows?.items}
            columns={columns}
            loading={isDepositsRowsFetching}
            setViewModalOpen={setIsViewModalOpen}
            label={[
              "bank",
              "merchant_name",
              "status",
              "createdAt",
              "delivered_at",
            ]}
          />
        </Grid>
      </Grid>
      {isViewModalOpen && (
        <ViewModal
          open={isViewModalOpen}
          setOpen={setIsViewModalOpen}
          id={currentItem?._id}
        />
      )}
      {isFiltersOpen && (
        <FiltersModal
          open={isFiltersOpen}
          setOpen={setIsFiltersOpen}
          query={query}
          setQuery={setQuery}
          filters={[
            "initial_date",
            "final_date",
            "status",
            "partner_id",
            "merchant_id",
          ]}
          refetch={refetchDepositsTotalRows}
          selectOptions={{
            status: [
              "PAID",
              "REFUND",
              "EXPIRED",
              "CANCELED",
              "WAITING",
              "WAITING_REFUND",
            ],
          }}
          startDateKeyName="initial_date"
          endDateKeyName="final_date"
        />
      )}
    </Grid>
  );
};
