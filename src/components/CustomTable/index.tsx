/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BankOutlined,
  CopyOutlined,
  EllipsisOutlined,
  InfoCircleTwoTone,
  ReloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import CachedIcon from "@mui/icons-material/Cached";
import { useListBanks } from "@src/services/bank/listBanks";
import { defaultTheme } from "@src/styles/defaultTheme";
import { ErrorList } from "@src/utils/errors";
import { formatCPF } from "@src/utils/functions";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Empty,
  Modal,
  Pagination,
  Progress,
  Row,
  Table,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType, TableProps as TablePropsAntD } from "antd/es/table";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Mobile } from "./mobile";
import moment from "moment";

export interface ColumnInterface {
  name: string | any; // (nome da coluna caso não passe head) e chave do objeto a ser acessado nos items
  head?: string; // nome da coluna (opcional) caso não seja passado, será usado o name
  type:
    | "id" // exibe um botão de copiar contendo o id em um tooltip
    | "showId" //exibe o id junto a um botão de copiar
    | "cpf" // Não usar esse type, usar document
    | "birth" // exibe formatação para data de nascimento (dd/mm/yyyy)
    | "text" // exibe texto
    | "translate" // exibe texto traduzido
    | "pix_type" // exibe tipo de pix (FastPix ou Regular)
    | "date" // exibe data   
    | "small_date" // exibe data com no maximo 80px de largura
    | "document" // exibe documento formatado para CPF
    | "value" // exibe valor formatado para moeda R$
    | "action" // exibe botões de ação
    | "status" // exibe status (ativo ou inativo ou status de transação)
    | "actions"
    | "icon" // exibe ícone de banco caso seja url
    | "boolean" // exibe booleano (sim e não)
    | "bankNameToIcon" // exibe ícone de banco caso seja o nome do banco
    | "progress" // exibe barra de progresso
    | "merchant_name" // exibe nome da empresa caso seja um obj
    | "partner_name" // exibe nome da plataforma caso seja um obj
    | "";
  sort?: boolean; // habilita ordenação
  key?: any;
  sort_name?: string; //nome do campo para ordenação
}

export interface actionsInterface {
  label?: string; // label da ação
  icon?: any; // ícone da ação
  id?: string; // id da ação
  onClick?: (item?: any) => void; // função a ser executada ao clicar na ação
  disabled?: (item?: any) => boolean; // função que retorna se a ação está desabilitada
}

interface TableProps {
  data: any; // dados da tabela pode conter dados da paginação;
  items: any; // itens da tabela. array contendo somente os itens a ser mapeados
  columns: ColumnInterface[]; // colunas da tabela
  loading: boolean; // define se a tabela está carregando
  query: any; // váriavel contendo os parâmetros de busca para a chamada que mapeia a tabela
  error?: any; // erro da chamada que mapeia a tabela
  removeValue?: boolean; //remove o valor total da tabela caso mobile
  setQuery: Dispatch<SetStateAction<any>>; // função para setar os parâmetros de busca
  label?: string[]; // valores que aparecerão nos accordeons da tabela mobile
  setCurrentItem: Dispatch<SetStateAction<any>>; // função para setar o item atual, ou seja, o que o usuário clicou no botão de ações
  removeTotal?: boolean; // remove a contagem total de registros da tabela
  actions?: (actionsInterface | false)[]; // array de objetos contendo as ações que aparecerão na tabela
  removePagination?: boolean; // remove a paginação da tabela
  isConfirmOpen?: boolean; // define se o modal de confirmação está aberto
  setIsConfirmOpen?: Dispatch<SetStateAction<boolean>>; // função para setar o modal de confirmação
  itemToAction?: string | null; // item que será afetado pela ação de confirmação
  onConfirmAction?: () => void; // função que será executada ao confirmar a ação
  disableScrollToTop?: boolean; // desabilita o scroll para o topo da página
  checkbox?: boolean; // habilita a seleção de linhas
  setSelectedRows?: Dispatch<SetStateAction<any>>; // função para setar as linhas selecionadas
  selectedKeys?: any; // chaves das linhas selecionadas
  refetch?: () => void; // função para rebuscar dos dados
  disableActions?: boolean; // desabilita as ações
  rowKey?: string;
  size?: "large" | "middle" | "small"; // tamanho da tabela
  bankStatement?: boolean; // define se a tabela é de extrato bancário
}

