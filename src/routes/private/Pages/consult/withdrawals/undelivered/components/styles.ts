import { Segmented } from "antd";
import styled from "styled-components";

export const StyledSegmented = styled(Segmented)`
background-color: ${(props) => props.theme.colors.primary};
color: #fff;
border-radius: 0;

&:hover {
    color: #fff;
}
`