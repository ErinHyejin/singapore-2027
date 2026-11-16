---
name: 싱가포르 여행 일정표
description: 현재 구현에서 추출한 흰 바탕·네이비 잉크·붉은 선택 상태의 사진 기반 일정 UI
colors:
  ink: '#1b2940'
  secondary: '#536174'
  muted: '#657184'
  paper: '#fff'
  surface: '#f4f6f8'
  line: '#e0e5eb'
  accent: '#b82e3e'
  warning: '#875327'
  warning-wash: '#fcf5ed'
  selection: '#f6d9dd'
  disabled: '#a0a8b3'
  rest-text: '#405a7b'
  rest-wash: '#f0f4f8'
  cruise-wash: '#f6f4f9'
  meal-wash: '#fbf8f2'
  scrollbar-thumb: '#b4bdc9'
  image-fallback: '#e8edf0'
  magic-navy: '#142b55'
  magic-gold: '#ffd46c'
  magic-light: '#e4edff'
typography:
  display:
    fontFamily: SUIT,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif
    fontSize: 46px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -.025em
  day-number:
    fontFamily: SUIT,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -.02em
  headline:
    fontFamily: SUIT,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.4
  event-title:
    fontFamily: SUIT,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1.6
  body:
    fontFamily: SUIT,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif
    fontSize: 14px
    lineHeight: 1.7
  label:
    fontFamily: SUIT,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif
    fontSize: 12px
    lineHeight: 1.6
rounded:
  default: 8px
  status: 4px
spacing:
  '4': 4px
  '8': 8px
  '12': 12px
  '16': 16px
  '20': 20px
  '24': 24px
  '32': 32px
  '40': 40px
  '48': 48px
  '64': 64px
components:
  date-tab:
    backgroundColor: transparent
    textColor: '{colors.ink}'
    rounded: 12px
    padding: 8px 12px
  date-tab-selected:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.paper}'
    rounded: 12px
    padding: 8px 12px
  view-toggle:
    backgroundColor: transparent
    textColor: '{colors.secondary}'
    height: 52px
  pager-button:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.default}'
    padding: 8px 16px
  timeline-row:
    textColor: '{colors.ink}'
    padding: 24px 0
  badge-check:
    backgroundColor: '{colors.warning-wash}'
    textColor: '{colors.warning}'
    rounded: '{rounded.status}'
    padding: 0 6px
  alternative-disclosure:
    textColor: '{colors.ink}'
    padding: 16px 0
  timetable:
    rounded: '{rounded.default}'
    width: 100%
---

# Design System: 싱가포르 여행 일정표

## Overview

**Creative North Star: "흰 종이 여행 사진첩"**

흰 종이 위의 실제 여행 사진과 시간 정렬을 중심으로 한 일정 인터페이스다. 네이비 잉크로 내용을 읽고, 붉은색으로 선택 날짜와 날짜 숫자를 찾는다. 표면의 깊이는 그림자가 아니라 여백과 얇은 구분선으로 만든다.

이 문서는 승인된 방향을 새로 제안하는 문서가 아니라 docs/index.html, docs/itinerary.css, docs/app.js의 현재 구현을 기록한 버전관리용 자료다. UI에서 로드하지 않는다. 세부 화면 의도는 .impeccable/surfaces/itinerary.md에 둔다. 원본 CSS가 우선이며 변경 시 이 문서와 sidecar를 함께 갱신한다.

**Key Characteristics:**
- 실제 사진과 기능적 날짜 탐색
- 시간 정렬된 무박스 행
- SUIT 단일 서체와 고정폭 숫자
- 선택 상태에 한정된 붉은 강조

## Colors

### Primary

`accent`는 선택 날짜의 배경, 큰 날짜 숫자, 키보드 포커스에 쓰는 굴뚝의 붉은색이다. 사진에서 유래한 강조이나 사진의 모든 색을 테마로 확장하지 않는다.

### Neutral

`paper`는 페이지와 탐색 바의 흰 바탕이다. `ink`는 제목·시각·본문 및 전체 표의 헤더에 쓰는 네이비다. `secondary`는 설명, `muted`는 덜 중요한 배지와 갱신 시각, `line`은 행 구분, `surface`는 호버와 이미지 바탕에 사용한다. `selection`은 텍스트 선택, `disabled`는 비활성 버튼 글자색이다.

