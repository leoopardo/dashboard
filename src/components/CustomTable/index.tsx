import { DownOutlined, EllipsisOutlined, EyeFilled } from "@ant-design/icons";
import { Button, Dropdown, Pagination, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Mobile } from "./mobile";
import { Grid } from "@mui/material";

interface TableProps {
  data: any;
  items: any;
  columns: any;
  loading: boolean;
  query: any;
  setQuery: Dispatch<SetStateAction<any>>;
  disableActions?: boolean;
  label?: string[];
  setViewModalOpen?: Dispatch<SetStateAction<boolean>>;
  setCurrentItem: Dispatch<SetStateAction<any>>;
  removeTotal: boolean;
}

export const CustomTable = (props: TableProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const translation = useTranslation().i18n.language;
  const [sortOrder, setSortOrder] = useState(false);
  const [actions, setActions] = useState<any>([]);

  useEffect(() => {
    if (
      props.setViewModalOpen &&
      !actions.find((action: any) => action.key === "setView")
    ) {
      setActions((state: any) => [
        ...actions,
        {
          key: "setView",
          label: t("table.details"),
          icon: <EyeFilled style={{ fontSize: "18px" }} />,
          onClick: () => {
            if (props.setViewModalOpen) props?.setViewModalOpen(true);
          },
        },
      ]);
    }
  }, [isMobile]);
  useEffect(() => {
    if (
      !props.disableActions &&
      !props.columns.find((column: string) => column === "actions")
    ) {
      props.columns.push("actions");
    }
  }, [props.columns]);

  useEffect(() => {
    sortOrder
      ? props.setQuery((state: any) => ({ ...state, sort_order: "ASC" }))
      : props.setQuery((state: any) => ({ ...state, sort_order: "DESC" }));
  }, [sortOrder]);

  useEffect(() => {
    setColumns(
      props?.columns?.map((key: string) => {
        switch (key) {
          case "createdAt":
          case "delivered_at":
            return {
              title: t(`table.${key}`),
              key: key,
              dataIndex: key,

              render: (text: string) =>
                text ? (
                  <React.Fragment key={key}>{`${new Date(
                    text
                  ).toLocaleDateString()} ${new Date(
                    text
                  ).toLocaleTimeString()}`}</React.Fragment>
                ) : (
                  <React.Fragment key={key}>-</React.Fragment>
                ),
            };

          case "value":
            return {
              title: t(`table.${key}`),
              key: key,
              dataIndex: key,
              render: (text: string) => (
                <React.Fragment key={key}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(text) || 0)}
                </React.Fragment>
              ),
            };

          case "status":
            return {
              title: t(`table.${key}`),
              key: key,
              dataIndex: key,
              render: (text: string) => (
                <React.Fragment key={key}>
                  {t(`table.${text.toLocaleLowerCase()}`)}
                </React.Fragment>
              ),
            };

          case "actions":
            return {
              title: " ",
              key: key,
              dataIndex: key,
              render: (a: any, record: any) => (
                <Dropdown
                  key={key}
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
            return { title: t(`table.${key}`), key: key, dataIndex: key };
        }
      })
    );
  }, [props.columns, translation]);

  return !isMobile ? (
    <Grid container>
      <Grid item xs={12}>
        <Table
          pagination={{
            current: Number(props?.data?.page),
            pageSize: Number(props?.data?.limit),
            total: !props.removeTotal
              ? props?.data?.total
              : props?.data?.limit > props?.items?.length
              ? props?.items?.length
              : props?.data?.limit * props?.data?.page + 1,

            onChange: (page) =>
              props.setQuery((state: any) => ({ ...state, page })),
            pageSizeOptions: [10, 25, 50, 100],
            onShowSizeChange: (current, size) =>
              props.setQuery((state: any) => ({ ...state, limit: size })),
          }}
          dataSource={props?.items}
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
    <Mobile
      columns={props?.columns}
      items={props?.items}
      label={props?.label}
      actions={actions}
      setCurrentItem={props.setCurrentItem}
    />
  );
};
