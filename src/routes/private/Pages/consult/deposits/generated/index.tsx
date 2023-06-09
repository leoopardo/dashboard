import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import {
  generatedDepositRowsItems,
  generatedDepositTotalQuery,
} from "../../../../../../services/types/generatedDeposits.interface";
import { useGetTotalGeneratedDeposits } from "../../../../../../services/generatedDeposits/getTotal";
import moment from "moment";
import { TotalizersCards } from "./components/TotalizersCards";
import { ButtonComponent } from "../../../../../../components/Button";
import { Alert } from "antd";
import { useGetRowsGeneratedDeposits } from "../../../../../../services/generatedDeposits/getRows";
import { CustomTable } from "../../../../../../components/CustomTable";
import { ViewModal } from "./components/ViewModal";

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

  const { depositsRows, depositsRowsError, isDepositsRowsFetching } =
    useGetRowsGeneratedDeposits(query);

  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();

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

  console.log(currentItem);
  

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
            loading={false}
            title="filtros"
            type="primary"
            onClick={() => console.log("filtros")}
          />
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
    </Grid>
  );
};
