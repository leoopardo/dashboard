/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Grid } from "@mui/material";
import { Toast } from "@src/components/Toast";
import { useGetRowsGeneratedDeposits } from "@src/services/consult/deposits/generatedDeposits/getRows";
import { useCreateDepositPaymentVoucherRefund } from "@src/services/consult/refund/refundDeposits/generatePaymentVoucher";
import { useGetRefund } from "@src/services/consult/refund/refundDeposits/getRefund";
import { useCreatePaymentVoucherRefund } from "@src/services/consult/refund/refundDepositsManual/generatePaymentVoucher";
import { useGetRefundManualOne } from "@src/services/consult/refund/refundDepositsManual/getRefund";
import { useGetRefundWithdrawOne } from "@src/services/consult/refund/refundWithdrawals/getRefund";
import { defaultTheme } from "@src/styles/defaultTheme";
import { moneyFormatter } from "@src/utils/moneyFormatter";
import { Button, Descriptions, Segmented, Spin, Typography } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  item: any;
  type: "Refund" | "manual" | "withdraw";
}

export const ViewModalFields = (props: ViewModalProps) => {
  const { t } = useTranslation();
  const { Refund, isRefundFetching } = useGetRefund(props?.item?._id);
  const { RefundWithdraw } = useGetRefundWithdrawOne(props?.item?._id);
  const { RefundManual } = useGetRefundManualOne(props?.item?.endToEndId);
  const {
    mutatePaymentVoucher,
    isPaymentVoucherLoading,
    PaymentVoucherError,
    isPaymentVoucherSuccess,
  } = useCreatePaymentVoucherRefund(props?.item?.endToEndId);
  const { mutateDepositPaymentVoucher, isDepositPaymentVoucherLoading } =
    useCreateDepositPaymentVoucherRefund(props?.item?.endToEndId);
  const [currOption, setCurrOption] = useState<any>("transaction");
  const { depositsRows, refetchDepositsTotalRows } =
    useGetRowsGeneratedDeposits({
      initial_date: undefined,
      pix_id: props?.item?.pix_id,
    });

  const types: any = {
    Refund: [
      { label: t("table.transaction"), value: "transaction" },
      {
        label: t("table.origin_transaction"),
        value: "origin",
        disabled: !depositsRows?.items[0],
      },
    ],
    withdraw: [
      { label: t("table.transaction"), value: "transaction" },
      {
        label: t("table.origin_transaction"),
        value: "origin",
        disabled: !depositsRows?.items[0],
      },
    ],
    manual: [{ label: t("table.transaction"), value: "transaction" }],
  };

  useEffect(() => {
    refetchDepositsTotalRows();
  }, [Refund]);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Segmented
            block
            size="middle"
            style={{ width: "100%" }}
            value={currOption}
            options={(types as any)[props.type]}
            onChange={(value: any) => {
              setCurrOption(value);
            }}
          />
        </Grid>{" "}
        {isRefundFetching && <Spin />}{" "}
        {props.type === "Refund" && Refund && (
          <Grid xs={12}>
            {currOption === "transaction" && (
              <Descriptions
                bordered
                style={{ margin: 0, padding: 0 }}
                column={1}
              >
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
                  {Refund?.bank ?? "-"}
                </Descriptions.Item>
                {Refund?.endToEndId && (
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
                    <Typography.Text copyable>
                      {Refund?.endToEndId}
                    </Typography.Text>
                  </Descriptions.Item>
                )}
                {Refund?.txid && (
                  <Descriptions.Item
                    key={"rtrId"}
                    label={t(`table.txid`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    <Typography.Text copyable>{Refund?.txid}</Typography.Text>
                  </Descriptions.Item>
                )}
                {Refund?.rtrId && (
                  <Descriptions.Item
                    key={"rtrId"}
                    label={t(`table.refund_id`)}
                    labelStyle={{
                      maxWidth: "120px !important",
                      margin: 0,
                      padding: 0,
                      textAlign: "center",
                    }}
                  >
                    <Typography.Text copyable>{Refund?.rtrId}</Typography.Text>
                  </Descriptions.Item>
                )}

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
                  {Refund?.payer_name ?? "-"}
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
                  {moneyFormatter(Number(Refund?.value) || 0)}
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
                  key={"partner_name"}
                  label={t(`table.partner_name`)}
                  labelStyle={{
                    maxWidth: "120px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {Refund?.partner_name ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"merchant_name"}
                  label={t(`table.merchant_name`)}
                  labelStyle={{
                    maxWidth: "120px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {Refund?.merchant_name ?? "-"}
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
                  {Refund?.reason ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item
                  key={"createdAt"}
                  label={t(`table.createdAt`)}
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
                {Refund?.refund_date && (
                  <Descriptions.Item
                    key={"refund_date"}
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
                )}

                {!Refund?.url_pdf && Refund.status === "REFUNDED" ? (
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
                  Refund?.url_pdf &&
                  Refund.status === "REFUNDED" && (
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
                  )
                )}
              </Descriptions>
            )}
          </Grid>
        )}
        {props.type === "manual" && RefundManual && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
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
                {RefundManual?.bank ?? "-"}
              </Descriptions.Item>
              {Refund?.endToEndId && (
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
                  <Typography.Text copyable>
                    {Refund?.endToEndId}
                  </Typography.Text>
                </Descriptions.Item>
              )}

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
                {RefundManual?.payer_name ?? "-"}
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
                {+`${RefundManual?.payer_document}`?.replace(/\D/g, "")
                  .length === 11
                  ? `${RefundManual?.payer_document}`?.replace(
                      /(\d{3})(\d{3})(\d{3})(\d{2})/,
                      "$1.$2.$3-$4"
                    )
                  : +`${RefundManual?.payer_document}`?.replace(/\D/g, "")
                      .length === 14
                  ? `${RefundManual?.payer_document}`?.replace(
                      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                      "$1.$2.$3/$4-$5"
                    )
                  : RefundManual?.payer_document ?? "-"}
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
                {moneyFormatter(Number(RefundManual?.value) || 0)}
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
                {t(`table.${RefundManual?.status?.toLocaleLowerCase()}`)}
              </Descriptions.Item>

              <Descriptions.Item
                key={"createdAt"}
                label={t(`table.createdAt`)}
                labelStyle={{
                  maxWidth: "120px !important",
                  margin: 0,
                  padding: 0,
                  textAlign: "center",
                }}
              >
                {`${new Date(
                  RefundManual?.createdAt
                ).toLocaleDateString()} ${new Date(
                  RefundManual?.createdAt
                ).toLocaleTimeString()}`}
              </Descriptions.Item>
              {RefundManual?.refund_date && (
                <Descriptions.Item
                  key={"refund_date"}
                  label={t(`table.refund_date`)}
                  labelStyle={{
                    maxWidth: "120px !important",
                    margin: 0,
                    padding: 0,
                    textAlign: "center",
                  }}
                >
                  {`${new Date(
                    RefundManual?.refund_date
                  ).toLocaleDateString()} ${new Date(
                    RefundManual?.refund_date
                  ).toLocaleTimeString()}`}
                </Descriptions.Item>
              )}

              {!RefundManual?.url_pdf ? (
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
                    onClick={() => mutatePaymentVoucher()}
                    loading={isPaymentVoucherLoading}
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
                      window.location.assign(RefundManual?.url_pdf);
                    }}
                    type="primary"
                  >
                    <DownloadOutlined />
                    {t(`table.download_payment_voucher`)}
                  </Button>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Grid>
        )}
        {props.type === "withdraw" && RefundWithdraw && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {currOption === "transaction" &&
                Object.keys(RefundWithdraw).map((key: string) => {
                  switch (key) {
                    case "createdAt":
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
                            RefundWithdraw[key]
                          ).toLocaleDateString()} ${new Date(
                            RefundWithdraw[key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "_id":
                    case "merchant_name":
                    case "bank":
                    case "receiver_name":
                      return (
                        RefundWithdraw[key] !== "N/A" && (
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
                            {RefundWithdraw[key]}
                          </Descriptions.Item>
                        )
                      );
                    case "status":
                      return (
                        RefundWithdraw[key] !== "N/A" && (
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
                            <Typography.Title
                              level={5}
                              style={{
                                color: (defaultTheme.colors as any)[
                                  RefundWithdraw[key].toLocaleLowerCase()
                                ],
                              }}
                            >
                              {t(
                                `table.${RefundWithdraw[
                                  key
                                ].toLocaleLowerCase()}`
                              )}
                            </Typography.Title>
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
                          {+`${RefundWithdraw[key]}`?.replace(/\D/g, "")
                            .length === 11
                            ? `${RefundWithdraw[key]}`?.replace(
                                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                                "$1.$2.$3-$4"
                              )
                            : +`${RefundWithdraw[key]}`?.replace(/\D/g, "")
                                .length === 14
                            ? `${RefundWithdraw[key]}`?.replace(
                                /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                                "$1.$2.$3/$4-$5"
                              )
                            : RefundWithdraw[key] ?? "-"}
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
                          {moneyFormatter(Number(RefundWithdraw[key]) || 0)}
                        </Descriptions.Item>
                      );

                    default:
                      return;
                  }
                })}
            </Descriptions>
          </Grid>
        )}
        {depositsRows?.items[0] && (
          <Grid xs={12}>
            <Descriptions bordered style={{ margin: 0, padding: 0 }} column={1}>
              {currOption === "origin" &&
                Object.keys(depositsRows?.items[0]).map((key: string) => {
                  switch (key) {
                    case "createdAt":
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
                            depositsRows?.items[0][key]
                          ).toLocaleDateString()} ${new Date(
                            depositsRows?.items[0][key]
                          ).toLocaleTimeString()}`}
                        </Descriptions.Item>
                      );
                    case "_id":
                    case "merchant_name":
                    case "bank":
                    case "buyer_name":
                      return (
                        depositsRows?.items[0][key] !== "N/A" && (
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
                            {depositsRows?.items[0][key]}
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
                          {+`${depositsRows?.items[0][key]}`?.replace(/\D/g, "")
                            .length === 11
                            ? `${depositsRows?.items[0][key]}`?.replace(
                                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                                "$1.$2.$3-$4"
                              )
                            : +`${depositsRows?.items[0][key]}`?.replace(
                                /\D/g,
                                ""
                              ).length === 14
                            ? `${depositsRows?.items[0][key]}`?.replace(
                                /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                                "$1.$2.$3/$4-$5"
                              )
                            : depositsRows?.items[0][key] ?? "-"}
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
                          {moneyFormatter(
                            Number(depositsRows?.items[0][key]) || 0
                          )}
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
      <Toast
        actionSuccess={t("messages.generate_voucher")}
        actionError={t("messages.generated_voucher")}
        error={PaymentVoucherError}
        success={isPaymentVoucherSuccess}
      />
    </>
  );
};
