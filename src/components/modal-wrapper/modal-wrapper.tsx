import { FC, memo, useEffect, useState } from 'react';
import { ModalWrapperUI } from '../ui/modal-wrapper';
import { TWrapper } from './type';
import { useLocation } from 'react-router-dom';

export const ModalWrapper: FC<TWrapper> = memo(({ title, children }) => {
  const location = useLocation();
  const [titleStyle, setTitleStyle] = useState('text_type_main-large');

  useEffect(() => {
    if (/feed|profile/i.test(location.pathname)) {
      setTitleStyle('text_type_digits-default');
    }
  }, []);

  return (
    <>
      <ModalWrapperUI
        title={title}
        titleStyle={titleStyle}
        children={children}
      />
    </>
  );
});
