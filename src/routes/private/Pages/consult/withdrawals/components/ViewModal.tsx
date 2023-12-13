/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CopyOutlined,
  DownloadOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { Grid } from "@mui/material";
import { useCreateWithdrawVoucherRefund } from "@src/services/consult/withdrawals/generatedWithdrawals/generateWithdrawVoucher";
import { useGetWithdraw } from "@src/services/consult/withdrawals/generatedWithdrawals/getWithdraw";
import {
  Button,
  Descriptions,
  Drawer,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  id: string;
}

export const ViewModal = (props: ViewModalProps) => {
  const { t } = useTranslation();
  const onClose = () => {
    props.setOpen(false);
  };

  const { withdraw, isWithdrawFetching } = useGetWithdraw(props.id);
  const [currOption, setCurrOption] = useState<any>("transaction");
  const { mutateWithdrawVoucher, isWithdrawVoucherLoading } =
    useCreateWithdrawVoucherRefund(props.id);

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
            options={[
              { label: t("table.transaction"), value: "transaction" },
              { label: t("table.receiver"), value: "receiver" },
            ]}
            onChange={(value) => {
              setCurrOption(value);
            }}
          />
        </Grid>
        {isWithdrawFetching && (
          <Grid container>
            {" "}
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Spin />
            </Grid>
          </Grid>
        )}{" "}
        {withdraw && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {
                currOption === "transaction" && (
                  <>
                    <Descriptions.Item
                      key={"id"}
                      label={t(`table.id`)}
                      labelStyle={{
                        maxWidth: "120px !important",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      <Typography.Text copyable>
                        {withdraw?._id}
                      </Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item
                      key={"endToEndId"}
                      label={t(`table.endToEndId`)}
                      labelStyle={{
                        maxWidth: "120px !important",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {withdraw?.endToEndId
                        ? `${withdraw?.endToEndId?.substring(0, 15)}...`
                        : "-"}
                      {withdraw?.endToEndId && (
                        <Button
                          size="large"
                          type="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(withdraw?.endToEndId);
                            toast.success(t("table.copied"));
                          }}
                        >
                          <CopyOutlined />
                        </Button>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item
                      key={"payment_id"}
                      label={t(`table.payment_id`)}
                      labelStyle={{
                        maxWidth: "120px !important",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {withdraw?.payment_id
                        ? `${withdraw?.payment_id?.substring(0, 15)}...`
                        : "-"}
                      {withdraw?.payment_id && (
                        <Button
                          size="large"
                          type="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(withdraw?.payment_id);
                            toast.success(t("table.copied"));
                          }}
                        >
                          <CopyOutlined />
                        </Button>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item
                      key={"bank"}
                      label={t(`table.bank`)}
                      labelStyle={{
                        maxWidth: "120px !important",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {withdraw?.bank ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      key={"value"}
                      label={t(`table.value`)}
                      labelStyle={{
                        maxWidth: "120px !important",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(withdraw?.value) || 0)}
                    </Descriptions.Item>

                    <Descriptions.Item
                      key={"pix_key"}
                      label={t(`table.pix_key`)}
                      labelStyle={{
                        maxWidth: "120px !important",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {withdraw?.pix_key ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      key={"description"}
                      label={t(`table.description`)}
                      labelStyle={{
                        maxWidth: "120px !important",
                        margin: 0,
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {withdraw?.description ?? "-"}
                    </Descriptions.Item>
                    {withdraw?.webhook_url && (
                      <Descriptions.Item
                        key={"webhook_url"}
                        label={t(`table.webhook_url`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        <Typography.Text copyable>
                          {withdraw?.webhook_url}
                        </Typography.Text>
                      </Descriptions.Item>
                    )}
                    {withdraw?.webhook_url_optional && (
                      <Descriptions.Item
                        key={"webhook_url_optional"}
                        label={t(`table.webhook_url_optional`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        <Typography.Text copyable>
                          {withdraw?.webhook_url_optional}
                        </Typography.Text>
                      </Descriptions.Item>
                    )}

                    {withdraw?.error && (
                      <Descriptions.Item
                        key={"error"}
                        label={t(`table.error`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        <Typography.Text copyable>
                          {withdraw?.error}
                        </Typography.Text>
                      </Descriptions.Item>
                    )}

                    {!withdraw?.url_pdf && withdraw.status === "PAID" ? (
                      <Descriptions.Item
                        key={"generate_payment_voucher"}
                        label={t(`table.generate_payment_voucher`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        <Button
                          type="dashed"
                          onClick={() => mutateWithdrawVoucher()}
                          loading={isWithdrawVoucherLoading}
                        >
                          <FilePdfOutlined />
                          {t(`table.generate_payment_voucher`)}
                        </Button>
                      </Descriptions.Item>
                    ) : withdraw.status === "PAID" ? (
                      <Descriptions.Item
                        key={"download_payment_voucher"}
                        label={t(`table.download_payment_voucher`)}
                        labelStyle={{
                          maxWidth: "120px !important",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        <Button
                          onClick={() => {
                            window.location.assign(withdraw?.url_pdf);
                          }}
                          type="primary"
                        >
                          <DownloadOutlined />
                          {t(`table.download_payment_voucher`)}
                        </Button>
                      </Descriptions.Item>
                    ) : (
                      <></>
                    )}
                  </>
                )
                // Object.keys(withdraw).map((key: string) => {
                //   switch (key) {
                //     case "createdAt":
                //     case "paid_at":
                //     case "delivered_at":
                //       return (
                //         <Descriptions.Item
                //           key={key}
                //           label={t(`table.${key}`)}
                //           labelStyle={{
                //             maxWidth: "120px !important",
                //             margin: 0,
                //             padding: 0,
                //             textAlign: "center",
                //           }}
                //         >
                //           {`${new Date(
                //             withdraw[key]
                //           ).toLocaleDateString()} ${new Date(
                //             withdraw[key]
                //           ).toLocaleTimeString()}`}
                //         </Descriptions.Item>
                //       );
                //     case "_id":
                //     case "merchant_name":
                //     case "bank":
                //     case "endToEndId":
                //     case "reference_id":
                //     case "description":
                //     case "webhook_url":
                //     case "receiver_name":
                //     case "webhook_url_optional":
                //       return (
                //         withdraw[key] !== "N/A" && (
                //           <Descriptions.Item
                //             key={key}
                //             label={t(`table.${key}`)}
                //             labelStyle={{
                //               maxWidth: "120px !important",
                //               margin: 0,
                //               padding: 0,
                //               textAlign: "center",
                //             }}
                //           >
                //             {withdraw[key]}
                //           </Descriptions.Item>
                //         )
                //       );
                //     case "receiver_document":
                //       return (
                //         <Descriptions.Item
                //           key={key}
                //           label={t(`table.${key}`)}
                //           labelStyle={{
                //             maxWidth: "120px !important",
                //             margin: 0,
                //             padding: 0,
                //             textAlign: "center",
                //           }}
                //         >
                //           {`${withdraw[key]}`.replace(
                //             /(\d{3})(\d{3})(\d{3})(\d{2})/,
                //             "$1.$2.$3-$4"
                //           )}
                //         </Descriptions.Item>
                //       );

                //     case "value":
                //       return (
                //         <Descriptions.Item
                //           key={key}
                //           label={t(`table.${key}`)}
                //           labelStyle={{
                //             maxWidth: "120px !important",
                //             margin: 0,
                //             padding: 0,
                //             textAlign: "center",
                //           }}
                //         >
                //           {" "}
                //           {new Intl.NumberFormat("pt-BR", {
                //             style: "currency",
                //             currency: "BRL",
                //           }).format(Number(withdraw[key]) || 0)}
                //         </Descriptions.Item>
                //       );

                //     default:
                //       return;
                //   }
                // })
              }
              {currOption === "receiver" &&
                Object.keys(withdraw).map((key: string) => {
                  switch (key) {
                    case "receiver_birth_date":
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
                            withdraw[key]
                          ).toLocaleDateString()} ${new Date(
                            withdraw[key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "receiver_name":
                    case "receiver_gender":
                    case "receiver_street":
                    case "receiver_number":
                    case "receiver_neighborhood":
                    case "receiver_city":
                    case "receiver_state":
                    case "receiver_zip_code":
                    case "receiver_bank_account":
                    case "receiver_bank_agency":
                    case "receiver_bank_name":
                    case "receiver_bank_client_document":
                    case "receiver_bank_client_name":
                      return (
                        withdraw[key] !== "N/A" && (
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
                            {withdraw[key]}
                          </Descriptions.Item>
                        )
                      );
                    case "receiver_document":
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
                          <Typography.Text copyable>
                            {" "}
                            {withdraw[key]}
                          </Typography.Text>
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
