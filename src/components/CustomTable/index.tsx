/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BankOutlined,
  CopyOutlined,
  EllipsisOutlined,
  InfoCircleTwoTone,
  ReloadOutlined,
} from "@ant-design/icons";
import { Grid } from "@mui/material";
import { useListBanks } from "@src/services/bank/listBanks";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Avatar,
  Button,
  Dropdown,
  Empty,
  Modal,
  Pagination,
  Progress,
  Table,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Mobile } from "./mobile";

export interface ColumnInterface {
  name: string | any;
  head?: string;
  type:
    | "id"
    | "birth"
    | "text"
    | "translate"
    | "date"
    | "document"
    | "value"
    | "action"
    | "status"
    | "actions"
    | "icon"
    | "boolean"
    | "bankNameToIcon"
    | "progress"
    | "merchant_name"
    | "partner_name";
  sort?: boolean;
  key?: any;
  sort_name?: string;
}

export interface actionsInterface {
  label?: string;
  icon?: any;
  onClick?: (item?: any) => void;
  disabled?: (item?: any) => boolean;
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
  actions?: (actionsInterface | false)[];
  removePagination?: boolean;
  isConfirmOpen?: boolean;
  setIsConfirmOpen?: Dispatch<SetStateAction<boolean>>;
  itemToAction?: string | null;
  onConfirmAction?: () => void;
  disableScrollToTop?: boolean;
  checkbox?: boolean;
  setSelectedRows?: Dispatch<SetStateAction<any>>;
  selectedKeys?: any;
  refetch?: () => void;
  disableActions?: boolean;
  rowKey?: string;
}

