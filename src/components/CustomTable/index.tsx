/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BankOutlined,
  CopyOutlined,
  EllipsisOutlined,
  InfoCircleTwoTone,
  ReloadOutlined
} from "@ant-design/icons";
import CachedIcon from "@mui/icons-material/Cached";
import { useListBanks } from "@src/services/bank/listBanks";
import { useGetrefetchCountries } from "@src/services/states_cities/getCountries";
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
  Image,
  Modal,
  Pagination,
  Progress,
  Row,
  Switch,
  Table,
  Tooltip,
  Typography
} from "antd";
import type { ColumnsType, TableProps as TablePropsAntD } from "antd/es/table";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Confirmation } from "../Modals/confirmation";
import { Mobile } from "./mobile";

export interface ColumnInterface {
  name: string | any; // (nome da coluna caso não passe head) e chave do objeto a ser acessado nos items
  head?: string; // nome da coluna (opcional) caso não seja passado, será usado o name
  type:
    | "id" // exibe um botão de copiar contendo o id em um tooltip
    | "showId" //exibe o id junto a um botão de copiar
    | "cpf" // Não usar esse type, usar document
    | "birth" // exibe formatação para data de nascimento (dd/mm/yyyy)
    | "text" // exibe texto
    | "country" // exibe a bandeira do país com tooltip contendo o nome do país
    | "translate" // exibe texto traduzido
    | "pix_type" // exibe tipo de pix (FastPix ou Regular)
    | "date" // exibe data
    | "small_date" // exibe data com no maximo 80px de largura
    | "document" // exibe documento formatado para CPF
    | "value" // exibe valor formatado para moeda R$
    | "action" // exibe botões de ação
    | "status" // exibe status (ativo ou inativo ou status de transação)
    | "status_color" // exibe status com cor
    | "actions"
    | "icon" // exibe ícone de banco caso seja url
    | "boolean" // exibe booleano (sim e não)
    | "bankNameToIcon" // exibe ícone de banco caso seja o nome do banco
    | "progress" // exibe barra de progresso
    | "merchant_name" // exibe nome da empresa caso seja um obj
    | "partner_name" // exibe nome da plataforma caso seja um obj
    | "deadline" // exibe prazo de entrega
    | "transaction_person" // exibe nome e documento do envolvido na transação, passar o tipo ["buyer", "payer"]
    | "transaction_status" // exibe status da transação com a data de atualização do status
    | "webhook_status" // exibe status do webhook
    | "switch" // exibe switch para troca de status
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
  updateLoading?: boolean; // define se os botões de atualizar da tabela estão carregando
  query: any; // váriavel contendo os parâmetros de busca para a chamada que mapeia a tabela
  error?: any; // erro da chamada que mapeia a tabela
  removeValue?: boolean; //remove o valor total da tabela caso mobile
  setQuery: Dispatch<SetStateAction<any>>; // função para setar os parâmetros de busca
  label?: string[]; // valores que aparecerão nos accordeons da tabela mobile
  currentItem?: any; // item atual, ou seja, o que o usuário clicou no botão de ações
  setCurrentItem: Dispatch<SetStateAction<any>>; // função para setar o item atual, ou seja, o que o usuário clicou no botão de ações
  removeTotal?: boolean; // remove a contagem total de registros da tabela
  actions?: (actionsInterface | false | undefined)[]; // array de objetos contendo as ações que aparecerão na tabela
  removePagination?: boolean; // remove a paginação da tabela
  isConfirmOpen?: boolean; // define se o modal de confirmação está aberto
  setIsConfirmOpen?: Dispatch<SetStateAction<boolean>>; // função para setar o modal de confirmação
  isConfirmUpdateOpen?: boolean; // define se o modal de confirmação de atualizçaão está aberto
  setIsConfirmUpdateOpen?: Dispatch<SetStateAction<boolean>>; // função para setar o modal de confirmação de atualização
  itemToAction?: string | null; // item que será afetado pela ação de confirmação
  onConfirmAction?: () => void; // função que será executada ao confirmar a ação
  disableScrollToTop?: boolean; // desabilita o scroll para o topo da página
  checkbox?: boolean; // habilita a seleção de linhas
  setSelectedRows?: Dispatch<SetStateAction<any>>; // função para setar as linhas selecionadas
  selectedKeys?: any; // chaves das linhas selecionadas
  refetch?: () => void; // função para rebuscar dos dados
  update?: () => void; // função para atualizar os dados
  disableActions?: boolean; // desabilita as ações
  rowKey?: string;
  size?: "large" | "middle" | "small"; // tamanho da tabela
  bankStatement?: boolean; // define se a tabela é de extrato bancário
}

