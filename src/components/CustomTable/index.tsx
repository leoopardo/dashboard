/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BankOutlined,
  CopyOutlined,
  EllipsisOutlined,
  InfoCircleTwoTone,
} from "@ant-design/icons";
import { Grid } from "@mui/material";
import { useListBanks } from "@src/services/bank/listBanks";
import { defaultTheme } from "@src/styles/defaultTheme";
import {
  Avatar,
  Button,
  Dropdown,
  Empty,
  Input,
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
    | "progress";
  sort?: boolean;
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
  setSelectedRows?: Dispatch<SetStateAction<any[] | null>>;
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
    if (!props.disableScrollToTop) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [props.query]);

  const sanitazerData = (result: any) => {
    let helper;
    if (Array.isArray(result)) helper = result;
    else helper = [result];

    if (props?.checkbox) {
      const newObj = helper.map((item) => {
        return {
          ...item,
          key: item?.id || item?._id,
        };
      });

      return newObj;
    }

    const newObj = helper.map((item) => {
      return {
        ...item,
      };
    });

    return newObj;
  };

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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head || column.name}`)}
                </Typography>
              ),
              key: Array.isArray(column.name)
                ? column.name + `${Math.random()}`
                : column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <div
                  key={column.name}
                  style={{
                    width: "100%",

                    textAlign: "center",
                  }}
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
                    style={{
                      maxWidth: "250px",
                      textOverflow: "ellipsis",
                    }}
                    value={text}
                    readOnly
                  />
                </div>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head || column.name}`)}
                </Typography>
              ),
              key: Array.isArray(column.name)
                ? column.name + `${Math.random()}`
                : column.name,
              dataIndex: column.name,
              render: (text: string) =>
                text ? (
                  <Typography
                    key={column.name}
                    style={{ width: "100%", textAlign: "center" }}
                  >{`${new Date(text).toLocaleDateString()} ${new Date(
                    text
                  ).toLocaleTimeString()}`}</Typography>
                ) : (
                  <Typography
                    key={column.name}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    -
                  </Typography>
                ),

              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column.name}`)}
                </Typography>
              ),
              key: Array.isArray(column.name)
                ? column.name + `${Math.random()}`
                : column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <Typography
                  key={column.name}
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
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column.name}`)}
                </Typography>
              ),
              key: Array.isArray(column.name)
                ? column.name + `${Math.random()}`
                : column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <Typography
                  key={column.name}
                  style={{ width: "100%", textAlign: "center" }}
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
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column.name}`)}
                </Typography>
              ),
              key: Array.isArray(column.name)
                ? column.name + `${Math.random()}`
                : column.name,
              dataIndex: column.name,
              render: (text: string) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Avatar src={text} size="large" shape="square" />
                </div>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column?.name}`)}
                </Typography>
              ),
              key: Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <div style={{ width: "100%", textAlign: "center" }}>
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
                </div>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column?.name}`)}
                </Typography>
              ),
              key: Array.isArray(column?.name)
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
                        {t(`table.${text?.toLocaleLowerCase()}`)}
                      </Typography>
                    ),
                };
              },
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column?.name}`)}
                </Typography>
              ),
              key: Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography
                  key={column?.name}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  {text ? t("table.true") : t("table.false")}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      page: 1,
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "action":
            return {
              title: " ",
              key: column?.name,
              dataIndex: column?.name,
              render: (_a: any, record: any) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Dropdown
                    trigger={["click"]}
                    key={column?.name}
                    menu={{
                      items: actions.map((action: actionsInterface) => {
                        let disable = false;

                        if (action.disabled) {
                          action.disabled(record)
                            ? (disable = true)
                            : (disable = false);
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head || column.name}`)}
                </Typography>
              ),
              key: Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {text ?? "-"}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head || column.name}`)}
                </Typography>
              ),
              key: Array.isArray(column?.name)
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
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column?.name}`)}
                </Typography>
              ),
              key: Array.isArray(column?.name)
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
                      sort_field: column.name,
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
                <Typography style={{ width: "100%", textAlign: "center" }}>
                  {t(`table.${column?.head ?? column?.name}`)}
                </Typography>
              ),
              key: Array.isArray(column?.name)
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
                      sort_field: column.name,
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
              dataSource={
                !props?.items
                  ? []
                  : props.loading
                  ? []
                  : props?.error
                  ? []
                  : sanitazerData(props?.items) ?? []
              }
              rowSelection={
                props?.checkbox
                  ? {
                      type: "checkbox",
                      ...rowSelection,
                    }
                  : undefined
              }
              direction="ltr"
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
        <Grid container style={{ display: "flex", justifyContent: "center" }}>
          <Grid item xs={12}>
            <Mobile
              columns={props?.columns}
              items={props?.items}
              label={props?.label}
              actions={actions}
              setCurrentItem={props.setCurrentItem}
            />
          </Grid>
          {!props.removePagination && (
            <Pagination
              current={Number(props?.query?.page)}
              pageSize={Number(props?.query?.limit)}
              onChange={(page) => {
                props.setQuery((state: any) => ({ ...state, page }));
              }}
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
