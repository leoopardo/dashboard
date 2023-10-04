import { useGetOrganizationBankBalance } from "@src/services/consult/organization/bankBalance/getOrganizationBankBalance";
import { useGetOrganizationBankMaintenece } from "@src/services/register/organization/bankMaitenence/getBanks";
import { Avatar, Card, Col, Result, Row, Typography } from "antd";

export const OrganizationBankBalance = () => {
  const {
    OrganizationBankBalance,
    
  } = useGetOrganizationBankBalance();
  const { BankMainteneceData } = useGetOrganizationBankMaintenece({
    limit: 200,
    page: 1,
    sort_field: "label_name",
    sort_order: "DESC",
  });
  return (
    <Row style={{ padding: "25px" }} gutter={[8, 8]}>
      <Col span={24}></Col>
      {OrganizationBankBalance?.banks ? (
        OrganizationBankBalance?.banks?.map((bank) => (
          <Col xs={{ span: 24 }} md={{ span: 6 }}>
            <Card bordered={false}>
              <div>
                <Avatar
                  src={
                    BankMainteneceData?.itens.find(
                      (b) => b.label_name === bank.name
                    )?.icon_url
                  }
                  style={{ marginRight: 8 }}
                />
                {bank.name}
              </div>
              <div>
                <Typography>
                  Total:{" "}
                </Typography>
                
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(bank.value)}
              </div>
              <div>CNPJ: {bank.cnpj.toString().replace(/\D/g, "")}</div>
            </Card>
          </Col>
        ))
      ) : (
        <Col span={24}>
          <Result
          status="404"
          title="400"
          subTitle="Nenhum dado foi encontrado"
        />
        </Col>
        
      )}
    </Row>
  );
};