export const CustomTable = (props: TableProps) => {
  const { t } = useTranslation();
  const translation = useTranslation().i18n.language;
  const isMobile = useMediaQuery({ maxWidth: "950px" });
  const isSmallDesktop = useMediaQuery({ maxWidth: "1250px" });
  const { Countries } = useGetrefetchCountries();
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
                  {text ? (
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
                  ) : (
                    "-"
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
              width: isSmallDesktop ? 85 : undefined,
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
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              width: isSmallDesktop ? 75 : undefined,
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

          case "country":
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
              width: 65,
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (text: string) => {
                const currentCountry = Countries?.find(
                  (item) => item?.name?.common === text
                );

                return (
                  <>
                    {currentCountry ? (
                      <Tooltip
                        title={
                          translation === "pt-BR"
                            ? currentCountry?.translations?.por?.common
                            : currentCountry?.name?.common
                        }
                      >
                        <Image
                          preview={false}
                          src={currentCountry?.flags?.svg}
                          style={{
                            margin: "10px",
                            border: "1px solid gray",
                            borderRadius: "2px",
                            width: "25px",
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        -
                      </div>
                    )}
                  </>
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
                  {+`${text}`?.replace(/\D/g, "").length === 11
                    ? `${text}`?.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4"
                      )
                    : +`${text}`?.replace(/\D/g, "").length === 14
                    ? `${text}`?.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                        "$1.$2.$3/$4-$5"
                      )
                    : text ?? "-"}
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

          case "transaction_person":
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
              render: (text: string, record: any) => (
                <div>
                  <Typography
                    style={{
                      width: "100%",
                      textAlign: "center",
                      minWidth: 50,
                    }}
                    full-text={text}
                    title={record[`${column.name}_name`]}
                  >
                    {record[`${column.name}_name`]
                      ? record[`${column.name}_name`].length > 15
                        ? `${record[`${column.name}_name`].substring(0, 15)}...`
                        : record[`${column.name}_name`]
                      : "-"}
                  </Typography>
                  {record[`${column.name}_document`] && (
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
                      {record[`${column.name}_document`]
                        ? +`${record[`${column.name}_document`]}`?.replace(
                            /\D/g,
                            ""
                          ).length === 11
                          ? `${record[`${column.name}_document`]}`?.replace(
                              /(\d{3})(\d{3})(\d{3})(\d{2})/,
                              "$1.$2.$3-$4"
                            )
                          : +`${record[`${column.name}_document`]}`?.replace(
                              /\D/g,
                              ""
                            ).length === 14
                          ? `${record[`${column.name}_document`]}`?.replace(
                              /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                              "$1.$2.$3/$4-$5"
                            )
                          : `${record[`${column.name}_document`]}` ?? "-"
                        : "-"}
                    </Typography.Text>
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

          case "status_color":
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
                      minWidth: 60,
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
              render: (text: any) => (
                <Typography
                  key={column?.name}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    textAlign: "center",
                    color: (defaultTheme.colors as any)[
                      text?.toLocaleLowerCase() || ""
                    ],
                    fontWeight: 600,
                    wordBreak: "keep-all",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "4px",
                    border: "1px solid #DCDFE7",
                    padding: "0 4px 0 4px",
                    width: "fit-content",
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: (defaultTheme.colors as any)[
                        text?.toLocaleLowerCase() || ""
                      ],
                    }}
                  />
                  {text ? t(`table.${text?.toLocaleLowerCase()}`) : "-"}
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

          case "transaction_status":
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
                      minWidth: 60,
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
              render: (text: any, row: any) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    key={column?.name}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      textAlign: "center",
                      color: (defaultTheme.colors as any)[
                        text?.toLocaleLowerCase()
                      ],
                      fontWeight: 600,
                      wordBreak: "keep-all",
                      alignItems: "center",
                      gap: "6px",
                      borderRadius: "4px",
                      border: "1px solid #DCDFE7",
                      padding: "0 4px 0 4px",
                      width: "fit-content",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: (defaultTheme.colors as any)[
                          text?.toLocaleLowerCase()
                        ],
                      }}
                    />
                    {text ? t(`table.${text?.toLocaleLowerCase()}`) : "-"}
                  </Typography>
                  {row.paid_at && (
                    <Typography.Text
                      key={column?.name}
                      style={{ width: "100%", textAlign: "center" }}
                    >{`${new Date(
                      `${row.paid_at?.split("Z")[0]}Z`
                    ).toLocaleDateString()} ${new Date(
                      `${row.paid_at?.split("Z")[0]}Z`
                    ).toLocaleTimeString()}`}</Typography.Text>
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

          case "webhook_status":
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
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      key={column?.name}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        textAlign: "center",
                        color: (defaultTheme.colors as any)[
                          text ? "success" : "error"
                        ],
                        fontWeight: 600,
                        wordBreak: "keep-all",
                        alignItems: "center",
                        gap: "6px",
                        borderRadius: "4px",
                        border: "1px solid #DCDFE7",
                        padding: "0 4px",
                        width: "fit-content",
                        margin: "0 auto",
                      }}
                    >
                      {" "}
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: (defaultTheme.colors as any)[
                            text ? "success" : "error"
                          ],
                        }}
                      />
                      {text
                        ? t(`messages.delivered`) || ""
                        : t(`messages.not_delivered`) || ""}
                    </Typography>

                    {text && (
                      <Typography.Text
                        key={column?.name}
                        style={{ width: "100%", textAlign: "center" }}
                      >{`${new Date(
                        `${text?.split("Z")[0]}Z`
                      ).toLocaleDateString()} ${new Date(
                        `${text?.split("Z")[0]}Z`
                      ).toLocaleTimeString()}`}</Typography.Text>
                    )}
                  </div>
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
                      minWidth: 60,
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
                          minWidth: 50,
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
                            text?.toString()?.toLocaleLowerCase()()
                          ],
                          fontWeight: 600,
                          wordBreak: "keep-all",
                          minWidth: 50,
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

          case "deadline":
            return {
              title: <></>,
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              width: 40,
              render: (_text: string, record: any) => {
                function calculateDeadline(paid_at: any) {
                  // Calcula a diferença entre a data atual e a data de pagamento em milissegundos
                  let difference;
                  if (record?.delivered_at) {
                    difference =
                      new Date(record?.delivered_at).getTime() -
                      paid_at.getTime();
                  } else {
                    difference = Date.now() - paid_at.getTime();
                  }

                  // Calcula os minutos e segundos restantes
                  const minutes = Math.floor(difference / (1000 * 60));
                  const seconds = Math.floor((difference / 1000) % 60);
                  if (
                    +`${minutes.toString().padStart(2, "0")}.${seconds
                      .toString()
                      .padStart(2, "0")}` <= 1 &&
                    record.delivered_at
                  ) {
                    return (
                      <Tooltip
                        title={`${t("messages.delivered_on_time")}: ${minutes
                          .toString()
                          .padStart(2, "0")}m:${seconds
                          .toString()
                          .padStart(2, "0")}s`}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: defaultTheme.colors.success,
                          }}
                        />
                      </Tooltip>
                    );
                  }
                  if (
                    +`${minutes.toString().padStart(2, "0")}.${seconds
                      .toString()
                      .padStart(2, "0")}` <= 1 &&
                    !record.delivered_at
                  ) {
                    return (
                      <Tooltip
                        title={`${t(
                          "messages.not_delivered_on_time"
                        )}: ${minutes.toString().padStart(2, "0")}m:${seconds
                          .toString()
                          .padStart(2, "0")}s`}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: defaultTheme.colors.success,
                          }}
                        />
                      </Tooltip>
                    );
                  }
                  if (
                    +`${minutes.toString().padStart(2, "0")}.${seconds
                      .toString()
                      .padStart(2, "0")}` > 1 &&
                    record.delivered_at
                  ) {
                    return (
                      <Tooltip
                        title={`${t("messages.delivered_late")}:  ${
                          minutes > 60
                            ? ">1h"
                            : `${minutes.toString().padStart(2, "0")}m:${seconds
                                .toString()
                                .padStart(2, "0")}s`
                        }`}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: defaultTheme.colors.error,
                          }}
                        />
                      </Tooltip>
                    );
                  }
                  if (
                    +`${minutes.toString().padStart(2, "0")}.${seconds
                      .toString()
                      .padStart(2, "0")}` > 1 &&
                    !record.delivered_at
                  ) {
                    return (
                      <Tooltip
                        title={`${t("messages.not_delivered_late")}: ${
                          minutes > 60
                            ? ">1h"
                            : `${minutes.toString().padStart(2, "0")}m:${seconds
                                .toString()
                                .padStart(2, "0")}s`
                        }`}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: defaultTheme.colors.error,
                          }}
                        />
                      </Tooltip>
                    );
                  }
                  // Se nenhuma das condições for atendida, retorne "-" como fallback
                  return "-";
                }

                const paymentDate = new Date(record?.paid_at); // Suponha que esta seja a data de pagamento
                const deadlineDate = calculateDeadline(paymentDate);

                return (
                  <Typography
                    key={column?.name}
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {deadlineDate}
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
                          console.log("record", record);
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
                text && text.length >= 30 ? (
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
                        ? text.length > 30
                          ? `${`${text}`.substring(0, 30)}...`
                          : text
                        : "-"}
                    </Typography>
                  </Tooltip>
                ) : isSmallDesktop && text && text.length >= 20 ? (
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
                  {text ? t(`table.${text?.toLocaleLowerCase()}`) : "-"}
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
                    ? t(`table.${text?.toLocaleLowerCase()}`)
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

          case "switch":
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
                    {t(`table.${column?.head ?? column?.name}`)}
                  </Typography>
                </Tooltip>
              ),
              key: column?.sort_name
                ? column.sort_name
                : Array.isArray(column?.name)
                ? column?.name + `${Math.random()}`
                : column?.name,
              dataIndex: column?.name,
              render: (_a: any, record: any) => (
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  onClick={() => {
                    props.setCurrentItem(record);
                    props?.setIsConfirmUpdateOpen &&
                      props.setIsConfirmUpdateOpen(true);
                  }}
                >
                  <Switch
                    loading={
                      props?.currentItem?.id === record.id &&
                      props?.updateLoading
                    }
                    checked={record?.status}
                  />
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

          <Confirmation
            open={props?.isConfirmUpdateOpen as any}
            setOpen={props?.setIsConfirmUpdateOpen || (() => {})}
            submit={props?.update || (() => {})}
            title={t("actions.edit")}
            description={
              props?.currentItem?.validity_status === "EXPIRED"
                ? `${t("messages.license_expired")}`
                : `${t("messages.are_you_sure_status", {
                    action: t("actions.edit")?.toLocaleLowerCase(),
                    itens: props?.currentItem?.name,
                  })}`
            }
            loading={props?.loading}
          />

          {props.bankStatement && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
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
