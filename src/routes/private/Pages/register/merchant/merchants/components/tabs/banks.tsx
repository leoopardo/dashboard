/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "@components/Toast";
import { Grid } from "@mui/material";
import { useMerchantBankConfig } from "@services/register/merchant/merchant/bankConfig/getBankConfig";
import { useListBanks } from "@src/services/bank/listBanks";
import { useUpdateBankConfig } from "@src/services/register/merchant/merchant/bankConfig/updateBankConfig";
import { BankQuery } from "@src/services/types/banks.interface";
import { IMerchantBankUpdate } from "@src/services/types/register/merchants/merchantBankConfig.interface";
import {
  Avatar,
  Button,
  Form,
  FormInstance,
  Popconfirm,
  Select,
  Skeleton,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const BanksTab = (props: { id?: string }) => {
  const formRef = useRef<FormInstance>(null);
  const { t } = useTranslation();
  const [body, setBody] = useState<IMerchantBankUpdate | null>(null);
  const [despositBank, setDepositBank] = useState<{ bank: any }>();
  const [withdrawBank, setWithdrawBank] = useState<
    { bank?: string } | undefined
  >();
  const [fastPixBank, setFastPixBank] = useState<
    { bank?: string } | undefined
  >();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { isMerchantBankFetching, merchantBankData, refetchMerchantBankData } =
    useMerchantBankConfig(props.id);

  const { UpdateBankError, UpdateBankIsSuccess, UpdateMutate } =
    useUpdateBankConfig(body);
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
    sort_order: "ASC",
    sort_field: "label_name",
  } as BankQuery);

  useEffect(() => {
    setBody((state: any) => ({
      ...state,
      cash_in_bank: despositBank?.bank,
      cash_out_bank: withdrawBank?.bank,
      fastpix_in_bank: fastPixBank?.bank,
    }));
  }, [despositBank, withdrawBank, fastPixBank]);

  useEffect(() => {
    setBody((state: any) => ({
      ...state,
      merchants_ids: [Number(props?.id)],
      cash_in_bank: merchantBankData?.merchantConfig?.cash_in_bank,
      cash_out_bank: merchantBankData?.merchantConfig?.cash_out_bank,
      fastpix_in_bank:
        merchantBankData?.merchantConfig?.fastpix_in_bank ?? undefined,
    }));

    setDepositBank({ bank: merchantBankData?.merchantConfig?.cash_in_bank });
    setWithdrawBank({ bank: merchantBankData?.merchantConfig?.cash_out_bank });
    setFastPixBank({ bank: merchantBankData?.merchantConfig?.fastpix_in_bank });
  }, [merchantBankData]);

  useEffect(() => {
    refetchMerchantBankData();
  }, [UpdateBankIsSuccess]);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={merchantBankData ? merchantBankData : {}}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography>
            {t("input.deposit_bank")}:{" "}
            {merchantBankData?.merchantConfig?.cash_in_bank &&
            !isMerchantBankFetching ? (
              <Typography.Text strong>
                {isMerchantBankFetching ? (
                  <Skeleton avatar />
                ) : (
                  <Avatar
                    src={
                      bankListData?.itens.find(
                        (bank) =>
                          bank.bank ===
                          merchantBankData?.merchantConfig?.cash_in_bank
                      )?.icon_url
                    }
                  />
                )}{" "}
                {
                  bankListData?.itens.find(
                    (bank) =>
                      bank.bank ===
                      merchantBankData?.merchantConfig?.cash_in_bank
                  )?.label_name
                }
              </Typography.Text>
            ) : (
              <Typography.Text strong>{t("table.unassigned")}</Typography.Text>
            )}
          </Typography>
          <Typography style={{ marginTop: 10 }}>
            {t("input.withdraw_bank")}:{" "}
            {merchantBankData?.merchantConfig?.cash_out_bank ? (
              <Typography.Text strong>
                <Avatar
                  src={
                    bankListData?.itens.find(
                      (bank) =>
                        bank.bank ===
                        merchantBankData?.merchantConfig?.cash_out_bank
                    )?.icon_url
                  }
                />{" "}
                {
                  bankListData?.itens.find(
                    (bank) =>
                      bank.bank ===
                      merchantBankData?.merchantConfig?.cash_out_bank
                  )?.label_name
                }
              </Typography.Text>
            ) : (
              <Typography.Text strong>{t("table.unassigned")}</Typography.Text>
            )}
          </Typography>
          <Typography style={{ marginTop: 10 }}>
            {t("input.fastpix_in_bank")}:{" "}
            {merchantBankData?.merchantConfig?.fastpix_in_bank ? (
              <Typography.Text strong>
                <Avatar
                  src={
                    bankListData?.itens.find(
                      (bank) =>
                        bank.bank ===
                        merchantBankData?.merchantConfig?.fastpix_in_bank
                    )?.icon_url
                  }
                />{" "}
                {
                  bankListData?.itens.find(
                    (bank) =>
                      bank.bank ===
                      merchantBankData?.merchantConfig?.fastpix_in_bank
                  )?.label_name
                }
              </Typography.Text>
            ) : (
              <Typography.Text strong>{t("table.unassigned")}</Typography.Text>
            )}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Form.Item label={t("input.deposit_bank")}>
            <Select
              size="large"
              value={despositBank?.bank}
              options={
                bankListData?.itens
                  ?.filter((bank) => bank?.cash_in && bank.status)
                  ?.map((item, index) => {
                    return {
                      key: index,
                      value: item.bank,
                      label: (
                        <>
                          <Avatar
                            src={item.icon_url}
                            style={{ marginRight: 10 }}
                          />
                          {item.label_name}
                        </>
                      ),
                    };
                  }) ?? []
              }
              onChange={(value) => setDepositBank({ bank: value })}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Form.Item label={t("input.withdraw_bank")}>
            <Select
              size="large"
              value={withdrawBank?.bank}
              options={
                bankListData?.itens
                  ?.filter((bank) => bank?.cash_out && bank.status)
                  ?.map((item, index) => {
                    return {
                      key: index,
                      value: item.bank,
                      label: (
                        <>
                          <Avatar
                            src={item.icon_url}
                            style={{ marginRight: 10 }}
                          />
                          {item.label_name}
                        </>
                      ),
                    };
                  }) ?? []
              }
              onChange={(value) => setWithdrawBank({ bank: value })}
            />
          </Form.Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Form.Item label={t("input.fastpix_in_bank")}>
            <Select
              size="large"
              value={fastPixBank?.bank}
              options={
                bankListData?.itens
                  ?.filter((bank) => bank?.fastpix_in && bank.status)
                  .map((item, index) => {
                    return {
                      key: index,
                      value: item.bank,
                      label: (
                        <>
                          <Avatar
                            src={item.icon_url}
                            style={{ marginRight: 10 }}
                          />
                          {item.label_name}
                        </>
                      ),
                    };
                  }) ?? []
              }
              onChange={(value) => setFastPixBank({ bank: value })}
            />
          </Form.Item>
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        style={{ display: "flex", flexDirection: "row-reverse" }}
      >
        <Grid item xs={12} md={4} lg={4}>
          <Popconfirm
            title={t("messages.confirm_action_title", {
              action: t("messages.update"),
            })}
            description={t("messages.are_you_sure", {
              action: t("messages.update"),
              itens: t("menus.general_configs").toLowerCase(),
            })}
            open={isConfirmOpen}
            style={{ maxWidth: "340px" }}
            onConfirm={() => {
              UpdateMutate();
              setIsConfirmOpen(false);
            }}
            okButtonProps={{ loading: isMerchantBankFetching }}
            okText={t("messages.yes_update")}
            cancelText={t("messages.no_cancel")}
            onCancel={() => setIsConfirmOpen(false)}
          >
            <Button
              size="large"
              type="primary"
              style={{ width: "100%" }}
              loading={isMerchantBankFetching}
              onClick={() => setIsConfirmOpen(true)}
            >
              {t("buttons.update_general_configs")}
            </Button>
          </Popconfirm>
        </Grid>
      </Grid>
      <Toast
        actionSuccess={t("messages.updated")}
        actionError={t("messages.update")}
        error={UpdateBankError}
        success={UpdateBankIsSuccess}
      />
    </Form>
  );
};
