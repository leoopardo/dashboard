import { Col, Row } from "antd";
import { useMediaQuery } from "react-responsive";
import Gif from "../../../../assets/gifPaybrokers.gif";

export const Banner = () => {
  const isEven200 = useMediaQuery({ maxHeight: "500px" });
  return (
    <Row
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#042645",
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
          src={Gif}
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
