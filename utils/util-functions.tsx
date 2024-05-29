// Hàm hiển thị giá trị của trường, hoặc "null" nếu trường là null
export const renderFieldValue = (value: any): any | "null" => {
  return value !== null ? value : "null";
};
