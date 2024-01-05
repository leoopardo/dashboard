import { ReloadOutlined } from "@ant-design/icons";
import { useListBanks } from "@src/services/bank/listBanks";
import { queryClient } from "@src/services/queryClient";
import { Button, Col, Row } from "antd";
import { BankCard } from "./components/bankCard";

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
      <Col span={24} style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Button
          shape="circle"
          type="link"
          loading={isBankListFetching}
          onClick={() => queryClient.invalidateQueries()}
          icon={<ReloadOutlined />}
        ></Button>
      </Col>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          flexWrap: "wrap",
          marginTop: -60
        }}
        gutter={[16, 16]}
      >
        {bankListData?.itens.map((bank) => (
          <BankCard bank={bank} />
        ))}
      </Row>
    </Row>
  );
};