export const CustomTable = (props: TableProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: "950px" });
  const [columns, setColumns] = useState<ColumnsType<ColumnInterface>>([]);
  const [sortOrder] = useState(false);
  const [sorterObj, setSorterObj] = useState<any | undefined>();
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  });

  const actions = useMemo(() => {
    const act: any = [];
    if (props.actions && props.actions.length > 0) {
      for (const action of props.actions) {
        if (action)
          act.push({
            id: action?.id,
            key: action?.label,
            label: t(`actions.${action?.label}`),
            icon: action?.icon,
            disabled: action?.disabled,
            onClick: action?.onClick,
          });
      }
    }
    return act;
  }, [isMobile, t]);

  const rowSelection = {
    onChange: (_selectedRowKeys: any, selectedRows: any) => {
      props.setSelectedRows ? props?.setSelectedRows(selectedRows) : undefined;
    },
  };

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

  useEffect(() => {
    setColumns(
      props?.columns?.map((column) => {
        switch (column.type) {
          case "id":
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title={text}>
                    <Button
                      size="large"
                      type="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(text);
                        toast.success(t("table.copied"));
                      }}
                    >
                      <CopyOutlined
                        style={{ color: defaultTheme.colors.info }}
                      />
                    </Button>
                  </Tooltip>
                </div>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "showId":
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              width: 85,
              dataIndex: column?.name,
              render: (text: string) => (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title={text}>
                    <Button
                      size="large"
                      type="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(text);
                        toast.success(t("table.copied"));
                      }}
                    >
                      <CopyOutlined
                        style={{ color: defaultTheme.colors.info }}
                      />
                    </Button>
                  </Tooltip>
                </div>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "cpf":
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography.Text copyable>
                    {text ? <>{formatCPF(text)}</> : "-"}
                  </Typography.Text>
                </div>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
                        maxHeight: "50px",
                        overflow: "hidden",
                        textAlign: "center",
                        textOverflow: "ellipsis",
                        wordBreak: "keep-all",
                      }}
                      ref={column.key}
                    >
                      {t(`table.${column?.head || column?.name}`)}
                    </Typography>
                  </Tooltip>
                ),
                key: column?.sort_name
                  ? column.sort_name
                  : Array.isArray(column?.name)
                  ? column?.name + `${Math.random()}`
                  : column?.name,
                dataIndex: column?.name,
                render: (text: string, record: any) => {
                  if (column.name === "delivered_at" && record?.paid_at) {
                    return text ? (
                      <Tooltip
                        title={`Tempo de entrega: ${
                          record?.paid_at &&
                          moment
                            .duration(
                              moment(new Date(text)).diff(
                                moment(new Date(record?.paid_at))
                              )
                            )
                            .asMinutes()
                            .toFixed(2)
                        } minutos`}
                      >
                        <Typography
                          key={column?.name}
                          style={{
                            width: "100%",
                            textAlign: "center",
                            display: "flex",
                            minWidth: 50,
                            wordBreak: "keep-all",
                            color:
                              record?.paid_at &&
                              +moment
                                .duration(
                                  moment(new Date(text)).diff(
                                    moment(new Date(record?.paid_at))
                                  )
                                )
                                .asMinutes()
                                .toFixed(2) >= 1
                                ? defaultTheme.colors.error
                                : defaultTheme.colors.success,
                          }}
                        >{`${new Date(
                          `${text.split("Z")[0]}Z`
                        ).toLocaleDateString()} ${new Date(
                          `${text.split("Z")[0]}Z`
                        ).toLocaleTimeString()}`}</Typography>
                        {+moment
                          .duration(
                            moment(new Date(text)).diff(
                              moment(new Date(record?.paid_at))
                            )
                          )
                          .asMinutes()
                          .toFixed(2) >= 1 && (
                          <WarningOutlined
                            style={{
                              marginLeft: "40%",
                              color: defaultTheme.colors.error,
                            }}
                          />
                        )}
                      </Tooltip>
                    ) : (
                      <Typography
                        key={column?.name}
                        style={{
                          width: "100%",
                          textAlign: "center",
                          minWidth: 50,
                        }}
                      >
                        -
                      </Typography>
                    );
                  }
                  return text ? (
                    <Typography
                      key={column?.name}
                      style={{
                        width: "100%",
                        textAlign: "center",
                        minWidth: 50,
                        wordBreak: "keep-all",
                      }}
                    >{`${new Date(
                      `${text.split("Z")[0]}Z`
                    ).toLocaleDateString()} ${new Date(
                      `${text.split("Z")[0]}Z`
                    ).toLocaleTimeString()}`}</Typography>
                  ) : (
                    <Typography
                      key={column?.name}
                      style={{ width: "100%", textAlign: "center", minWidth: 50 }}
                    >
                      -
                    </Typography>
                  );
                },
  
                sorter: column.sort
                  ? () => {
                      props.setQuery((state: any) => ({
                        ...state,
                        sort_field: column?.sort_name
                          ? column.sort_name
                          : Array.isArray(column?.name)
                          ? column?.name[1]
                          : column?.name,
                        sort_order:
                          props.query.sort_order === "DESC" ? "ASC" : "DESC",
                      }));
  
                      return 0;
                    }
                  : undefined,
              };
  

          case "small_date":
            return {
              title: (
                <Tooltip title={t(`table.${column?.head || column?.name}`)}>
                  <Typography
                    style={{
                      maxHeight: "50px",
                      overflow: "hidden",
                      textAlign: "center",
                      textOverflow: "ellipsis",
                      wordBreak: "keep-all",
                    }}
                    ref={column.key}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              width: 80,
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => {
                return text ? (
                  <Typography
                    key={column?.name}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      minWidth: 50,
                      wordBreak: "keep-all",
                    }}
                  >{`${new Date(
                    `${text.split("Z")[0]}Z`
                  ).toLocaleDateString()} ${new Date(
                    `${text.split("Z")[0]}Z`
                  ).toLocaleTimeString()}`}</Typography>
                ) : (
                  <Typography
                    key={column?.name}
                    style={{ width: "100%", textAlign: "center", minWidth: 50 }}
                  >
                    -
                  </Typography>
                );
              },

              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography
                  key={column?.name}
                  style={{ width: "100%", textAlign: "center", minWidth: 80 }}
                >
                  {moneyFormatter(Number(text) || 0)}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography.Text
                  copyable={{
                    icon: (
                      <CopyOutlined
                        style={{ color: defaultTheme.colors.info }}
                      />
                    ),
                    text,
                  }}
                  key={column?.name}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    minWidth: 50,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {`${text}`?.replace(
                    /(\d{3})(\d{3})(\d{3})(\d{2})/,
                    "$1.$2.$3-$4"
                  ) || "-"}
                </Typography.Text>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
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
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <div style={{ width: "100%", textAlign: "center" }}>
                  {bankListData?.itens.find((bank) => bank?.bank === text)
                    ?.icon_url ? (
                    <Tooltip
                      placement="topLeft"
                      title={
                        bankListData?.itens?.find((bank) => bank?.bank === text)
                          ?.label_name ??
                        text ??
                        null
                      }
                      arrow
                    >
                      <Avatar
                        src={
                          bankListData?.itens.find(
                            (bank) => bank?.bank === text
                          )?.icon_url ?? null
                        }
                        size="large"
                        shape="square"
                      >
                        <BankOutlined />
                      </Avatar>
                    </Tooltip>
                  ) : text ? (
                    <Tooltip
                      placement="topLeft"
                      title={
                        bankListData?.itens.find((bank) => bank?.bank === text)
                          ?.label_name ??
                        text ??
                        null
                      }
                      arrow
                    >
                      <Avatar size="large" shape="square">
                        <BankOutlined />
                      </Avatar>
                    </Tooltip>
                  ) : (
                    <Typography style={{ minWidth: "30px" }}>-</Typography>
                  )}
                </div>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
                      wordBreak: "keep-all",
                    }}
                  >
                    {t(`table.${column?.head || column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: any) => {
                return {
                  children:
                    typeof text === "boolean" || text === 1 || text === 0 ? (
                      <Typography
                        key={column?.name}
                        style={{
                          width: "100%",
                          textAlign: "center",
                          wordBreak: "keep-all",
                        }}
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
                          wordBreak: "keep-all",
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
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
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
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
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
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column.name[1]
                        : column?.name,
                      sort_order:
                        props?.query?.sort_order === "DESC" ? "ASC" : "DESC",
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
                    data-test-id="refetch-button"
                    type="link"
                    onClick={() => {
                      if (props?.refetch) props.refetch();
                    }}
                    loading={props.loading}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      margin: 0,
                    }}
                    icon={<CachedIcon style={{ fontSize: "28px" }} />}
                  ></Button>
                </Tooltip>
              ) : (
                ""
              ),
              key: column?.name,
              dataIndex: column?.name,
              width: 60,
              style: { backgroudColor: "red" },
              render: (_a: any, record: any) => (
                <div
                  style={{ width: "100%", textAlign: "center" }}
                  ref={column.key}
                >
                  {!props.disableActions ? (
                    <Dropdown
                      data-test-id="action-button"
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
                  ) : (
                    <></>
                  )}
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) =>
                text && text.length >= 20 ? (
                  <Tooltip title={text}>
                    <Typography
                      style={{
                        width: "100%",
                        textAlign: "center",
                        minWidth: 50,
                      }}
                      full-text={text}
                    >
                      {text
                        ? text.length > 15 && columns.length >= 6
                          ? `${`${text}`.substring(0, 8)}...`
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
                    full-text={text}
                  >
                    {text ?? "-"}
                  </Typography>
                ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography
                  style={{
                    width: "100%",
                    textAlign: "center",
                    minWidth: "30px",
                  }}
                >
                  {text ? t(`table.${text.toLocaleLowerCase()}`) : "-"}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                    }));

                    return 0;
                  }
                : undefined,
            };

          case "pix_type":
            return {
              title: (
                <Typography
                  style={{
                    width: "100%",
                    textAlign: "center",
                    wordBreak: "keep-all",
                  }}
                  ref={column.key}
                >
                  {t(`table.${column?.head || column?.name}`)}
                </Typography>
              ),
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => (
                <Typography
                  style={{
                    width: "100%",
                    textAlign: "center",
                    minWidth: "30px",
                    wordBreak: "keep-all",
                  }}
                >
                  {text
                    ? t(`table.${text.toLocaleLowerCase()}`)
                    : t("table.standard")}
                </Typography>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              width: 180,
              render: (text: any, record: any) => (
                <Row
                  gutter={[8, 8]}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Col xs={{ span: record?.error_message ? 21 : 24 }}>
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
                  </Col>
                  {record?.error_message && (
                    <Col span={3}>
                      <Tooltip
                        title={
                          (ErrorList as any)[record?.error_message]
                            ? t(
                                `error.${
                                  (ErrorList as any)[record?.error_message]
                                }`
                              )
                            : record?.error_message
                        }
                      >
                        <InfoCircleTwoTone
                          twoToneColor={defaultTheme.colors.error}
                          style={{ marginBottom: "8px" }}
                        />
                      </Tooltip>
                    </Col>
                  )}
                </Row>
              ),
              sorter: column.sort
                ? () => {
                    props.setQuery((state: any) => ({
                      ...state,
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
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
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
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
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
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
              fixed: "left",
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
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
                      sort_field: column?.sort_name
                        ? column.sort_name
                        : Array.isArray(column?.name)
                        ? column?.name[1]
                        : column?.name,
                      sort_order:
                        props.query.sort_order === "DESC" ? "ASC" : "DESC",
                    }));

                    return 0;
                  }
                : undefined,
            };
        }
      })
    );
  }, [props.columns]);

  const onChange: TablePropsAntD<any>["onChange"] = (page, _filter, sorter) => {
    setSorterObj(sorter);
    if ((page.total ?? 0) > (page?.pageSize ?? 0)) {
      return props.setQuery((state: any) => ({
        ...state,
        page: page?.current,
      }));
    }
    return props.setQuery((state: any) => ({ ...state, page: 1 }));
  };

  useEffect(() => {
    if (sorterObj?.order && sorterObj?.columnKey) {
      props.setQuery((state: any) => ({ ...state, page: 1 }));
    }
  }, [sorterObj?.order, sorterObj?.columnKey]);

  return (
    <>
      {!isMobile ? (
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Table
              size={"small"}
              tableLayout="auto"
              onChange={onChange}
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
              pagination={
                !props.bankStatement && {
                  current: Number(props?.query?.page ?? 1),
                  pageSize: Number(props?.query?.limit ?? 25),
                  showTotal: (total, range) => {
                    return props.removeTotal
                      ? `${range[0]} - ${
                          props?.items?.length < props?.data?.limit
                            ? props?.data?.limit * props?.data?.page
                            : props?.data?.limit * props?.data?.page + 1
                        }`
                      : `${range[0]} - ${range[1]} de ${total}`;
                  },
                  total: props.removeTotal
                    ? props?.items?.length < props?.data?.limit
                      ? props?.data?.limit * props?.data?.page
                      : props?.data?.limit * props?.data?.page + 1
                    : props?.data?.total,
                  showSizeChanger: true,

                  /* onChange: (page) => {
                  props.setQuery((state: any) => ({ ...state, page }));
                }, */
                  pageSizeOptions: [10, 25, 50, 100],
                  defaultPageSize: 25,
                  onShowSizeChange: (_current, size) =>
                    props.setQuery((state: any) => ({ ...state, limit: size })),
                  style: {
                    display:
                      props.removePagination || props.error
                        ? "none"
                        : undefined,
                  },
                }
              }
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
          </Col>
          {props.bankStatement && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "5px",
              }}
            >
              <Pagination
                current={props?.query?.page}
                onChange={(page) =>
                  props.setQuery((state: any) => ({ ...state, page }))
                }
                total={props?.data?.total}
                pageSize={1}
              />
            </div>
          )}
        </Row>
      ) : (
        <Row
          gutter={[8, 8]}
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Col span={24}>
            {props.refetch && (
              <Button
                style={{ width: "100%" }}
                type="link"
                onClick={props.refetch}
                icon={<ReloadOutlined />}
                loading={props?.loading}
              />
            )}
            <Mobile
              columns={props.columns}
              items={props.items}
              removeValue={props?.removeValue}
              label={props?.label}
              actions={actions}
              setCurrentItem={props.setCurrentItem}
              checkbox={props?.checkbox}
              setSelectedRows={props?.setSelectedRows}
              selectedKeys={props?.selectedKeys}
              loading={props.loading}
            />
          </Col>
          {!props.removePagination && !props.bankStatement && props.items && (
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
          {props.bankStatement && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "5px",
              }}
            >
              <Pagination
                current={props?.query?.page}
                onChange={(page) =>
                  props.setQuery((state: any) => ({ ...state, page }))
                }
                total={props?.data?.total}
                pageSize={1}
              />
            </div>
          )}
        </Row>
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
