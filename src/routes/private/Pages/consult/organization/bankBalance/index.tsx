import { useListBanks } from "@src/services/bank/listBanks";
import { Button, Col, Row } from "antd";
import { BankCard } from "./components/bankCard";
import { ReloadOutlined } from "@ant-design/icons";
import { useGetBankBalance } from "@src/services/consult/organization/bankBalance/getBankBalance";
import { queryClient } from "@src/services/queryClient";

export const OrganizationBankBalance = () => {
  const { bankListData, isBankListFetching } = useListBanks({
    limit: 200,
    page: 1,
  });

  return (
    <Row
      style={{ padding: "25px", display: "flex", justifyContent: "center" }}
      gutter={[16, 16]}
    >
      <Col span={24} style={{display: "flex", flexDirection: "row-reverse"}}>
        <Button
          shape="circle"
          loading={isBankListFetching}
          onClick={() => queryClient.invalidateQueries()}
        >
          {!isBankListFetching && <ReloadOutlined />}
        </Button>
      </Col>
      {bankListData?.itens.map((bank) => (
        <BankCard bank={bank} />
      ))}
    </Row>
  );
};
