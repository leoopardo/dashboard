import { DepositLogsItemById } from "@src/services/types/support/apiLogs/depositsError.interface";
import { Collapse, Descriptions, Drawer } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import ReactJson from "react-json-view";

interface LogsDetailsModalInterface {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: DepositLogsItemById | null | undefined;
}

export const LogDetailsModal = ({
  open,
  setOpen,
  data,
}: LogsDetailsModalInterface) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | string[]>(["1"]);

  const onChange = (key: string | string[]) => {
    setActive(key);
  };
  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      title={`Log: ${data?._id}`}
      bodyStyle={{ overflowX: "hidden", padding: 0 }}
    >
      <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
        {data &&
          Object.keys(data).map((key: string) => {
            if (typeof (data as any)[key] === ("object" || "array")) return;
            switch (key) {
              case "createdAt":
              case "updatedAt":
                return (
                  <Descriptions.Item
                    key={key}
                    label={t(`table.${key}`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {`${new Date(data[key]).toLocaleDateString()} ${new Date(
                      data[key]
                    ).toLocaleTimeString()}`}
                  </Descriptions.Item>
                );

              case "ip":
              case "_id":
              case "operator_id":
              case "aggregator_id":
              case "merchant_id":
              case "partner_id":
              case "organization_id":
                return;
              default:
                return (
                  <Descriptions.Item
                    key={key}
                    label={t(`table.${key}`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {(data as any)[key] ?? "-"}
                  </Descriptions.Item>
                );
            }
          })}
      </Descriptions>
      <Grid container>
        <Grid item xs={12}>
          <Collapse
            expandIconPosition="end"
            items={[
              {
                key: "1",
                label: "Payload",
                children: (
                  <Grid item>
                    <ReactJson
                      enableClipboard={false}
                      style={{
                        width: "100%",
                        wordBreak: "break-all",
                      }}
                      src={data?.payload ?? {}}
                      theme="ocean"
                      collapseStringsAfterLength={90}
                    />
                  </Grid>
                ),
              },
              typeof data?.response === "object"
                ? {
                    key: "1",
                    label: "Payload",
                    children: (
                      <Grid item>
                        <ReactJson
                          enableClipboard={false}
                          style={{
                            width: "100%",
                            wordBreak: "break-all",
                          }}
                          src={data?.payload ?? {}}
                          theme="ocean"
                          collapseStringsAfterLength={90}
                        />
                      </Grid>
                    ),
                  }
                : { },
            ]}
            onChange={onChange}
            activeKey={active}
            style={{ width: "100%" }}
          />
        </Grid>
      </Grid>
    </Drawer>
  );
};
