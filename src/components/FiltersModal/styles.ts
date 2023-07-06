import styled from "styled-components";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export const StyledRangePicker = styled(RangePicker)`
 @media(max-width: 576px) { 
  .ant-picker-panels { 
    flex-direction: column;
  } 
}
`;

export const StyleWrapperDatePicker = styled.div`
@media(max-width: 576px) { 
  .ant-picker-panels { 
    flex-direction: column;
    max-height: 200;
  } 
}
`;
