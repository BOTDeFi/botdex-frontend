import { notification } from 'antd';
import { ArgsProps } from 'antd/lib/notification';

import 'antd/lib/notification/style/css';

export default notification;

export const successNotification = (
  title: string,
  description?: string,
  ...props: ArgsProps[]
): void => {
  notification.success({
    message: title,
    description,
    ...props,
  });
};

export const errorNotification = (
  title: string,
  description?: string,
  ...props: ArgsProps[]
): void => {
  notification.error({
    message: title,
    description,
    ...props,
  });
};
