---
title: { ko: "Cloudflare GUI Tool", en: "Cloudflare GUI Tool" }
summary: { ko: "터널 생성부터 원격 SSH·재배포까지 버튼으로 끝내는 홈서버 관리 GUI", en: "A home-server GUI that handles tunnels, remote SSH, and redeploys in a few clicks" }
thumbnail: /images/projects/cloudflare-gui-tool/logo.png
images:
  - /images/projects/cloudflare-gui-tool/logo.png
  - /images/projects/cloudflare-gui-tool/screenshot-main.png
github: https://github.com/ssenu/cloudflare-gui-tool
tech: [Python, Cloudflare Tunnel, SSH, Docker, Tailscale]
period: "2026.08 ~ 진행 중"
featured: true
order: 2
---

<!-- ko -->
## 개요

개인 도메인 서버를 개설하고 라즈베리파이5로 웹 서버를 구축하면서 Cloudflare를 사용하게 되었습니다. CLI로 터널을 생성하고 도메인을 연결하자니 매번 관리하기가 번거로워서, 저 혼자 사용할 수 있는 **Cloudflare GUI Tool**을 만들었습니다.

처음에는 터널 생성·도메인 연결·작업 폴더 지정이 전부였지만, 사용하면서 살을 붙여 나갔습니다. 이제는 라즈베리파이에 원격으로 접속하는 SSH 연결, 도커 실행, 깃 클론/풀, 로그 보기, 그리고 이를 한 번에 처리하는 재배포 기능까지 확장되었습니다.

Tailscale과 이 GUI 툴을 함께 쓰면, 인터넷만 연결되어 있다면 어디서든 원격 SSH 접속으로 버튼 한두 번 클릭만에 웹 서버를 생성하고 배포까지 할 수 있습니다.

## 주요 기능

집 컴퓨터나 라즈베리파이를 내 도메인으로 서비스되는 서버로 만들어 주는 윈도우 앱입니다. 포트 포워딩·공인 IP·DDNS 없이, cloudflared 명령을 직접 치는 대신 창 하나에서 끝냅니다. 원래 터미널에서 해야 하는 일들 — 터널 생성, DNS 연결, ingress 설정 작성, 상시 실행, SSH로 붙어 `git pull && docker compose up` — 을 **터널 생성 → 도메인 입력 → 토글 켜기**로 줄입니다.

| 기능 | 내용 |
| --- | --- |
| 터널·라우트 관리 | 터널을 만들고 도메인을 붙이면 DNS 레코드와 ingress 설정을 앱이 같이 처리 |
| 서버 실행 | 도커 컴포즈나 일반 명령을 토글로 켜고 끔. 컨테이너 존재가 아니라 실제 HTTP 응답을 확인해 "실행 중"을 판정 |
| 원격 기기 관리 | SSH로 라즈베리파이 등을 연결해, 로컬과 똑같은 화면에서 다룸 |
| 프로젝트(Git) | 저장소를 원격 기기에 클론하고, .env를 앱에서 편집 (호스트 포트 포함) |
| 배포 | git pull + 서버 재시작을 버튼 하나로. 진행 단계를 상단 한 줄로 실시간 표시 |
| 서버 카테고리 | 터널 없이 기기 안에서만 돌릴 서버 묶음. 도메인·DNS를 만들지 않음 |
| 로그 | 터널·서버 로그를 탭으로. 도커는 빌드 출력과 앱 로그를 분리 |
| 부팅 시 자동 실행 | systemd 사용자 유닛으로 등록 (원격 리눅스 대상) |

## 느낀점

개인 도메인으로 처음 서비스를 배포하면서 웹에 대한 전공 지식을 크게 향상시킬 수 있었습니다. 그 과정을 하나씩 경험해 보고, 자동화를 통해 저에게 맞는 방식으로 최적화하는 과정에서 큰 재미를 느꼈습니다. 단순히 Cloudflare의 터미널 명령어를 GUI로 바꾸는 데 그치지 않고, 웹 개발 이후 배포까지의 과정(프로젝트 클론, 재배포, 오류 추적을 위한 로그)을 어떻게 하나의 앱에 편리하게 담을지 고민을 많이 했습니다. 이후 다른 프로젝트를 진행하며 가장 많이 활용하는 앱이 되었습니다.

<!-- en -->
## Overview

Setting up a personal domain and a Raspberry Pi 5 web server led me to Cloudflare. Creating tunnels and wiring domains through the CLI every time got tedious, so I built the **Cloudflare GUI Tool** for my own use.

It started with just tunnel creation, domain attachment, and working-folder selection, then grew with use: remote SSH into the Pi, running Docker, git clone/pull, log viewing, and a one-shot redeploy that chains them together.

Paired with Tailscale, anywhere with an internet connection is enough — a couple of clicks over remote SSH spins up and deploys a web server.

## Features

A Windows app that turns a home PC or Raspberry Pi into a server on your own domain — no port forwarding, public IP, or DDNS. Everything you would normally do in a terminal (create the tunnel, wire DNS, write ingress config, keep it running, SSH in for `git pull && docker compose up`) becomes **create tunnel → enter domain → flip a toggle**.

| Feature | Description |
| --- | --- |
| Tunnels & routes | Create a tunnel, attach a domain — the app handles DNS records and ingress config together |
| Run servers | Toggle docker compose or plain commands on/off; "running" is judged by actual HTTP responses, not container existence |
| Remote devices | Connect a Raspberry Pi over SSH and manage it from the same screens as local |
| Projects (Git) | Clone repos onto remote devices and edit .env (including host ports) in-app |
| Deploy | git pull + server restart in one button, with live one-line progress |
| Server categories | Groups of LAN-only servers — no domain or DNS created |
| Logs | Tunnel/server logs in tabs; Docker build output separated from app logs |
| Autostart | Registered as a systemd user unit (for remote Linux) |

## Takeaways

Deploying a service on my own domain for the first time leveled up my web fundamentals. Experiencing each step and then automating it my own way was genuinely fun. Beyond wrapping cloudflared commands in a GUI, I spent most of my thought on how to fit the whole post-development pipeline — cloning, redeploying, log-based debugging — comfortably into one app. It has since become the tool I use most across my other projects.
