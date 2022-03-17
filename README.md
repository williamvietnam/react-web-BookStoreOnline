# final-year-project

#### Cách chạy project ####

B1: Cài nodejs
B2: Clone project về máy
B3: Cài docker & docker-compose vào máy
B4: Mở thư mục Project: 
 B4.1: cd vào thư mục bookstore-backend, chạy các lệnh sau (tuần tự):
    - npm i -g prisma graphql-cli
    - npm i
    - cd prisma
    - docker-compose up -d
    - prisma deploy -e ../config/dev.env
    - cd ..
    - npm run dev
 B4.2: Mở một cửa sổ cmd hoặc terminal khác, di chuyển lại tới thư mục bookstore-client-front, chạy các lệnh(tuần tự):
    - npm i
    - npm start


## Chú ý ##
Sau B4.1, truy cập DB(mysql) tại với:
- host: 127.0.0.1
- port: 3307
- username: root
- password: prisma
và chạy script trong thư mục DB để chèn data

