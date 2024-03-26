/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CopyOutlined,
  DownloadOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { Grid } from "@mui/material";
import { useCreateDepositPaymentVoucherRefund } from "@src/services/consult/refund/refundDeposits/generatePaymentVoucher";
import { useGetRefund } from "@src/services/consult/refund/refundDeposits/getRefund";
import { useGetRowsRefundDeposits } from "@src/services/consult/refund/refundDeposits/getRows";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import {
  Button,
  Descriptions,
  Input,
  QRCode,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useGetDeposit } from "../../../../../../services/consult/deposits/generatedDeposits/getDeposit";
import { useMediaQuery } from "react-responsive";
import { queryClient } from "@src/services/queryClient";
import { ValidateInterface } from "@src/services/types/validate.interface";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  id?: string | null;
}

export const ViewModalFields = (props: ViewModalProps) => {
  const { t } = useTranslation();
  const { permissions } = queryClient.getQueryData(
    "validate"
  ) as ValidateInterface;
  const { deposit, isDepositFetching } = useGetDeposit(`${props.id}`);
  const isMobile = useMediaQuery({ maxWidth: 950 });
  const [currOption, setCurrOption] = useState<
    "transaction" | "buyer" | "payer" | "refund"
  >("transaction");
  const { refundDepositsRows } = useGetRowsRefundDeposits({
    pix_id: `${props?.id}`,
    limit: 10,
    page: 1,
  });
  const { Refund, refetchRefund, isRefundFetching } = useGetRefund(
    `${refundDepositsRows?.items[0]?._id}`
  );
  const { mutateDepositPaymentVoucher, isDepositPaymentVoucherLoading } =
    useCreateDepositPaymentVoucherRefund(Refund?.endToEndId);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Segmented
            block
            size="middle"
            style={{ width: "100%" }}
            value={currOption}
            options={[
              { label: t("table.transaction"), value: "transaction" },
              { label: t("table.buyer"), value: "buyer" },
              {
                label: t("table.payer"),
                value: "payer",
                disabled: deposit?.status !== "PAID",
              },
              {
                label: t("table.refund"),
                value: "refund",
                disabled:
                  deposit?.status !== "REFUNDED" ||
                  !permissions?.report?.chargeback?.deposit_chargeback
                    ?.report_chargeback_deposit_chargeback_list,
              },
            ]}
            onChange={(value: any) => {
              setCurrOption(value);
              value === "refund" && refetchRefund();
            }}
          />
        </Grid>{" "}
        {(isDepositFetching || isRefundFetching) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              margin: 25,
            }}
          >
            <Spin />
          </div>
        )}
        {deposit && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {currOption === "transaction" &&
                Object.keys(deposit).map((key: string) => {
                  switch (key) {
                    case "createdAt":
                    case "paid_at":
                    case "delivered_at":
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
                            deposit[key]
                          ).toLocaleDateString()} ${new Date(
                            deposit[key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );

                    case "merchant_name":
                    case "bank":
                    case "reference_id":
                    case "description":
                    case "buyer_name":
                    case "payer_name":
                      return (
                        deposit[key] !== "N/A" && (
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
                            {deposit[key]}
                          </Descriptions.Item>
                        )
                      );
                    case "webhook_url":
                    case "webhook_url_optional":
                    case "txid":
                    case "endToEndId":
                    case "_id":
                      return (
                        deposit[key] !== "N/A" &&
                        deposit[key] && (
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
                              {deposit[key]}
                            </Typography.Text>
                          </Descriptions.Item>
                        )
                      );

                    case "payer_document":
                    case "buyer_document":
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
                          {+`${deposit[key]}`?.replace(/\D/g, "").length === 11
                            ? `${deposit[key]}`?.replace(
                                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                                "$1.$2.$3-$4"
                              )
                            : +`${deposit[key]}`?.replace(/\D/g, "").length ===
                              14
                            ? `${deposit[key]}`?.replace(
                                /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                                "$1.$2.$3/$4-$5"
                              )
                            : deposit[key] ?? "-"}
                        </Descriptions.Item>
                      );

                    case "qr_code":
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
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "start",
                            }}
                          >
                            <QRCode
                              value={deposit[key] || "-"}
                              errorLevel="L"
                              type="canvas"
                              bgColor="#ffffff"
                              icon={import.meta.env.VITE_APP_ICON}
                              iconSize={18}
                              size={isMobile ? 150 : 230}
                              style={{ marginBottom: "8px" }}
                            />
                            <Input
                              placeholder="-"
                              value={deposit[key] || "-"}
                              addonAfter={
                                <Button
                                  size="small"
                                  type="ghost"
                                  onClick={() => {
                                    navigator.clipboard.writeText(deposit[key]);
                                    toast.success(t("table.copied"));
                                  }}
                                >
                                  <CopyOutlined />
                                </Button>
                              }
                            />
                          </div>
                        </Descriptions.Item>
                      );
                    case "value":
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
                          {" "}
                          {moneyFormatter(Number(deposit[key]) || 0)}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}
              {currOption === "buyer" &&
                Object.keys(deposit).map((key: string) => {
                  switch (key) {
                    case "buyer_birth_date":
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
                          {`${new Date(deposit[key]).toLocaleDateString(
                            "pt-BR",
                            {
                              timeZone: "UTC",
                            }
                          )}`}
                        </Descriptions.Item>
                      );
                    case "buyer_city":
                    case "buyer_email":
                    case "buyer_gender":
                    case "buyer_name":
                    case "buyer_neighborhood":
                    case "buyer_number":
                    case "buyer_state":
                    case "buyer_street":
                    case "buyer_zip_code":
                      return (
                        deposit[key] !== "N/A" &&
                        deposit[key] && (
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
                            {deposit[key]}
                          </Descriptions.Item>
                        )
                      );

                    case "buyer_document":
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
                          {+`${deposit[key]}`?.replace(/\D/g, "").length === 11
                            ? `${deposit[key]}`?.replace(
                                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                                "$1.$2.$3-$4"
                              )
                            : +`${deposit[key]}`?.replace(/\D/g, "").length ===
                              14
                            ? `${deposit[key]}`?.replace(
                                /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                                "$1.$2.$3/$4-$5"
                              )
                            : deposit[key] ?? "-"}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}

              {currOption === "payer" &&
                Object.keys(deposit).map((key: string) => {
                  switch (key) {
                    case "payer_account":
                    case "payer_agency":
                    case "payer_bank":
                    case "payer_name":
                      return (
                        deposit[key] !== "N/A" && (
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
                            {deposit[key]}
                          </Descriptions.Item>
                        )
                      );

                    case "payer_document":
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
                          {+`${deposit[key]}`?.replace(/\D/g, "").length === 11
                            ? `${deposit[key]}`?.replace(
                                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                                "$1.$2.$3-$4"
                              )
                            : +`${deposit[key]}`?.replace(/\D/g, "").length ===
                              14
                            ? `${deposit[key]}`?.replace(
                                /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                                "$1.$2.$3/$4-$5"
                              )
                            : deposit[key] ?? "-"}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}

              {currOption === "refund" && Refund && (
                <>
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
                    {Refund?.endToEndId}
                  </Descriptions.Item>
                  <Descriptions.Item
                    key={"buyer_name"}
                    label={t(`table.buyer_name`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {Refund?.buyer_name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    key={"buyer_document"}
                    label={t(`table.buyer_document`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {Refund?.buyer_document}
                  </Descriptions.Item>
                  <Descriptions.Item
                    key={"payer_name"}
                    label={t(`table.payer_name`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {Refund?.payer_name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    key={"payer_document"}
                    label={t(`table.payer_document`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {+`${Refund?.payer_document}`?.replace(/\D/g, "").length ===
                    11
                      ? `${Refund?.payer_document}`?.replace(
                          /(\d{3})(\d{3})(\d{3})(\d{2})/,
                          "$1.$2.$3-$4"
                        )
                      : +`${Refund?.payer_document}`?.replace(/\D/g, "")
                          .length === 14
                      ? `${Refund?.payer_document}`?.replace(
                          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                          "$1.$2.$3/$4-$5"
                        )
                      : Refund?.payer_document ?? "-"}
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
                    {moneyFormatter(Refund?.value || 0)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    key={"reason"}
                    label={t(`table.reason`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {Refund?.reason}
                  </Descriptions.Item>
                  <Descriptions.Item
                    key={"status"}
                    label={t(`table.status`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {t(`table.${Refund?.status?.toLocaleLowerCase()}`)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    key={"created_at"}
                    label={t(`table.created_at`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {`${new Date(
                      Refund?.createdAt
                    ).toLocaleDateString()} ${new Date(
                      Refund?.createdAt
                    ).toLocaleTimeString()}`}
                  </Descriptions.Item>
                  <Descriptions.Item
                    key={"refunded_at"}
                    label={t(`table.refund_date`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    {`${new Date(
                      Refund?.refund_date
                    ).toLocaleDateString()} ${new Date(
                      Refund?.refund_date
                    ).toLocaleTimeString()}`}
                  </Descriptions.Item>
                  {!Refund?.url_pdf ? (
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
                        onClick={() => mutateDepositPaymentVoucher()}
                        loading={isDepositPaymentVoucherLoading}
                      >
                        <FilePdfOutlined />
                        {t(`table.generate_payment_voucher`)}
                      </Button>
                    </Descriptions.Item>
                  ) : (
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
                          window.location.assign(Refund?.url_pdf);
                        }}
                        type="primary"
                      >
                        <DownloadOutlined />
                        {t(`table.download_payment_voucher`)}
                      </Button>
                    </Descriptions.Item>
                  )}
                </>
              )}
            </Descriptions>
          </Grid>
        )}
      </Grid>
    </>
  );
};
