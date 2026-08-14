---
title: { ko: "ESP32 전자잉크 강의실 시간표", en: "ESP32 e-Paper Classroom Timetable" }
summary: { ko: "ESP32 + e-Paper + LoRa 통신으로 만든 강의실 시간표 시스템", en: "A classroom timetable system built with ESP32, e-paper displays, and LoRa" }
thumbnail: /images/projects/esp32-e-paper-syllabus/thumb.svg
images: []
github: https://github.com/ssenu/esp32_e-paper_syllabus
tech: [C, C++, ESP32, LoRa, e-Paper, Vue, Python]
period: "2026.06"
featured: true
order: 2
---

<!-- ko -->
## 개요

강의실 앞에 붙는 종이 시간표를 전자잉크 디스플레이로 대체한 시스템입니다. ESP32가 e-Paper를 구동하고, 원거리 저전력 통신인 LoRa로 시간표 데이터를 받아 갱신합니다.

## 구성

- **디바이스**: ESP32 + e-Paper — 전력을 거의 쓰지 않고 상시 표시
- **통신**: LoRa — Wi-Fi가 닿지 않는 강의실에도 원거리 전송
- **관리 웹**: Vue 프런트 + Python 백엔드로 시간표 편집·배포

## 배운 점

임베디드(C/C++)부터 웹(Vue)까지 하나의 데이터가 흘러가는 전체 파이프라인을 설계했습니다. 전자잉크의 부분 갱신, LoRa 페이로드 설계 등 하드웨어 제약 아래에서의 최적화를 경험했습니다.

<!-- en -->
## Overview

A system replacing the paper timetable on classroom doors with e-ink displays. An ESP32 drives the e-paper panel and receives timetable updates over LoRa, a long-range low-power radio.

## Architecture

- **Device**: ESP32 + e-paper — always-on display with near-zero power draw
- **Link**: LoRa — reaches classrooms beyond Wi-Fi coverage
- **Admin web**: Vue frontend + Python backend for editing and publishing timetables

## What I Learned

I designed a full pipeline from embedded C/C++ to a web frontend, optimizing under hardware constraints: e-ink partial refresh, LoRa payload design, and power budgeting.
