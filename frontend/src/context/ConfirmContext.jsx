import { createContext, useContext, useState } from "react";

const ConfirmContext = createContext(null);

const defaultOptions = {
  title: "Xác nhận thao tác",
  message: "Bạn có chắc muốn thực hiện thao tác này không?",
  confirmText: "Xác nhận",
  cancelText: "Hủy",
  type: "default",
};

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    options: defaultOptions,
    resolve: null,
  });

  const confirm = (options = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options: {
          ...defaultOptions,
          ...options,
        },
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    if (confirmState.resolve) {
      confirmState.resolve(true);
    }

    setConfirmState({
      isOpen: false,
      options: defaultOptions,
      resolve: null,
    });
  };

  const handleCancel = () => {
    if (confirmState.resolve) {
      confirmState.resolve(false);
    }

    setConfirmState({
      isOpen: false,
      options: defaultOptions,
      resolve: null,
    });
  };

  return (
    <ConfirmContext.Provider
      value={{
        confirm,
        confirmState,
        handleConfirm,
        handleCancel,
      }}
    >
      {children}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }

  return context;
}
