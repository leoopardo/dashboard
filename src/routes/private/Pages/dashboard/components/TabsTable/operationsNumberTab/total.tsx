import { CustomTable } from "@src/components/CustomTable";
import { useGetMerchantRanking } from "@src/services/merchant/ranking/getRanking";
import { Empty } from "antd";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import { TableProps } from "..";

export const TotalOperations = ({ query, chart }: TableProps) => {
  const { RankingData, RankingError, isRankingFetching } =
    useGetMerchantRanking("operations", "total", query);
  const { t } = useTranslation();
  return !chart ? (
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
              legend: {textStyle: {
                color: "#a0a0a0",
              },},textStyle: {
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
                data: RankingData?.sort((a, b) => a.total > b.total ? -1 : 1)?.map((merchant) => merchant?.name ?? "-"),
              },
              series: [
                {
                  type: "bar",
                  data: RankingData?.map(
                    (merchant) => merchant?.total ?? 0
                  ).sort(() => -1),
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
      query={{}}
      setCurrentItem={() => {
        return;
      }}
      setQuery={() => {
        return;
      }}
      actions={[]}
      data={RankingData}
      items={RankingData?.sort((a, b) => a.total > b.total ? -1 : 1)}
      error={RankingError}
      columns={[
        { name: "name", type: "text" },
        { name: "total", type: "text" },
      ]}
      loading={isRankingFetching}
      label={["merchant", "value"]}
      removePagination
      disableScrollToTop
    />
  );
};
