/* eslint-disable @typescript-eslint/no-explicit-any */
import { Descriptions, Drawer, Pagination, Spin, Table } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

interface viewProps {
  modalName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  item: any;
}

interface FeeTableProps {
  data: Array<{
    id?: number;
    merchant_fee_plans_id?: number;
    range_fee: number;
    range_value: number;
    range_limit: number;
  }>
}

export const ViewModal = ({
  open,
  setOpen,
  modalName,
  loading,
  item,
}: viewProps) => {
  const { t } = useTranslation();
  const [feePage, setFeePage] = useState(1);
  const listItems = (items: any, atual: any, limit: number) => {
    const result = [];
    const totalPage = Math.ceil(items?.length / limit);
    let count = atual * limit - limit;
    const delimiter = count + limit;
    if (atual <= totalPage) {
      for (let i = count; i < delimiter; i++) {
        if (items[i]) {
          result.push(items[i]);
        }
        count++;
      }
    }

    return result;
  };

  const FeeTable: React.FC<FeeTableProps> = ({ data }) => {
    const columns = [
      {
        title: `${t('table.fee')} (%)`,
        dataIndex: 'range_fee',
        key: 'range_fee',
      },
      {
        title: t('input.minimum_value'),
        dataIndex: 'range_value',
        key: 'range_value',
      },
      {
        title: t('table.limit'),
        dataIndex: 'range_limit',
        key: 'range_limit',
      },
    ];
  
    return <Table pagination={false} dataSource={data} columns={columns} />;
  };

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      bodyStyle={{ overflowX: "hidden", padding: 0 }}
      title={modalName}
    >
      {loading && <Spin tip={t("messages.loading")} />}
      <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
        {item &&
          Object.keys(item).map((key: string) => {
            if (typeof item[key] === ("object" || "array")) return;
            switch (key) {
              case "created_at":
              case "createdAt":
              case "last_check":
              case "updatedAt":
              case "updated_at":
              case "last_signin_date":
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
                    {`${new Date(item[key]).toLocaleDateString()} ${new Date(
                      item[key]
                    ).toLocaleTimeString()}`}
                  </Descriptions.Item>
                );

              case "birth_date":
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
                    {`${new Date(item[key]).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}`}
                  </Descriptions.Item>
                );

              case "status":
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
                    {typeof item[key] === "boolean"
                      ? item[key]
                        ? t("table.active")
                        : t("table.inactive")
                      : t(`table.${item[key.toLocaleLowerCase()]}`)}
                  </Descriptions.Item>
                );
              case "flag_pep":
              case "flag_aux_gov":
              case "black_list":
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
                    {item[key] ? t("table.true") : t("table.false")}
                  </Descriptions.Item>
                );

              case "phone_validated":
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
                    {typeof item[key] === "boolean"
                      ? t(`table.${item[key]}`)
                      : t(`table.${item[key.toLocaleLowerCase()]}`)}
                  </Descriptions.Item>
                );

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
                    {item[key] ?? "-"}
                  </Descriptions.Item>
                );
            }
          })}
      </Descriptions>

      {item?.merchant_fee_plans_details && (
        <div style={{marginTop: '20px'}}>
          <span style={{fontWeight: 'bold', padding: '0 10px'}}>Taxas</span>
          <FeeTable 
          data={listItems(item?.merchant_fee_plans_details, feePage, 5)} />
          <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: '10px'}}>
          <Pagination
              size="small"
              total={Number(item?.merchant_fee_plans_details.length)}
              current={feePage}
              pageSize={5}
              style={{ marginTop: '10px'}}
              onChange={(page) => {
                setFeePage(page);
              }}
            />
          </div>
        </div>
        )}
    </Drawer>
  );
};
