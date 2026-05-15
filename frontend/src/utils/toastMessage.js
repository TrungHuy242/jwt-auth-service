export const getErrorMessage = (error, fallback = "Có lỗi xảy ra") => {
  return (
    error?.message ||
    error?.data?.message ||
    error?.data?.error ||
    fallback
  );
};

export const getSuccessMessage = (response, fallback = "Thao tác thành công") => {
  return response?.message || fallback;
};
