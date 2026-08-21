#!/bin/sh
# nginx 공식 이미지가 시작 시 /docker-entrypoint.d/*.sh를 실행해준다.
# 방문자 카운터를 백그라운드로 띄운다.
python3 /visits.py &
