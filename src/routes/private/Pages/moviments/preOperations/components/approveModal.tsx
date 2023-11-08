import { Dispatch, SetStateAction, useState, FC } from 'react';
import { FileAddOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, notification } from 'antd';
import { useTranslation } from 'react-i18next';

interface IProp {
  setIsValidateTokenOpen: Dispatch<SetStateAction<boolean>>
  reset: () => void
  loading: boolean
  disabled: boolean
}

export const ApproveModal: FC<IProp> = ({ setIsValidateTokenOpen, loading, disabled, reset }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [, contextHolder] = notification.useNotification();

  return (
    <Popconfirm
      title={t('titles.operation_approve')}
      description={t('messages.operation_approve')}
      onConfirm={() => {
        setIsValidateTokenOpen(true);
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
      open={open}
      okText={t('messages.yes_confirm')}
      cancelText={t('messages.no_cancel')}
      placement="bottom"
    >
      {contextHolder}
      <Tooltip placement="topRight" title={t('titles.operation_approve')} arrow>
        <Button
          disabled={disabled}
          style={{ width: '100%' }}
          size="large"
          type="default"
          shape="round"
          block
          onClick={() => {
            reset()
            setOpen(true)
          }}
          loading={loading}
        >
          {!loading && <FileAddOutlined style={{ fontSize: 22 }} />} Aprovar
        </Button>
      </Tooltip>
    </Popconfirm>
  );
};
