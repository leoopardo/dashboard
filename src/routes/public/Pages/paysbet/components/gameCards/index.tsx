import { Card, Col } from "antd";
import Meta from "antd/es/card/Meta";
import { motion } from "framer-motion";

interface IGameCard {
  name: string;
  banner: string;
}

export const GameCard = ({ banner, name }: IGameCard) => {
  return (
    <Col>
      <Card
        hoverable
        style={{ width: 240, maxWidth: "240px", overflow: "hidden" }}
        cover={
          <motion.img
            whileHover={{ scale: 1.2 }}
            alt="example"
            src={banner}
            style={{ filter: "blur(2px)", height: "150px" }}
          />
        }
      >
        <Meta title={name} />
      </Card>
    </Col>
  );
};
