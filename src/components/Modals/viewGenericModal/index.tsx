/* eslint-disable @typescript-eslint/no-explicit-any */
import { Descriptions, Drawer, Pagination, Spin, Table } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  }>;
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

  const [sortItems, setSortItems] = useState<any>(undefined);
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
        title: `${t("table.fee")} (%)`,
        dataIndex: "range_fee",
        key: "range_fee",
      },
      {
        title: t("input.minimum_value"),
        dataIndex: "range_value",
        key: "range_value",
      },
      {
        title: t("table.limit"),
        dataIndex: "range_limit",
        key: "range_limit",
      },
    ];

    return <Table pagination={false} dataSource={data} columns={columns} />;
  };

  useEffect(() => {
    if (item?.username) {
      setSortItems({
        name: item?.name,
        username: item?.username,
        cellphone: item?.cellphone,
        email: item?.email,
        status: item?.status ? "active" : "inactive",
        aggregator: item?.aggregator?.name,
        partner: item?.partner?.name,
        operator: item?.operator?.name,
        merchant: item?.merchant?.name,
        group: item?.permission_group?.name,
        created_at: item?.created_at ?? item.createdAt,
        updated_at: item?.updated_at ?? item.updatedAt,
        last_signin_date: item?.last_signin_date ?? item.last_check,
      });
    } else {
      setSortItems({ ...item });
    }
  }, [item]);

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
          sortItems &&
          Object.keys(sortItems).map((key: string) => {
            if (
              [
                'group_id',
                'merchant_id',
                'organization_id',
                'partner_id',
                'profile_type_id',
              ].includes(key)
            ) {
              return;
            }

            if (!sortItems[key]) {
              return;
            }
            if (typeof sortItems[key] === ("object" || "array")) return;
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
                    {`${new Date(
                      sortItems[key]
                    ).toLocaleDateString()} ${new Date(
                      sortItems[key]
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
                    {`${new Date(sortItems[key]).toLocaleDateString("pt-BR", {
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
                    {typeof sortItems[key] === "boolean"
                      ? sortItems[key]
                        ? t("table.active")
                        : t("table.inactive")
                      : t(`table.${sortItems[key].toLocaleLowerCase()}`)}
                  </Descriptions.Item>
                );

                case "success":
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
                      {t(`table.${sortItems[key]}`)}
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
                    {sortItems[key] ? t("table.true") : t("table.false")}
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
                    {typeof sortItems[key] === "boolean"
                      ? t(`table.${sortItems[key]}`)
                      : t(`table.${sortItems[key.toLocaleLowerCase()]}`)}
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
                    {sortItems[key] ?? "-"}
                  </Descriptions.Item>
                );
            }
          })}
      </Descriptions>

      {item?.merchant_fee_plans_details && (
        <div style={{ marginTop: "20px" }}>
          <span style={{ fontWeight: "bold", padding: "0 10px" }}>Taxas</span>
          <FeeTable
            data={listItems(item?.merchant_fee_plans_details, feePage, 5)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "10px",
            }}
          >
            <Pagination
              size="small"
              total={Number(item?.merchant_fee_plans_details.length)}
              current={feePage}
              pageSize={5}
              style={{ marginTop: "10px" }}
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
