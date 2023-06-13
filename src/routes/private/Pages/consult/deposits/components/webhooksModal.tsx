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
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { useGetDepositWebhooks } from "../../../../../../services/consult/generatedDeposits/getWebhooks";
import {
  WebhooksItem,
  WebhooksQuery,
} from "../../../../../../services/types/generatedDeposits.interface";
import { useGetDepositWebhooks2 } from "../../../../../../services/consult/generatedDeposits/getWebhooksSecondary";
import ReactJson from "react-json-view";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { defaultTheme } from "../../../../../../styles/defaultTheme";

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

  const { depositWebhooks, isDepositWebhooksFetching } = useGetDepositWebhooks(
    props.id,
    query
  );
  const { depositWebhooks2 } = useGetDepositWebhooks2(props.id, query2);
  const [currOption, setCurrOption] = useState<any>("1");

  useEffect(() => {
    setItems(
      currOption === "1"
        ? depositWebhooks?.items?.map((item: WebhooksItem) => {
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
        : depositWebhooks2?.items?.map((item: WebhooksItem) => {
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
                    {t(`table.${item?.status.toLowerCase()}`)}
                  </p>
                </>
              ),

              children: (
                <Grid>
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
  }, [currOption, props.id, depositWebhooks, depositWebhooks2]);

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
            {currOption === "1" ? (
              <Pagination
                current={Number(depositWebhooks?.page)}
                pageSize={Number(depositWebhooks?.limit)}
                total={Number(depositWebhooks?.total)}
                onChange={(page) => setQuery((state) => ({ ...state, page }))}
              />
            ) : (
              <Pagination
                current={Number(depositWebhooks2?.page)}
                pageSize={Number(depositWebhooks2?.limit)}
                total={Number(depositWebhooks2?.total)}
                onChange={(page) => setQuery2((state) => ({ ...state, page }))}
              />
            )}
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
              { label: t("table.secondary_logs"), value: "2" },
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
              {currOption === "1" ? (
                <Badge
                  showZero
                  style={{ marginLeft: 5, marginBottom: 2 }}
                  color="green"
                  count={depositWebhooks?.total_success}
                />
              ) : (
                <Badge
                  showZero
                  style={{ marginLeft: 5, marginBottom: 2 }}
                  color="green"
                  count={depositWebhooks2?.total_success || 0}
                />
              )}
            </Tag>
          </Grid>
          <Grid item xs={4}>
            <Tag
              color="error"
              icon={<CloseCircleFilled />}
              style={{ fontSize: "14px" }}
            >
              {t("table.error")}:
              {currOption === "1" ? (
                <Badge
                  style={{ marginLeft: 5, marginBottom: 2 }}
                  color="red"
                  count={depositWebhooks?.total_errors}
                  showZero
                />
              ) : (
                <Badge
                  showZero
                  style={{ marginLeft: 5, marginBottom: 2 }}
                  color="red"
                  count={depositWebhooks2?.total_errors || 0}
                />
              )}
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
        {isDepositWebhooksFetching && <Spin />}{" "}
        {depositWebhooks && <Grid xs={12}></Grid>}
      </Grid>
    </Drawer>
  );
};
