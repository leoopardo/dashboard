import {
  DownOutlined,
  EllipsisOutlined,
  EyeFilled,
  SettingFilled,
} from "@ant-design/icons";
import ReplayIcon from "@mui/icons-material/Replay";
import { Button, Dropdown, Empty, Pagination, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Mobile } from "./mobile";
import { Grid } from "@mui/material";

export interface ColumnInterface {
  name: string;
  type: "text" | "date" | "document" | "value" | "action" | "status";
}

interface TableProps {
  data: any;
  items: any;
  columns: ColumnInterface[];
  loading: boolean;
  query: any;
  error?: any;
  setQuery: Dispatch<SetStateAction<any>>;
  disableActions?: boolean;
  label?: string[];
  setViewModalOpen?: Dispatch<SetStateAction<boolean>>;
  setWebhookModalOpen?: Dispatch<SetStateAction<boolean>>;
  setRefundOpen?: Dispatch<SetStateAction<boolean>> | null;
  setPaidToMerchantOpen?: Dispatch<SetStateAction<boolean>>;
  setCurrentItem: Dispatch<SetStateAction<any>>;
  removeTotal?: boolean;
}

export const CustomTable = (props: TableProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const translation = useTranslation().i18n.language;
  const [sortOrder, setSortOrder] = useState(false);
  const [actions, setActions] = useState<any>([]);

  useEffect(() => {
    const act: any = [];
    if (
      props.setViewModalOpen &&
      !act.find((action: any) => action.key === "setView")
    ) {
      act.push({
        key: "setView",
        label: t("actions.details"),
        icon: <EyeFilled style={{ fontSize: "18px" }} />,
        onClick: () => {
          if (props.setViewModalOpen) props?.setViewModalOpen(true);
        },
      });
    }
    if (
      props.setWebhookModalOpen &&
      !act.find((action: any) => action.key === "setWebhook")
    ) {
      act.push({
        key: "setWebhook",
        label: t("actions.logs_webhooks"),
        icon: <SettingFilled style={{ fontSize: "18px" }} />,
        onClick: () => {
          if (props.setWebhookModalOpen) props?.setWebhookModalOpen(true);
        },
      });
    }
    if (
      props.setRefundOpen &&
      !act.find((action: any) => action.key === "setRefund")
    ) {
      act.push({
        key: "setRefund",
        label: t("actions.refund"),
        icon: <ReplayIcon style={{ fontSize: "18px" }} />,
        onClick: () => {
          if (props.setRefundOpen) props?.setRefundOpen(true);
        },
      });
    }
    setActions(act);
  }, [isMobile]);

  useEffect(() => {
    if (
      !props.disableActions &&
      !props.columns.find((column) => column.name === "actions")
    ) {
      props.columns.push({ name: "actions", type: "action" });
    }
  }, [props.columns]);

  useEffect(() => {
    sortOrder
      ? props.setQuery((state: any) => ({ ...state, sort_order: "ASC" }))
      : props.setQuery((state: any) => ({ ...state, sort_order: "DESC" }));
  }, [sortOrder]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [props.query]);

  useEffect(() => {
    setColumns(
      props?.columns?.map((column) => {
        switch (column.type) {
          case "date":
            return {
              title: t(`table.${column.name}`),
              key: column.name,
              dataIndex: column.name,

              render: (text: string) =>
                text ? (
                  <React.Fragment key={column.name}>{`${new Date(
                    text
                  ).toLocaleDateString()} ${new Date(
                    text
                  ).toLocaleTimeString()}`}</React.Fragment>
                ) : (
                  <React.Fragment key={column.name}>-</React.Fragment>
                ),
            };

          case "value":
            return {
              title: t(`table.${column.name}`),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <React.Fragment key={column.name}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(text) || 0)}
                </React.Fragment>
              ),
            };
          case "document":
            return {
              title: t(`table.${column.name}`),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <React.Fragment key={column.name}>
                  {text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
                </React.Fragment>
              ),
            };

          case "status":
            return {
              title: t(`table.${column.name}`),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <React.Fragment key={column.name}>
                  {t(`table.${text.toLocaleLowerCase()}`)}
                </React.Fragment>
              ),
            };

          case "action":
            return {
              title: " ",
              key: column.name,
              dataIndex: column.name,
              render: (a: any, record: any) => (
                <Dropdown
                  key={column.name}
                  menu={{ items: actions }}
                  onOpenChange={(open) => {
                    if (open) props.setCurrentItem(record);
                  }}
                  arrow
                >
                  <Button
                    onClick={() => {
                      props.setCurrentItem(record);
                    }}
                  >
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              ),
            };
          default:
            return {
              title: t(`table.${column.name}`),
              key: column.name,
              dataIndex: column.name,
            };
        }
      })
    );
  }, [props.columns, translation]);

  return !isMobile ? (
    <Grid container>
      <Grid item xs={12}>
        <Table
          locale={{
            emptyText: props.error ? (
              <Empty
                style={{ padding: 15, paddingBottom: 30 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={`${t("table.error")} ${
                  props.error.response.status
                } - ${t(`error.${props.error.response.status}`)}`}
              />
            ) : (
              <Empty
                style={{ padding: 15, paddingBottom: 30 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("messages.empty_table_data")}
              />
            ),
          }}
          pagination={{
            current: Number(props?.data?.page),
            pageSize: Number(props?.data?.limit),
            total: !props.removeTotal
              ? props?.data?.total
              : props?.data?.limit > props?.items?.length
              ? props?.items?.length
              : props?.data?.limit * props?.data?.page + 1,

            onChange: (page) => {
              props.setQuery((state: any) => ({ ...state, page }));
            },
            pageSizeOptions: [10, 25, 50, 100],
            onShowSizeChange: (current, size) =>
              props.setQuery((state: any) => ({ ...state, limit: size })),
          }}
          dataSource={props.error ? [] : props?.items}
          direction="ltr"
          columns={columns}
          loading={props.loading}
          scroll={{ x: 800 }}
          sticky
          bordered
        />
      </Grid>
    </Grid>
  ) : (
    <Grid container>
      <Grid item xs={12}>
        <Mobile
          columns={props?.columns}
          items={props?.items}
          label={props?.label}
          actions={actions}
          setCurrentItem={props.setCurrentItem}
        />
      </Grid>
    </Grid>
  );
};