`warning`/`warning-wash`는 확인 필요 상태의 갈색 글자와 옅은 바탕이다. `rest-text`는 휴식 배지에, `rest-wash`·`cruise-wash`·`meal-wash`는 전체 시간표의 해당 종류 셀에만 사용한다. `scrollbar-thumb`는 표 스크롤바, `image-fallback`은 모바일 커버 이미지의 대체 바탕이다. 이들은 별도의 브랜드 보조색이 아닌 기능 상태색이다. CSS 원문의 색상 표기(`#fff` 포함)를 유지한다.

**The Selection Rule.** 붉은 선택 배경과 흰 글자는 날짜 탭의 선택 상태를 나타낸다. 일정 종류 전체를 붉게 칠하지 않는다.

## Typography

**Display Font / Body Font:** 자체 호스팅 SUIT Variable. fallback과 실제 역할별 수치는 frontmatter에 정의했다. `docs/assets/SUIT-Variable.woff2`를 preload하며 `font-weight:100 900`, `font-display:swap`을 사용한다. 루트의 `font-synthesis:none`, `font-variant-numeric:tabular-nums`를 유지한다. 별도 모노스페이스나 디스플레이 서체는 없다.

### Hierarchy

- **Display:** 여행 제목. 모바일에서는 36px이다.
- **Day number:** 왼쪽 날짜 숫자. 모바일 44px, 좁은 모바일 40px이다.
- **Headline:** 선택한 날 제목. 모바일 23px, 좁은 모바일 21px이다. 대안 제목은 20px, 확인 메모 제목은 16px이다.
- **Event title:** 일정 제목. 모바일에서는 16px이다.
- **Body:** 일정 설명은 frontmatter의 body 역할을 따른다. 전역 body의 line-height는 1.6이고 모든 본문이 1.7인 것은 아니다. 대안 본문은 14px/1.8, 메모는 13px/1.8이다.
- **Label:** 요일, 작은 표식, 요약, 갱신 표시. 지도 링크·전체 표·보조 문구는 13px, 시간은 데스크톱 14px/모바일 13px이다. 날짜 탭 숫자는 24px/1.4/500이다.

합성된 모듈러 타입 스케일이나 clamp는 없다. 기록된 실측 선언을 사용한다. 제목과 날짜의 음수 자간 외에 장식용 대문자 트래킹은 사용하지 않는다.

## Layout

헤더·날짜 탐색 내부·main·footer는 `max-width:1184px`의 중앙 컨테이너다. 전역 `box-sizing:border-box`이므로 데스크톱 좌우 패딩 32px은 이 폭에 포함된다. 날짜 바는 `position:sticky;top:0;z-index:20`이다. 날짜 탭은 수평 스크롤하고 스크롤바를 숨기며, 선택 탭을 화면 안으로 맞춘다.

데스크톱 일별 화면과 출발 전 메모는 `minmax(260px,360px) minmax(0,1fr)`의 2열, 열 간격 64px이다. 일별 소개는 `top:172px`로 고정된다. 일정 행은 시간 96px + 유동 내용 열, 간격 16px, 상하 24px이다. 반복되는 간격은 frontmatter의 실제 px 어휘이며 CSS custom property 기반 간격 스케일은 아니다.

| 조건 | 실제 변화 |
| --- | --- |
| 기본 / 768px 이상 | 좌우 32px, 2열, 헤더 커버 aspect-ratio 2.9, 하루 사진 1.4, 헤더 제목 46px/1.18 |
| max-width:767px | 좌우 20px, 일별·메모 1열, 소개 고정 해제, 헤더 커버 1.9와 바깥 여백 0, 하루 사진 2.2, 시간열 68px/간격 12px/행 상하 20px, 헤더 제목 36px/1.2 |
| max-width:359px | 좌우 16px, 시간열 60px, 새로고침 글자 숨김·아이콘 버튼 폭 44px |
| prefers-reduced-motion:reduce | 모든 transition 제거, scroll-behavior:auto 강제, JS 날짜 이동도 즉시 스크롤 |
| print | 날짜 바·이전/다음·커버 캡션·새로고침 숨김, 커버 max-height 180px, 소개 고정 해제, 일별 열 간격 32px, 행 분할 방지 |

날짜 탭은 기본 `flex:1 0 72px`, 최소 높이 76px이고 모바일은 `flex:0 0 60px`이다. 주요 버튼과 지도 링크의 최소 높이는 44px이다. 전체 표는 `max-height:72vh`의 양방향 스크롤 영역이다. 날짜 열은 224px, 고정 시간 열은 80px이다. 표 머리는 top:0/z-index:3, 시간 열은 left:0/z-index:2, 교차 헤더는 z-index:4다.

