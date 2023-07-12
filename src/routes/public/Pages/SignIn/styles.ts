import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Avatar, Grid } from "@mui/material";
import { Button, Checkbox } from "antd";
import styled from "styled-components";

export const HalfHover = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LockIcon = styled(LockOutlinedIcon)`
  color: #fff;
  font-size: "22px";
`;
export const RoundedLock = styled(Avatar)``;

export const CustomCheckbox = styled(Checkbox)`
  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${(props) => props.theme.colors.secondary};
    border-color: ${(props) => props.theme.colors.secondary};
  }
`;

export const CustButton = styled(Button)`
    width: 100%;
    height: 50px;
`;
