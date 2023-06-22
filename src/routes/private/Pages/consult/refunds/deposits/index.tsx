import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import moment from "moment";
import ReplayIcon from "@mui/icons-material/Replay";
import { TotalizersCards } from "./components/TotalizersCards";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { Alert, Button, Input, Select, Space } from "antd";
import {
  ColumnInterface,
  CustomTable,
} from "../../../../../../components/CustomTable";
import { ViewModal } from "../components/ViewModal";
import { EyeFilled, SearchOutlined } from "@ant-design/icons";
import { FiltersModal } from "../../../../../../components/FiltersModal";
import { useTranslation } from "react-i18next";
import useDebounce from "../../../../../../utils/useDebounce";
import { FilterChips } from "../../../../../../components/FiltersModal/filterChips";
import { useGetTotalRefundDeposits } from "../../../../../../services/consult/refundDeposits/getTotal";
import { refundDepositsQuery } from "../../../../../../services/types/consult/refunds/refundsDeposits.interface";
import { useGetRowsRefundDeposits } from "../../../../../../services/consult/refundDeposits/getRows";

const INITIAL_QUERY: refundDepositsQuery = {
  page: 1,
  limit: 25,
  start_date: moment(new Date())
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
  end_date: moment(new Date())
    .add(1, "day")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSS"),
};

export const RefundDeposits = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<refundDepositsQuery>(INITIAL_QUERY);
  const {
    refundDepositsTotal,
    refundDepositsTotalError,
    isRefundDepositsTotalFetching,
    refetchRefundDepositsTotal,
  } = useGetTotalRefundDeposits(query);

  const {
    refundDepositsRows,
    refundDepositsRowsError,
    isRefundDepositsRowsFetching,
    refetchRefundDepositsTotalRows,
  } = useGetRowsRefundDeposits(query);

  useEffect(() => {
    refetchRefundDepositsTotalRows();
  }, [query]);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [searchOption, setSearchOption] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const debounceSearch = useDebounce(search);

  const columns: ColumnInterface[] = [
    { name: "pix_id", type: "id" },
    { name: "endToEndId", type: "id" },
    { name: "merchant_name", type: "text" },
    { name: "value", type: "value" },
    { name: "createdAt", type: "date" },
    { name: "delivered_at", type: "date" },
    { name: "buyer_name", type: "text" },
    { name: "buyer_document", type: "document" },
    { name: "status", type: "status" },
  ];

  useEffect(() => {
    const q = { ...query };
    delete q.pix_id;
    delete q.endToEndId;
    delete q.txid;
    delete q.reference_id;
    delete q.buyer_document;
    delete q.payer_document;
    delete q.buyer_name;
    delete q.payer_name;

    if (debounceSearch && searchOption) {
      setQuery((state) => ({ ...q, [searchOption]: debounceSearch }));
    }
  }, [debounceSearch, searchOption]);

  return (
    <Grid container style={{ padding: "25px" }}>
      <Grid container>
        {refundDepositsTotalError ? (
          <Grid item xs={12} style={{ marginBottom: "10px" }}>
            <Alert
              message={refundDepositsTotalError?.message}
              type="error"
              closable
            />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>

      <TotalizersCards
        data={refundDepositsTotal}
        fetchData={refetchRefundDepositsTotal}
        loading={isRefundDepositsTotalFetching}
        query={query}
      />

      <Grid
        container
        style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
        spacing={1}
      >
        <Grid item xs={12} md={4} lg={2}>
          <Button
            style={{ width: "100%", height: 40 }}
            loading={
              isRefundDepositsRowsFetching || isRefundDepositsTotalFetching
            }
            type="primary"
            onClick={() => setIsFiltersOpen(true)}
          >
            {t("table.filters")}
          </Button>
        </Grid>
        <Grid item xs={12} md={8} lg={10}>
          <FilterChips
            startDateKeyName="start_date"
            endDateKeyName="end_date"
            query={query}
            setQuery={setQuery}
            haveInitialDate
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
              { value: "pix_id", label: t("table.pix_id") },
              { value: "endToEndId", label: t("table.endToEndId") },
              { value: "payer_document", label: t("table.payer_document") },
              { value: "buyer_document", label: t("table.buyer_document") },
              { value: "buyer_name", label: t("table.buyer_name") },
              { value: "payer_name", label: t("table.payer_name") },
              { value: "txid", label: t("table.txid") },
              { value: "reference_id", label: t("table.reference_id") },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Pesquisa"
              size="large"
              disabled={!searchOption}
              style={{ height: "40px", width: "100%" }}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button
              loading={isRefundDepositsRowsFetching}
              type="primary"
              onClick={() => refetchRefundDepositsTotalRows()}
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
            loading={isRefundDepositsRowsFetching}
            danger
            onClick={() => {
              setQuery(INITIAL_QUERY);
              setSearchOption(null);
              setSearch(null);
            }}
            style={{ height: 40, display: "flex", alignItems: "center" }}
          >
            <FilterAltOffOutlinedIcon style={{ marginRight: 10 }} />{" "}
            {t("table.clear_filters")}
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
            data={refundDepositsRows}
            items={refundDepositsRows?.items}
            columns={columns}
            loading={isRefundDepositsRowsFetching}
            actions={[
              // {
              //   label: "details",
              //   icon: <EyeFilled style={{ fontSize: "18px" }} />,
              //   onClick: () => setIsViewModalOpen(true),
              // },
              {
                label: "refund",
                icon: <ReplayIcon style={{ fontSize: "18px" }} />,
                onClick: () => setIsViewModalOpen(true),
                disabled: ["WAITING", "ERROR"].includes(currentItem?.status),
              },
            ]}
            removeTotal
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
          haveInitialDate
          filters={[
            "start_date",
            "end_date",
            "status",
            "partner_id",
            "merchant_id",
            "bank",
            "payer_bank",
            "state",
            "city",
            "gender",
            "age_start",
            "value_start",
          ]}
          refetch={refetchRefundDepositsTotalRows}
          selectOptions={{
            status: [
              "PAID",
              "REFUNDED",
              "EXPIRED",
              "CANCELED",
              "WAITING",
              "WAITING_REFUND",
            ],
            gender: ["MALE", "FEMALE", "OTHER"],
          }}
          startDateKeyName="start_date"
          endDateKeyName="end_date"
          initialQuery={INITIAL_QUERY}
        />
      )}
    </Grid>
  );
};