사진은 object-fit:cover다. 커버의 초점은 `50% 53%`, 날짜 사진은 center이다. 사진의 비율과 잘림을 사진 원본 크기로 오인하지 않는다.

## Elevation & Depth

일정 행과 카드에는 그림자가 없다. 선택 날짜에만 `0 3px 8px #1b294014`의 약한 중성 그림자를 쓴다. backdrop-filter는 없다. 흰 바탕, 얇은 경계선, 조용한 상태 바탕, 사진 크롭으로 위계를 구분한다. sticky와 z-index는 기능적 겹침이며 카드 고도의 토큰이 아니다.

**The Flat Rows Rule.** 일정은 경계선으로 나뉜 시간행으로 유지한다. 행을 개별 그림자 카드로 바꾸지 않는다.

## Shapes

기본 모서리 `rounded.default`는 하루 사진, 이전/다음 버튼과 전체 표 바깥에 적용한다. 날짜 탭은 12px, 확인 배지는 `rounded.status`다. 디즈니 헤더는 24px/모바일 20px, 내부 커버 사진은 16px/모바일 12px로 잘라낸다. 요약의 chip은 실제로 inline 텍스트이며 pill이 아니다. 경계선은 1px solid `line`이다. 아이콘은 기본 18px, stroke-width 1.5의 SVG이며 지도만 16px이다.

## Components

### Date navigation

투명 배경의 세 줄 탭(요일·날짜·일정 종류). hover는 `surface`, `aria-selected=true`는 `accent` 배경과 흰 글자다. 선택한 탭만 tabIndex 0이며 나머지는 -1이다. 좌우 화살표와 Home/End로 선택한다. 날짜 변경은 해시·선택 저장·사진·일정·요약·이전/다음 상태를 함께 갱신한다. 날짜 선택 시 하루 보기로 돌아간다.

### View toggle and refresh

보기 선택은 배경 없는 텍스트 버튼이다. `aria-pressed=true`에서 네이비·600 굵기와 하단 2px 밑줄을 쓴다. 두 패널은 `hidden`으로 전환한다. 새로고침은 아이콘+텍스트이며 hover에서 글자가 진해진다. 별도의 pressed 애니메이션은 없다.

### Timeline, map and badges

시간과 내용을 분리한 행이다. 시간 범위는 시작·종료를 두 줄로 표시하며 종료는 보조색이다. 제목은 overflow-wrap:anywhere, 시간 문자열은 nowrap이다. 지도 링크는 hover에서 밑줄이 생긴다. `check`, `rest`, `cruise`만 일별 배지를 만들고 모든 일정 종류에 배지를 붙이지 않는다. 확인 배지만 작은 바탕이 있다. 인라인 대안은 본문 뒤 보조 문구다.

### Previous / next

흰 배경, 얇은 경계, 기본 곡률의 버튼이다. enabled hover만 surface를 사용한다. 첫날의 이전, 마지막 날의 다음은 native disabled이며 비활성 글자색·기본 커서를 쓴다. opacity나 로딩 상태는 정의하지 않는다.

### Alternatives disclosure

native details/summary다. summary 최소 높이 64px, 상하 패딩 16px이며 열린 상태에서 SVG 화살표가 180도 회전한다. 본문은 조용한 보조색이다. 대안이 없으면 등록 없음 또는 선내 프로그램 별도 확인 문구를 같은 보조 본문 스타일로 표시한다.

### Timetable

네이비 헤더·흰 헤더 글자, 고정 머리와 시간 열, 셀 패딩 16px, 종류별 옅은 바탕을 쓴다. 내부 셀은 둥근 카드가 아니다. 스크롤 컨테이너는 tabindex 0이고 focus-visible 대상으로 포함한다.

### Shared states

버튼·링크·summary·표 스크롤 영역의 focus-visible은 `2px solid var(--accent)`와 outline-offset 4px이다. skip link는 평소 화면 위에 있다가 포커스 시 top:8px로 나타난다. `[hidden]`은 display:none!important이다. hover/사진 opacity/펼침 화살표의 transition은 160ms와 `--ease`다. 날짜 이동 스크롤은 smooth이며 지속시간을 직접 지정하지 않는다. 폼 입력·모달·스켈레톤·커스텀 :active 스타일은 구현되어 있지 않다. 데이터 누락 오류는 기존 no-alts 본문 스타일을 재사용한다.

