import { useTheme } from "@src/contexts/ThemeContext";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

export const Profile = () => {
  const { theme } = useTheme();
  return (
    <Layout
      style={{
        padding: "24px 24px",
        minHeight: "90vh",
      }}
    >
      <Content
        style={{
          padding: 24,
          margin: 0,
          height: "100%",
          background: theme === "dark" ? "#222222 " : "#fdfdfd",
        }}
      ></Content>
    </Layout>
  );
};
