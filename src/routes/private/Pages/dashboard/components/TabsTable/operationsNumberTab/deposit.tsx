import { CustomTable } from "@src/components/CustomTable";
import { useGetMerchantRanking } from "@src/services/merchant/ranking/getRanking";
import { Empty } from "antd";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import { useErrorContext } from "@src/contexts/ErrorContext";
import { TableProps } from "..";
import { useEffect } from "react";

export const DepositOperations = ({ query, chart }: TableProps) => {
  const { t } = useTranslation();
  const { handleChangeError } = useErrorContext();
  const { RankingData, RankingError, isRankingFetching, RankingDataSuccess } =
    useGetMerchantRanking("operations", "deposit", query);

  useEffect(() => {
    if (RankingDataSuccess) {
      handleChangeError({ rankingOperations: false });
    }

    if (RankingError) {
      handleChangeError({ rankingOperations: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RankingError, RankingDataSuccess]);

  return chart ? (
    <>
      {RankingData?.length ? (
        <div style={{ marginTop: "-60px" }}>
          <ReactECharts
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow",
                },
              },
              color: ["#91cc75"],
              legend: {
                textStyle: {
                  color: "#a0a0a0",
                },
              },
              textStyle: {
                color: "#a0a0a0",
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
              xAxis: {
                type: "value",
                boundaryGap: [0, 0.01],
              },
              yAxis: {
                type: "category",
                data: RankingData?.sort((a, b) =>
                  a.total > b.total ? 1 : -1
                )?.map((merchant) => merchant?.name ?? "-"),
              },
              series: [
                {
                  type: "bar",
                  data: RankingData?.sort((a, b) =>
                    a.total > b.total ? 1 : -1
                  )?.map((merchant) => merchant?.total ?? 0),
                },
              ],
            }}
            opts={{ renderer: "svg" }}
            lazyUpdate
            showLoading={isRankingFetching}
          />
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: "60px" }}
          description={t("error.400")}
        />
      )}
    </>
  ) : (
    <CustomTable
      size="small"
      query={{}}
      setCurrentItem={() => {
        return;
      }}
      setQuery={() => {
        return;
      }}
      actions={[]}
      removeValue
      data={RankingData}
      items={RankingData?.sort((a, b) => (a.total > b.total ? -1 : 1))}
      error={RankingError}
      columns={[
        { name: "name", type: "text" },
        { name: "total", type: "text" },
      ]}
      loading={isRankingFetching}
      label={["name", "total"]}
      removePagination
      disableScrollToTop
    />
  );
};
