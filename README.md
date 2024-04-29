## Hướng dẫn chạy web:

Tạo branch tên "backend-dev" để code phần Backend cho FastAPI. Mọi file backend cần thiết đều phải nằm trong thư mục **nextjs-fastapi\api** (code vào file index.py). Code xong thì commit và pull request, sau đó tui sẽ merge vs code ở branch main r làm FE.

**Lưu ý**: Nextjs đã config sẵn FastAPI chạy ở port 8000, và họ đã map nó vào đường dẫn "localhost:3000/api". Vì vậy để code BE, đầu tiên clone repo, rồi chạy `npm install`, sau đó nếu cần debug api trong quá trình code thì chạy `npm run fastapi-dev` (tương đương với việc chạy "python index.py" nhưng người ta đã config cho nó thành npm command), hoặc nếu muốn xem api trên web thì chạy `npm run dev` rồi vào path "/api".

Nếu muốn debug kĩ hơn thì có thể vào `localhost:8000/docs` để test các GET/POST request có hoạt động đúng ý không, cũng như xem các error messsage trực quan hơn (vì output trên terminal của FastAPI rất tối nghĩa).

## Hướng dẫn tạo database

1. Cài đặt MySQL (Server, client command line)

2. Tạo tài khoản và database với thông tin như sau:
- Username: root
- Mật khẩu: 1234
- database name: mooccubex
- port: 3306 (default)

3. Mở Client command line và chạy lệnh:
```
charset utf8mb4;

source abosulte/path/to/database-preperation/sql-files/
create_table.sql

source abosulte/path/to/database-preperation/sql-files/
insert_datadata.sql
```