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

개인 도메인 서버를 개설하고 라즈베리파이5로 웹 서버를 구축하면서 Cloudflare를 사용하게 되었습니다. CLI로 터널을 생성하고 도메인을 연결하자니 매번 관리하기가 번거로워서, 저 혼자 쓸 수 있는 **Cloudflare GUI Tool**을 만들었습니다.

처음에는 터널 생성·도메인 연결·작업 폴더 지정이 전부였지만, 사용하면서 살을 붙여 나갔습니다. 이제는 라즈베리파이에 원격으로 접속하는 **SSH 연결, 도커 실행, 깃 클론/풀, 로그 보기**, 그리고 이를 한 번에 처리하는 **재배포 기능**까지 확장되었습니다.

Tailscale과 이 GUI 툴을 함께 쓰면, 인터넷만 연결되어 있다면 어디서든 원격 SSH 접속으로 **버튼 한두 번 클릭만에 웹 서버를 생성하고 배포**할 수 있습니다.

<!-- en -->
## Overview

Setting up a personal domain and a Raspberry Pi 5 web server led me to Cloudflare. Creating tunnels and wiring domains through the CLI every time got tedious, so I built the **Cloudflare GUI Tool** for my own use.

It started with just tunnel creation, domain attachment, and working-folder selection, then grew with use. It now covers **remote SSH into the Pi, running Docker, git clone/pull, log viewing**, and a one-shot **redeploy** that chains them all together.

Paired with Tailscale, anywhere with an internet connection is enough: a couple of clicks over remote SSH **spins up and deploys a web server**.
