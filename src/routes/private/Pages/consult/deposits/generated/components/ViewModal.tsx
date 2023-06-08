import { Descriptions, Drawer, Spin } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useGetDeposit } from "../../../../../../../services/generatedDeposits/getDeposit";

interface ViewModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  id: string;
}

export const ViewModal = (props: ViewModalProps) => {
  const onClose = () => {
    props.setOpen(false);
  };

  const { deposit, depositError, isDepositFetching } = useGetDeposit(props.id);

  console.log(deposit);

  return (
    <Drawer
      title="Basic Drawer"
      placement="right"
      onClose={onClose}
      open={props.open}
    >
      {isDepositFetching && <Spin />}
      <Descriptions></Descriptions>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
};
