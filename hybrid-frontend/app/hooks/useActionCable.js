import React, { useEffect, useMemo } from 'react';
import { createConsumer } from '@rails/actioncable';

export default function useActionCable(url) {
  const actionCable = useMemo(() => createConsumer(url), [url]);

  useEffect(() => {
    return () => {
      console.log('Disconnecting Action Cable');
      actionCable.disconnect();
    };
  }, [actionCable]);

  return { actionCable };
}
