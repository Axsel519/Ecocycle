import API from "./api";

// مثال لدالة تسجيل الدخول
export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

// مثال لدالة جلب البيانات
export const getItems = async () => {
  const response = await API.get("/items");
  return response.data;
};