export const CustomTable = (props: TableProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "900px" });
  const [columns, setColumns] = useState<ColumnsType<ColumnInterface>>([]);
  const [sortOrder] = useState(false);
  const [actions, setActions] = useState<any>([]);
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  });

  useEffect(() => {
    const act: any = [];
    if (props.actions && props.actions.length > 0) {
      for (const action of props.actions) {
        if (action)
          act.push({
            key: action?.label,
            label: t(`actions.${action?.label}`),
            icon: action?.icon,
            disabled: action?.disabled,
            onClick: action?.onClick,
          });
      }

      setActions(act);
    }
  }, [isMobile]);

  useEffect(() => {
    if (
      props.actions &&
      props.actions.length > 0 &&
      !props.columns.find((column) => column?.name === "actions")
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
    if (!props.disableScrollToTop) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [props.query.page]);

  const rowSelection = {
    onChange: (_selectedRowKeys: any, selectedRows: any) => {
      props.setSelectedRows ? props?.setSelectedRows(selectedRows) : undefined;
    },
  };

  useEffect(() => {
    setColumns(
      props?.columns?.map((column) => {
        switch (column.type) {
          case "id":
            return {
              title: (
                <Typography
                  style={{ width: "100%", textAlign: "center" }}
                  ref={column.key}
                >
                  {t(`table.${column?.head || column?.name}`)}
                </Typography>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              width: 60,
              render: (text: string) => (
                <Tooltip title={text}>
                  <CopyToClipboard text={text}>
                    <Button
                      size="large"
                      type="ghost"
                      onClick={() => toast.success(t("table.copied"))}
                    >
                      <CopyOutlined />
                    </Button>
                  </CopyToClipboard>
                </Tooltip>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "date":
            return {
              title: (
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    style={{
                      width: "100%",
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    }}
                    ref={column.key}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) =>
                text ? (
                  <Typography
                    key={column?.name}
                    style={{ width: "100%", textAlign: "center", minWidth: 50 }}
                  >{`${new Date(text).toLocaleDateString()} ${new Date(
                    text
                  ).toLocaleTimeString()}`}</Typography>
                ) : (
                  <Typography
                    key={column?.name}
                    style={{ width: "100%", textAlign: "center", minWidth: 50 }}
                  >
                    -
                  </Typography>
                ),

              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "value":
            return {
              title: (
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    ref={column.key}
                    style={{
                      width: "100%",
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography
                  key={column?.name}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(text) || 0)}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };
          case "document":
            return {
              title: (
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    ref={column.key}
                    style={{
                      width: "100%",
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography
                  key={column?.name}
                  style={{ width: "100%", textAlign: "center", minWidth: 50 }}
                >
                  {`${text}`?.replace(
                    /(\d{3})(\d{3})(\d{3})(\d{2})/,
                    "$1.$2.$3-$4"
                  ) || "-"}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };
          case "icon":
            return {
              title: (
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    ref={column.key}
                    style={{
                      width: "100%",
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Avatar src={text} size="large" shape="square" />
                </div>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "bankNameToIcon":
            return {
              title: (
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    ref={column.key}
                    style={{
                      width: "100%",
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                  {bankListData?.itens.find(
                    (bank) => bank?.label_name?.split(" ").join("_") === text
                  )?.icon_url ? (
                    <Tooltip placement="topLeft" title={text} arrow>
                      <Avatar
                        src={
                          bankListData?.itens.find(
                            (bank) =>
                              bank?.label_name?.split(" ").join("_") === text
                          )?.icon_url ?? null
                        }
                        size="large"
                        shape="square"
                      >
                        <BankOutlined />
                      </Avatar>
                    </Tooltip>
                  ) : text ? (
                    <Typography>{text}</Typography>
                  ) : (
                    <Typography style={{ minWidth: "30px" }}>-</Typography>
                  )}
                </div>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "status":
            return {
              title: (
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    ref={column.key}
                    style={{
                      width: "100%",
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: any) => {
                return {
                  children:
                    typeof text === "boolean" || text === 1 || text === 0 ? (
                      <Typography
                        key={column?.name}
                        style={{ width: "100%", textAlign: "center" }}
                      >
                        {text === true || text === 1
                          ? t("table.active")
                          : t("table.inactive")}
                      </Typography>
                    ) : (
                      <Typography
                        key={column?.name}
                        style={{
                          width: "100%",
                          textAlign: "center",
                          color: (defaultTheme.colors as any)[
                            text?.toLocaleLowerCase()
                          ],
                          fontWeight: 600,
                        }}
                      >
                        {text ? t(`table.${text?.toLocaleLowerCase()}`) : "-"}
                      </Typography>
                    ),
                };
              },
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "boolean":
            return {
              title: (
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    ref={column.key}
                    style={{
                      width: "100%",
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography
                  key={column?.name}
                  style={{ width: "100%", textAlign: "center", minWidth: 50 }}
                >
                  {text ? t("table.true") : t("table.false")}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "birth":
            return {
              title: (
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    ref={column.key}
                    style={{
                      width: "100%",
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? `${column?.name}-${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: any) =>
                text ? (
                  <Typography
                    key={column?.name}
                    style={{ width: "100%", textAlign: "center", minWidth: 80 }}
                  >
                    {`${new Date(text)?.toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })} `}
                  </Typography>
                ) : (
                  <Typography
                    key={column?.name}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    -
                  </Typography>
                ),

              sorter: column?.sort
                ? () => {
                    props?.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column.name[1]
                          : column?.name,
                      sort_order:
                        props?.query?.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "action":
            return {
              title: props.refetch ? (
                <Tooltip title={t("table.refetch_data")}>
                  <Button
                    type="link"
                    onClick={() => {
                      if (props?.refetch) props.refetch();
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <ReloadOutlined style={{ fontSize: "16px" }} />
                  </Button>
                </Tooltip>
              ) : (
                ""
              ),
              key: column?.name,
              dataIndex: column?.name,
              render: (_a: any, record: any) => (
                <div
                  style={{ width: "100%", textAlign: "center" }}
                  ref={column.key}
                >
                  <Dropdown
                    trigger={["click"]}
                    key={column?.name}
                    disabled={props.disableActions}
                    menu={{
                      items: actions.map((action: actionsInterface) => {
                        let disable = false;

                        if (action.disabled) {
                          disable = action.disabled(record);
                        }

                        return {
                          ...action,
                          disabled: disable,
                          onClick: () => {
                            if (action && action.onClick) {
                              action.onClick(record);
                            }
                          },
                        };
                      }),
                    }}
                    onOpenChange={(open) => {
                      if (open) {
                        props.setCurrentItem(record);
                      }
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
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    ref={column.key}
                    style={{
                      width: "100%",
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) =>
                text && text.length > 15 ? (
                  <Tooltip title={text}>
                    <Typography
                      style={{
                        width: "100%",
                        textAlign: "center",
                        minWidth: 50,
                      }}
                    >
                      {text
                        ? text.length > 15
                          ? `${`${text}`.substring(0, 15)}...`
                          : text
                        : "-"}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography
                    style={{
                      width: "100%",
                      textAlign: "center",
                      minWidth: 50,
                    }}
                  >
                    {text ?? "-"}
                  </Typography>
                ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "translate":
            return {
              title: (
                <Typography
                  style={{ width: "100%", textAlign: "center" }}
                  ref={column.key}
                >
                  {t(`table.${column?.head || column?.name}`)}
                </Typography>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {text ? t(`table.${text.toLocaleLowerCase()}`) : "-"}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "progress":
            return {
              title: (
                <Typography
                  style={{ width: "100%", textAlign: "center" }}
                  ref={column.key}
                >
                  {t(`table.${column?.head ?? column?.name}`)}
                </Typography>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: any, record: any) => (
                <Grid
                  container
                  style={{
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid item xs={record?.error_message ? 11 : 12}>
                    <Progress
                      type="line"
                      percent={text?.split("/")[0]}
                      size="small"
                      status={
                        record.status === "ERROR" ||
                        record.status === "CANCELED"
                          ? "exception"
                          : record.status === "COMPLETED"
                          ? "success"
                          : "active"
                      }
                    />
                  </Grid>
                  {record?.error_message && (
                    <Grid item xs={1}>
                      <Tooltip title={record?.error_message}>
                        <InfoCircleTwoTone
                          twoToneColor={defaultTheme.colors.error}
                          style={{ marginBottom: "8px" }}
                        />
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "merchant_name":
            return {
              title: (
                <Typography
                  style={{ width: "100%", textAlign: "center" }}
                  ref={column.key}
                >
                  {t(`table.${column?.head ?? column?.name}`)}
                </Typography>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (_a: any, record: any) => (
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {record["merchant_name"] || record["merchant_id"] || "-"}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "partner_name":
            return {
              title: (
                <Typography
                  style={{ width: "100%", textAlign: "center" }}
                  ref={column.key}
                >
                  {t(`table.${column?.head ?? column?.name}`)}
                </Typography>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (_a: any, record: any) => (
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {record["partner_name"] || record["partner_id"] || "-"}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };
          default:
            return {
              title: (
                <Typography
                  style={{ width: "100%", textAlign: "center" }}
                  ref={column.key}
                >
                  {t(`table.${column?.head ?? column?.name}`)}
                </Typography>
              ),
              key: column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (_a: any, record: any) => (
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {record[column?.name] ?? "-"}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field:
                        column?.sort_name ? column.sort_name : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };
        }
      })
    );
  }, [props.columns]);

  return (
    <>
      {!isMobile ? (
        <Grid container>
          <Grid item xs={12}>
            <Table
              size="middle"
              tableLayout="auto"
              locale={{
                emptyText: props.error ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Empty
                      style={{
                        padding: 15,
                        paddingBottom: 30,
                        maxWidth: "430px",
                      }}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <div>
                          <div>
                            {`${t("table.error")} ${
                              props?.error?.response?.status
                            }`}
                          </div>
                          {`${t(`error.${props?.error?.response?.status}`)}`}
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <Empty
                    style={{ padding: 15, paddingBottom: 30 }}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={t("messages.empty_table_data")}
                  />
                ),
              }}
              pagination={{
                current: Number(props?.query?.page ?? 1),
                pageSize: Number(props?.query?.limit ?? 25),
                showTotal: (total, range) => {
                  return props.removeTotal
                    ? `${range[0]} - ${range[1]}`
                    : `${range[0]} - ${range[1]} de ${total}`;
                },
                total: props.removeTotal
                  ? props?.items?.length < props?.data?.limit
                    ? props?.data?.limit * props?.data?.page
                    : props?.data?.limit * props?.data?.page + 1
                  : props?.data?.total,

                onChange: (page) => {
                  props.setQuery((state: any) => ({ ...state, page }));
                },
                pageSizeOptions: [10, 25, 50, 100],
                defaultPageSize: 25,
                onShowSizeChange: (_current, size) =>
                  props.setQuery((state: any) => ({ ...state, limit: size })),
                style: { display: props.removePagination ? "none" : undefined },
              }}
              sortDirections={["ascend", "descend"]}
              dataSource={props?.error ? [] : props?.items ? props.items : []}
              rowSelection={
                props?.checkbox
                  ? {
                      type: "checkbox",
                      selectedRowKeys: props.selectedKeys?.map(
                        (item: any) =>
                          item?.id ?? item?._id ?? Math.random() * 100
                      ),
                      ...rowSelection,
                    }
                  : undefined
              }
              direction="ltr"
              rowKey={props?.rowKey || "id"}
              columns={columns}
              loading={props.loading}
              showSorterTooltip={false}
              scroll={{ x: "none" }}
              sticky
              bordered
            />
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Grid item xs={12}>
            <Mobile
              columns={props?.columns}
              items={props?.items}
              label={props?.label}
              actions={actions}
              setCurrentItem={props.setCurrentItem}
              checkbox={props?.checkbox}
              setSelectedRows={props?.setSelectedRows}
              selectedKeys={props?.selectedKeys}
            />
          </Grid>
          {!props.removePagination && (
            <Pagination
              style={{ marginTop: 8 }}
              current={Number(props?.query?.page ?? 1)}
              pageSize={Number(props?.query?.limit ?? 25)}
              onChange={(page) => {
                props.setQuery((state: any) => ({ ...state, page }));
              }}
              showTotal={(total, range) => {
                return props.removeTotal
                  ? `${range[0]} - ${range[1]}`
                  : `${range[0]} - ${range[1]} de ${total}`;
              }}
              total={
                props.removeTotal
                  ? props?.items?.length < props?.data?.limit
                    ? props?.data?.limit * props?.data?.page
                    : props?.data?.limit * props?.data?.page + 1
                  : props?.data?.total
              }
            />
          )}
        </Grid>
      )}
      {props.isConfirmOpen && (
        <Modal
          title={t("messages.confirm_action_title", {
            action: t("messages.delete"),
          })}
          open={props.isConfirmOpen}
          onOk={() => {
            props.onConfirmAction && props.onConfirmAction();
            props.setIsConfirmOpen && props.setIsConfirmOpen(false);
          }}
          onCancel={() =>
            props.setIsConfirmOpen && props.setIsConfirmOpen(false)
          }
        >
          {t("messages.are_you_sure", {
            action: t("messages.delete"),
            itens: props.itemToAction,
          })}
        </Modal>
      )}
    </>
  );
};
