function IconSearch(props) {
  return (
    <svg
      fill="#FFFFFF" // Thiết lập màu của icon là màu trắng
      viewBox="0 0 24 24" // Điều chỉnh viewBox cho phù hợp
      height="1em"
      width="1em"
      {...props}
      style={{
        backgroundColor: "#8A2BE2", // Thiết lập màu nền tím
        borderRadius: "50%", // Làm tròn viền để tạo hình tròn
        padding: "2px", // Thêm padding để icon không chạm vào viền
      }}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M15.5 14h-.79l-.28-.27a6.51 6.51 0 001.07-7.03c-.05-.1-.11-.19-.17-.28.4-.41.64-1 .64-1.62a2.5 2.5 0 00-2.5-2.5c-.62 0-1.21.24-1.62.64-.09-.06-.18-.12-.28-.17a6.51 6.51 0 00-7.03 1.07l-.27-.28v-.79L5 5.5V3h2v2h2V4h-1V3h2v1h-1v1l.27.28c1.33-1.01 3.14-1.23 4.71-.65 1.56.57 2.85 1.85 3.42 3.42.58 1.57.36 3.38-.65 4.71l.28.27h1V13h-2v2h2v-1h1v-2h-1.5zm-6 0a5 5 0 110-10 5 5 0 010 10z" />
    </svg>
  );
}

export default IconSearch;
