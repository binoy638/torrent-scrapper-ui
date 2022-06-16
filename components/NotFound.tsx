import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { Text } from '@mantine/core';
import React, { FC } from 'react';

interface NotFoundProps {
  title: string;
}

const NotFound: FC<NotFoundProps> = ({ title }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex-col justify-center items-center ">
        <ExclamationCircleIcon className="h-48 w-48 " />
        <Text size="xl" weight={'bold'} align={'center'}>
          {title}
        </Text>
      </div>
    </div>
  );
};

export default NotFound;
