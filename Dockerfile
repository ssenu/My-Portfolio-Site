FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
# 방문자 카운터: 파이썬 표준 라이브러리만 사용하는 초소형 프로세스를 같은 컨테이너에서 구동
RUN apk add --no-cache python3
COPY deploy/visits.py /visits.py
COPY deploy/40-start-visits.sh /docker-entrypoint.d/40-start-visits.sh
RUN chmod +x /docker-entrypoint.d/40-start-visits.sh
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
