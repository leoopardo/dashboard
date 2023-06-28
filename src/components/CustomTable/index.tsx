import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { CopyOutlined, EllipsisOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Empty,
  Input,
  Pagination,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Mobile } from "./mobile";
import { Grid } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

export interface ColumnInterface {
  name: string | any;
  head?: string;
  type:
    | "id"
    | "text"
    | "date"
    | "document"
    | "value"
    | "action"
    | "status"
    | "actions"
    | "icon"
    | "boolean";
}

export interface actionsInterface {
  label: string;
  icon?: any;
  onClick: () => void;
  disabled?: boolean;
}

interface TableProps {
  data: any;
  items: any;
  columns: ColumnInterface[];
  loading: boolean;
  query: any;
  error?: any;
  setQuery: Dispatch<SetStateAction<any>>;
  label?: string[];
  setCurrentItem: Dispatch<SetStateAction<any>>;
  removeTotal?: boolean;
  actions?: actionsInterface[];
}

export const CustomTable = (props: TableProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [columns, setColumns] = useState<ColumnsType<ColumnInterface>>([]);
  const translation = useTranslation().i18n.language;
  const [sortOrder, setSortOrder] = useState(false);
  const [actions, setActions] = useState<any>([]);
  const [current, setCurrent] = useState<any | null>(null)

  useEffect(() => {
    const act: any = [];

    if (props.actions && props.actions.length > 0) {
      for (const action of props.actions) {
        act.push({
          key: action.label,
          label: t(`actions.${action.label}`),
          icon: action.icon,
          onClick: action.onClick,
        });
      }
      setActions(act);
    }
  }, [isMobile]);

  useEffect(() => {
    if (
      props.actions &&
      props.actions.length > 0 &&
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
          case "id":
            return {
              title: (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head || column.name}`)}
                </p>
              ),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <div
                  key={column.name}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  <Input
                    size="large"
                    addonAfter={
                      <CopyToClipboard text={text}>
                        <Button
                          size="small"
                          type="ghost"
                          onClick={() => toast.success(t("table.copied"))}
                        >
                          <CopyOutlined />
                        </Button>
                      </CopyToClipboard>
                    }
                    style={{ maxWidth: "250px", textOverflow: "ellipsis" }}
                    value={text}
                    readOnly
                  />
                </div>
              ),
            };

          case "date":
            return {
              title: (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head || column.name}`)}
                </p>
              ),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) =>
                text ? (
                  <p
                    key={column.name}
                    style={{ width: "100%", textAlign: "center" }}
                  >{`${new Date(text).toLocaleDateString()} ${new Date(
                    text
                  ).toLocaleTimeString()}`}</p>
                ) : (
                  <p
                    key={column.name}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    -
                  </p>
                ),
            };

          case "value":
            return {
              title: (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column.name}`)}
                </p>
              ),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <p
                  key={column.name}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(text) || 0)}
                </p>
              ),
            };
          case "document":
            return {
              title: (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column.name}`)}
                </p>
              ),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <p
                  key={column.name}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  {text?.replace(
                    /(\d{3})(\d{3})(\d{3})(\d{2})/,
                    "$1.$2.$3-$4"
                  ) || "-"}
                </p>
              ),
            };
          case "icon":
            return {
              title: (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column.name}`)}
                </p>
              ),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Avatar src={text} size="large" shape="square" />
                </div>
              ),
            };

          case "status":
            return {
              title: (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column.name}`)}
                </p>
              ),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) =>
                typeof text === "boolean" ? (
                  <p
                    key={column.name}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {text ? t("table.active") : t("table.inactive")}
                  </p>
                ) : (
                  <p
                    key={column.name}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {t(`table.${text.toLocaleLowerCase()}`)}
                  </p>
                ),
            };

          case "boolean":
            return {
              title: (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column.name}`)}
                </p>
              ),
              key: column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <p
                  key={column.name}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  {text ? t("table.true") : t("table.false")}
                </p>
              ),
            };

          case "action":
            return {
              title: " ",
              key: column.name,
              dataIndex: column.name,
              render: (a: any, record: any) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Dropdown
                    key={column.name}
                    menu={{ items: actions }}
                    onOpenChange={(open) => {
                      if (open) {props.setCurrentItem(record)}
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
                </div>
              ),
            };
          case "text":
            return {
              title: (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head || column.name}`)}
                </p>
              ),
              key: Array.isArray(column.name)
                ? column.name + `${Math.random()}`
                : column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {text ?? "-"}
                </p>
              ),
            };
          default:
            return {
              title: (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column.name}`)}
                </p>
              ),
              key: column.name,
              dataIndex: column.name,
              render: (a: any, record: any) => (
                <p style={{ width: "100%", textAlign: "center" }}>
                  {record[column.name] ?? "-"}
                </p>
              ),
            };
        }
      })
    );
  }, [props.columns]);

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
            current: Number(props?.query?.page),
            pageSize: Number(props?.query?.limit),
            total: props.removeTotal
              ? props?.items?.length < props?.data?.limit
                ? props?.data?.limit * props?.data?.page
                : props?.data?.limit * props?.data?.page + 1
              : props?.data?.total,
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
      <Pagination
        current={Number(props?.data?.page)}
        pageSize={Number(props?.data?.limit)}
      />
    </Grid>
  );
};
