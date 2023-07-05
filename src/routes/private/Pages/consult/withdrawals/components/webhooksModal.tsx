import {
  Badge,
  Collapse,
  CollapseProps,
  Drawer,
  Pagination,
  Segmented,
  Spin,
  Tag,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import {
  WebhooksItem,
  WebhooksQuery,
} from "../../../../../../services/types/consult/deposits/generatedDeposits.interface";
import ReactJson from "react-json-view";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { defaultTheme } from "../../../../../../styles/defaultTheme";
import { useGetWithdrawalsWebhooks } from "@src/services/consult/withdrawals/generatedWithdrawals/getWebhooks";
interface webhooksModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  id: string;
}

const INITIAL_QUERY: WebhooksQuery = {
  page: 1,
  limit: 10,
};

export const WebhookModal = (props: webhooksModalProps) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | string[]>(["1"]);
  const [query, setQuery] = useState<WebhooksQuery>(INITIAL_QUERY);
  const [query2, setQuery2] = useState<WebhooksQuery>(INITIAL_QUERY);
  const [items, setItems] = useState<CollapseProps["items"]>([]);

  const onClose = () => {
    props.setOpen(false);
  };

  const { withdrawalsWebhooks, isWithdrawalsWebhooksFetching } =
    useGetWithdrawalsWebhooks(props.id, query);

  const [currOption, setCurrOption] = useState<any>("1");

  useEffect(() => {
    setItems(
      withdrawalsWebhooks?.items?.map((item: WebhooksItem) => {
        return {
          key: item.id,
          label: (
            <>
              {new Date(item.date).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })}{" "}
              {new Date(item.date).toLocaleTimeString("pt-BR", {
                timeZone: "UTC",
              })}
              <p
                style={{
                  color:
                    item.status === "SUCCESS"
                      ? defaultTheme.colors.success
                      : defaultTheme.colors.error,
                  fontWeight: 600,
                }}
              >
                {t("table.status")}:{" "}
                {t(`table.${item.status.toLocaleLowerCase()}`)}
              </p>
            </>
          ),
          style: { padding: 0 },
          children: (
            <Grid item>
              <ReactJson
                enableClipboard={false}
                style={{
                  width: "100%",
                  wordBreak: "break-all",
                }}
                src={item}
                theme="ocean"
                collapseStringsAfterLength={90}
              />
            </Grid>
          ),
        };
      })
    );
  }, [currOption, props.id, withdrawalsWebhooks]);

  const onChange = (key: string | string[]) => {
    setActive(key);
  };

  return (
    <Drawer
      title={`${t("actions.logs_webhooks")}. ID: (${props?.id || "-"})`}
      placement="right"
      onClose={onClose}
      open={props.open}
      bodyStyle={{ padding: 0 }}
      footer={
        <Grid container>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Pagination
              current={Number(withdrawalsWebhooks?.page)}
              pageSize={Number(withdrawalsWebhooks?.limit)}
              total={Number(withdrawalsWebhooks?.total)}
              onChange={(page) => setQuery((state) => ({ ...state, page }))}
            />
          </Grid>
        </Grid>
      }
    >
      <Grid container>
        <Grid item xs={12}>
          <Segmented
            block
            size="middle"
            style={{ width: "100%" }}
            value={currOption}
            options={[
              { label: t("table.primary_logs"), value: "1" },
       
            ]}
            onChange={(value) => {
              setCurrOption(value);
            }}
          />
        </Grid>
        <Grid container item xs={12} spacing={1} style={{ marginTop: "10px" }}>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <Tag
              color="success"
              icon={<CheckCircleFilled />}
              style={{ fontSize: "14px" }}
            >
              {t("table.success")}:
              <Badge
                showZero
                style={{ marginLeft: 5, marginBottom: 2 }}
                color="green"
                count={withdrawalsWebhooks?.total_success}
              />
            </Tag>
          </Grid>
          <Grid item xs={4}>
            <Tag
              color="error"
              icon={<CloseCircleFilled />}
              style={{ fontSize: "14px" }}
            >
              {t("table.error")}:
              <Badge
                style={{ marginLeft: 5, marginBottom: 2 }}
                color="red"
                count={withdrawalsWebhooks?.total_errors}
                showZero
              />
            </Tag>
          </Grid>

          <Grid item xs={12}>
            <Collapse
              expandIconPosition="end"
              items={items}
              onChange={onChange}
              activeKey={active}
              style={{ width: "100%" }}
            />
          </Grid>
        </Grid>
        {isWithdrawalsWebhooksFetching && <Spin />}{" "}
        {withdrawalsWebhooks && <Grid xs={12}></Grid>}
      </Grid>
    </Drawer>
  );
};