sidecar의 프리뷰는 실제 선언을 추출·ds-접두사로 격리한 HTML/CSS다. 루트 custom property는 fallback과 함께 live-bound로 참조한다. 선택/pressed 샘플은 시각 상태 예시이며 앱의 JS 동작 전체를 복제하지 않는다. details의 기본 토글은 자체 동작한다.

### Disney voyage layer

헤더 배경은 `magic-navy`, 보조 텍스트는 `magic-light`, D-day와 이동 단계 날짜는 `magic-gold`다. 본문은 흰 바탕·네이비 글자·붉은 날짜 선택을 보존한다. 싱가포르 달력 날짜로 D-day를 계산하며 여행 중/종료 후 문구도 분리한다. 4개 단계 버튼은 실제 날짜 선택으로 연결하고 해당 구간에 `aria-current=step`을 쓴다.

사진 양쪽 미키·미니, 날짜 사진의 6종 캐릭터, 대안의 스티치와 하단 구피는 모두 빈 alt·aria-hidden·pointer-events:none인 장식이다. 그림은 contain으로 표시한다. 캐릭터 영역이 제목·날짜·버튼·안내 문구를 침범하지 않도록 시작/종료 자세를 확인한다. 실제 프로그램/만남 예약의 확정 표현으로 사용하지 않는다.

상단은 620ms의 일회성 등장과 100ms의 두 번째 캐릭터 지연, 날짜 변경은 캐릭터 360ms와 사진 220ms다. 기본 opacity는 0이 아니며 무한 반복은 없다. reduced-motion에서는 해당 애니메이션을 생략한다. 기능 테스트와 정적 렌더 검수는 시행하되 실제 기기 프레임률 측정이나 전체 모션 영상 검수로 표현하지 않는다.

### Activity-matched film scenes

각 일정 카드에 캐릭터의 실제 행동이 보이는 기존 영화 장면을 표시한다. `docs/actions.js`의 `events`는 원본 event ID별 명시적 매핑이며 `assets`는 로컬 WebP·캐릭터·행동·크기를 제공한다. 원출처/권리표시/원본 SHA-256/관련 이유는 `ACTION_SOURCES.json`, 자산 sidecar 및 WebP metadata에 남긴다. 원래 일정 데이터와 이미지 배치를 분리한다.

기본은 본문 아래 `max-width:256px`, 이미지는 `max-height:152px;object-fit:contain`, 캡션은 12px/1.5/secondary다. 1100px 이상에서는 `minmax(0,1fr) 192px`, gap 20px로 본문 옆에 놓는다. 필수 제목·시간·지도는 이미지 밖에 둔다. figure는 장식으로 aria-hidden/pointer-events:none이고 이미지는 빈 alt, lazy loading을 사용한다. 이미지 오류 시 그림만 숨기고 열 배치를 해제한다. 인쇄에서는 그림을 생략한다. 새 반복 애니메이션은 없다.

## Do's and Don'ts

### Do:
- Do 흰 바탕, 네이비 본문, 붉은 날짜 선택의 역할을 유지한다.
- Do 시간·제목·보조 설명의 위계를 보존하고 긴 내용을 줄바꿈한다.
- Do 날짜 선택을 사진·일정·접근성 상태와 함께 갱신한다.
- Do 모션 감소 설정, 키보드 포커스, 경계 날짜의 비활성 상태를 유지한다.
- Do 사진 출처·사용 조건은 PHOTOS.md와 자산 메타데이터에 보관한다.

### Don't:
- Don't 초록·청록 중심의 기본 테마로 되돌리지 않는다.
- Don't 시간행마다 둥근 색상 카드를 추가하지 않는다.
- Don't 화면에 사진 출처·사용 조건 문구를 추가하지 않는다.
- Don't 사진을 예약·방문 확정의 근거로 표현하지 않는다.
- Don't 관찰되지 않은 오류·로딩·입력 필드 스타일을 기존 시스템인 것처럼 만들지 않는다.

검증은 sidecar의 `extensions.sourceEvidence`를 기준으로 진행한다. JSON 파싱과 frontmatter 파싱, 토큰 참조 해소, CSS custom property의 이름·값 대조, 원본 파일 SHA-256, 컴포넌트 HTML/CSS와 상태 선택자의 대응, 반응형 조건의 원문 대조를 수행한다. 코드·사진·일정의 시각/기능 합격을 이 정적 문서 검증으로 대신하지 않는다. 기계 판독 원시 토큰은 frontmatter에만 두고 sidecar에는 확장 토큰과 원본 대조용 증거를 둔다.
