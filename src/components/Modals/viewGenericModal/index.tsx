import { Descriptions, Drawer, Spin } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface viewProps {
  modalName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  item: any;
}

export const ViewModal = ({
  open,
  setOpen,
  modalName,
  loading,
  item,
}: viewProps) => {
  const { t } = useTranslation();

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
    </Drawer>
  );
};
