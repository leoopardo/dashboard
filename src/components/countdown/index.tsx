/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { WarningOutlined } from "@ant-design/icons";
import { Container } from "@mui/material";
import { Tag } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface countdowProps {
  success: any;
  quantSeconds: number | null | undefined;
}

function Countdown({ success, quantSeconds }: countdowProps) {
  const { t } = useTranslation();
  const [remainingTime, setRemainingTime] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const deadline: any = new Date();
    deadline.setSeconds(deadline.getSeconds() + quantSeconds || 600);
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance <= 0) {
        clearInterval(intervalId);
      } else {
        const remaining = {
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [success]);

  return (
    <Container>
      
      <Tag icon={<WarningOutlined />} color="error">
        {remainingTime &&
          !(remainingTime?.minutes === 0 && remainingTime?.seconds === 0) && (
            <>
              {`${t("modal.token_expires_in")}: ${remainingTime.minutes}:
              ${
                remainingTime.seconds < 10
                  ? `0${remainingTime.seconds}`
                  : remainingTime.seconds
              }
              `}
            </>
          )}
        {remainingTime?.minutes === 0 && remainingTime?.seconds === 0 && (
          <>{t("messages.token_expired")}</>
        )}
      </Tag>
    </Container>
  );
}

export default Countdown;
