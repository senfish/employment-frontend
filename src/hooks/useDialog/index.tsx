import React, { cloneElement, useCallback } from 'react';

export interface UseDialogProps {
  closeDialog: () => void;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDialog = <T,>(Component) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detailRef = React.useRef<any>({});
  const open = useCallback((detail: T) => {
    detailRef.current = detail;
    setVisible(true);
  }, []);
  const closeDialog = () => {
    setVisible(false);
  };
  const node = cloneElement(<Component />, {
    visible,
    setVisible,
    closeDialog,
    ...detailRef.current,
  });
  const holder = React.useMemo(() => {
    if (visible) {
      return node;
    }
    return null;
  }, [visible]);
  return { open, closeDialog, holder };
};
