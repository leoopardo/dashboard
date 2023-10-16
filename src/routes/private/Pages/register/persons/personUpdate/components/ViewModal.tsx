/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useState } from "react";
import { Grid } from "@mui/material";
import { Descriptions, Drawer, Segmented, Spin, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { PersonsQuery } from "@src/services/types/register/persons/persons.interface";
import { useGetPersonHistoryDetails } from "@src/services/register/persons/persons/getPersonsHistory";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  query: PersonsQuery;
  id: string;
  cpf: string;
}

export const ViewModal = (props: ViewModalProps) => {
  const { t } = useTranslation();
  const onClose = () => {
    props.setOpen(false);
  };

  const {
    PersonsHistoryDetailsData,
    isPersonsHistorDetailsyDataFetching,
  } = useGetPersonHistoryDetails(
    { ...props.query, cpf: undefined },
    props.cpf?.split(" ").join(".") || "",
    props.id
  );
  const data: any = PersonsHistoryDetailsData;
  const [currOption, setCurrOption] = useState<any>("general");

  const renderTabs = () => {
    const array = [
      { label: t("table.general"), value: "general" },
    ];

    if (data?.data_before) {
      array.push({ label: t("table.previous_data"), value: "previus" });
    }

    if (data?.data_later) {
      array.push({
        label: t("table.later_data"),
        value: "later",
      });
    }

    return array
  };

  return (
    <Drawer
      title={`${t("table.details")}: (${props?.id || "-"})`}
      placement="right"
      onClose={onClose}
      open={props.open}
      bodyStyle={{ padding: 0 }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Segmented
            block
            size="middle"
            style={{ width: "100%" }}
            value={currOption}
            options={renderTabs()}
            onChange={(value) => {
              setCurrOption(value);
            }}
          />
        </Grid>{" "}
        {isPersonsHistorDetailsyDataFetching && <Spin />}{" "}
        {PersonsHistoryDetailsData && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {currOption === "general" &&
                Object.keys(PersonsHistoryDetailsData).map((key: string) => {
                  switch (key) {
                    case "createdAt":
                    case "updatedAt":
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
                            data[key]
                          ).toLocaleDateString()} ${new Date(
                            data[key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );

                    case "cpf":
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
                          {`${data[key]}`.replace(
                            /(\d{3})(\d{3})(\d{3})(\d{2})/,
                            "$1.$2.$3-$4"
                          )}
                        </Descriptions.Item>
                      );

                    case "step":
                    case "user_name":
                    case "ip":
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
                          {data[key]}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}
              {currOption === "previus" &&
                Object.keys(data?.data_before).map((key: any) => {
                  const item = data.data_before[key];
                  switch (key) {
                    case "createdAt":
                    case "updatedAt":
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
                          {`${new Date(item).toLocaleDateString()} ${new Date(
                            item
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "cpf":
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
                          {`${item}`.replace(
                            /(\d{3})(\d{3})(\d{3})(\d{2})/,
                            "$1.$2.$3-$4"
                          )}
                        </Descriptions.Item>
                      );

                    case "_id":
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
                          {item}
                        </Descriptions.Item>
                      );

                    case "file_url":
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
                          <Button
                            type="primary"
                            style={{ width: "100%" }}
                            disabled={!item}
                            onClick={() => window.location.assign(item)}
                          >
                            <DownloadOutlined />
                            {t("table.download")}
                          </Button>
                        </Descriptions.Item>
                      );
                    default:
                      return;
                  }
                })}

              {currOption === "later" &&
                Object.keys(data?.data_later).map((key: any) => {
                  const item = data?.data_later[key];

                  switch (key) {
                    case "createdAt":
                    case "updatedAt":
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
                          {`${new Date(item).toLocaleDateString()} ${new Date(
                            item
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "cpf":
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
                          {`${item}`.replace(
                            /(\d{3})(\d{3})(\d{3})(\d{2})/,
                            "$1.$2.$3-$4"
                          )}
                        </Descriptions.Item>
                      );

                    case "_id":
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
                          {item}
                        </Descriptions.Item>
                      );

                    case "file_url":
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
                          <Button
                            type="primary"
                            style={{ width: "100%" }}
                            disabled={!item}
                            onClick={() => window.location.assign(item)}
                          >
                            <DownloadOutlined />
                            {t("table.download")}
                          </Button>
                        </Descriptions.Item>
                      );
                    default:
                      return;
                  }
                })}
            </Descriptions>
          </Grid>
        )}
      </Grid>
    </Drawer>
  );
};
