## Hướng dẫn:

Tạo branch tên "backend-dev" để code phần Backend cho FastAPI. Mọi file backend cần thiết đều phải nằm trong thư mục **nextjs-fastapi\api** (code vào file index.py). Code xong thì commit và pull request, sau đó tui sẽ merge vs code ở branch main r làm FE.

**Lưu ý**: Nextjs đã config sẵn FastAPI chạy ở port 8000, và họ đã map nó vào đường dẫn "localhost:3000/api". Vì vậy để code BE, đầu tiên clone repo, rồi chạy `npm install`, sau đó nếu cần debug api trong quá trình code thì chạy `npm run fastapi-dev` (tương đương với việc chạy "python index.py" nhưng người ta đã config cho nó thành npm command), hoặc nếu muốn xem api trên web thì chạy `npm run dev` rồi vào path "/api".

Nếu muốn debug kĩ hơn thì có thể vào `localhost:8000/docs` để test các GET/POST request có hoạt động đúng ý không, cũng như xem các error messsage trực quan hơn (vì output trên terminal của FastAPI rất tối nghĩa).
