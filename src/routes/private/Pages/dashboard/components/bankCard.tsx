import { BankItem } from "@src/services/types/banks.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Card, Col, Statistic, Tooltip, Typography } from "antd";
import { motion } from "framer-motion";

interface BankcardInterface {
  bank?: BankItem;
}

export const BankCard = ({ bank }: BankcardInterface) => {
  return (
    <Col xs={{ span: 24 }} md={{ span: 4 }}>
      <Card
        headStyle={{ padding: 0 }}
        bordered={false}
        title={
          <Tooltip title={bank?.label_name} placement="right">
            <motion.div
              animate={{
                backgroundImage: [
                  `linear-gradient(#5a5a5acc, ${defaultTheme.colors.primary}), url(${bank?.icon_url})`,
                  `linear-gradient(${defaultTheme.colors.primary}, #5a5a5acc), url(${bank?.icon_url})`,
                ],
                transition: {
                  duration: 4,
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  type: "keyframes",
                },
              }}
              style={{
                width: "100%",
                height: "80px",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                padding: 0,
                margin: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              <Typography.Title level={3} style={{ color: "#fff" }}>
                {bank?.label_name}
              </Typography.Title>
            </motion.div>
          </Tooltip>
        }
      >
        <Statistic
          title="Total"
          value={7325256.32}
          precision={2}
          prefix="R$"
          valueStyle={{
            fontSize: "16px",
          }}
        />
        <Statistic
          title="Valor bloqueado"
          value={7325256.32}
          precision={2}
          prefix="R$"
          valueStyle={{
            fontSize: "14px",
            color: defaultTheme.colors.error,
          }}
        />
      </Card>
    </Col>
  );
};
