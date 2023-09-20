/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable valid-typeof */
/* eslint-disable no-plusplus */
import { BankOutlined } from "@ant-design/icons";
import { useListBanks } from "@src/services/bank/listBanks";
import { useGetmerchantFeeRegister } from "@src/services/register/merchant/feePlans/getMerchantFees";
import { Avatar, Descriptions, Drawer, Spin, Tooltip } from "antd";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface viewProps {
  modalName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  item: any;
}

export const ViewMerchantModal = ({
  open,
  setOpen,
  modalName,
  loading,
  item,
}: viewProps) => {
  const { t } = useTranslation();

  const { merchantFeeData } = useGetmerchantFeeRegister({
    merchant_id: item.id,
  });
  const { bankListData } = useListBanks({
    limit: 200,
    page: 1,
  })
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
        <Descriptions.Item
          label={t("table.id")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.id ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.organization_id")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.organization_id ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.name")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.name ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.domain")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.domain ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.email")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.email ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.cellphone")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.cellphone ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.cnpj")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.cnpj ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.v3_id")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.v3_id ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.status")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.status ? t("table.active") : t("table.inactive")}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.aggregator_name")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.aggregator?.name ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.partner")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.partner?.name ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.operator_name")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {item?.operator?.name ?? "-"}
        </Descriptions.Item>
        {merchantFeeData && <Descriptions.Item
          label={t("table.deposit_fee")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {merchantFeeData?.fees?.cashin_pix_fee_percent
            ? `${merchantFeeData.fees?.cashin_pix_fee_percent}%`
            : "-"}
        </Descriptions.Item>}
        {merchantFeeData && <Descriptions.Item
          label={t("table.fee_withdraw")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {merchantFeeData?.fees?.merchant_withdraw_fee_percent
            ? `${merchantFeeData?.fees?.merchant_withdraw_fee_percent}%`
            : "-"}
        </Descriptions.Item>}
        {merchantFeeData && <Descriptions.Item
          label={t("table.pix_refund_fee")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {merchantFeeData?.fees?.pix_refund_fee_percent
            ? `${merchantFeeData?.fees?.pix_refund_fee_percent}%`
            : "-"}
        </Descriptions.Item>}
        <Descriptions.Item
          label={t("table.under_age_verify")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {t(`table.${item?.merchantConfig?.under_age_verify}`)}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.cash_in_bank")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          <Tooltip
            placement="topLeft"
            title={item?.merchantConfig?.cash_in_bank}
            arrow
          >
            <Avatar
              src={
                bankListData?.itens.find(
                  (bank) => bank?.bank === item?.merchantConfig?.cash_in_bank
                )?.icon_url ?? null
              }
              size="large"
              shape="square"
            >
              <BankOutlined />
            </Avatar>
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.cash_out_bank")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          <Tooltip
            placement="topLeft"
            title={item?.merchantConfig?.cash_out_bank}
            arrow
          >
            <Avatar
              src={
                bankListData?.itens.find(
                  (bank) => bank?.bank === item?.merchantConfig?.cash_out_bank
                )?.icon_url ?? null
              }
              size="large"
              shape="square"
            >
              <BankOutlined />
            </Avatar>
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.createdAt")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {`${new Date(item?.created_at).toLocaleDateString()} ${new Date(
            item?.created_at
          ).toLocaleTimeString()}`}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("table.updatedAt")}
          labelStyle={{
            maxWidth: "120px !important",
            margin: 0,
            padding: 0,
            textAlign: "center",
          }}
        >
          {`${new Date(item?.updated_at).toLocaleDateString()} ${new Date(
            item?.updated_at
          ).toLocaleTimeString()}`}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};
