/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row } from "antd";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import Gif from "../../../../assets/gif-branca.gif";
import Gif2 from "../../../../assets/gif-colorido.gif";
import Gif3 from "../../../../assets/gif-natal.gif";

export const Banner = () => {
  const isEven200 = useMediaQuery({ maxHeight: "500px" });
  const { number } = useParams();
  const gifLists: any = {
    "1": Gif,
    "2": Gif2,
    "3": Gif3,
  };
  return (
    <Row
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: number === "2" ? "#fff" : "#042645",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: isEven200 ? "-30vh" : undefined,
        }}
      >
        <img
          src={gifLists[number as any]}
          style={{
            maxHeight: "180vh",
            maxWidth: "180vw",
          }}
        />
      </Col>
      {/* <motion.div
        initial={{ width: "100%", opacity: 0.7 }}
        animate={{
          opacity: 1,
          transition: { repeatType: "reverse", repeat: 10000, duration: 1 },
        }}
        style={{
          position: "fixed",
          top: "65vh",
          left: "25vw",
          overflow: "hidden",
        }}
      >
        <Typography.Title style={{ wordBreak: "keep-all", width: "500px" }}>
          Pagamento com segurança
        </Typography.Title>
      </motion.div> */}
    </Row>
  );
};
