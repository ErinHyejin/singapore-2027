# Itinerary surface

Mode: Operate. Mobile-first family itinerary, fixed existing content and controls.

## Incumbent audit

The rejected screen repeats an ivory/teal palette, tracked uppercase decoration, a generic sentimental headline, oversized introduction and rounded badges on every level. It has no actual trip imagery. Time rows need a clearer shared alignment. Existing keyboard, date, alternative and table behaviors are sound and must survive.

## Grounded directions

1. Airline journey booklet: compact legs and explicit dates; risks a ticket costume.
2. Ship's daily programme: chronological activities; risks looking like an official ship schedule.
3. Family travel photo album: real place photographs establish each date, adjacent working time rows carry the detail.
4. Museum visit guide: restrained navigation, photo captions and clearly grouped stops.
5. Singapore wayfinding: high-contrast readable date labels and quiet location information.
6. Cruise holiday journal: broad imagery, generous daily composition; risks decorative excess.
7. Gallery audio-guide index: clear next/previous navigation, a single featured place and linked details.

The concept seed assigned grounded candidate 3. The brief already authorizes the redesign, real cruise/day photography and no visible photo-credit/legal captions. No extra feature or content selection is inferred.

Challengers reviewed under Operate limits: split-flap board declined (unnecessary changing live-state grammar); glass slide rack declined (angular density harms mobile reading); Crouwel grid competitive on alignment but weaker on family/place recognition; developer console declined (ambient-light mismatch for tourist use); Saville catalog declined (coded navigation hides dates); airline wallet competitive on date sequencing but risks official-document costume. Raise the chosen album's alignment and date legibility to the strongest competitors without taking their decoration.

## Direction contract

THESIS: real Disney Adventure and daily place photography beside an efficient schedule; remove the generic introduction and decorative metadata.

OWN-WORLD: white photo-album stock, marine-ink text and one funnel-red selection; self-hosted SUIT for Korean interface text; unboxed time-aligned rows instead of repeated colored cards.

STORY: visitors select a day, recognize its photo, scan times, open a map or replacement option, and compare all dates in the timetable when needed.

FIRST VIEWPORT: compact Korean trip title with dates; a wide real Disney cruise photo; persistent date tabs and the two existing views. In the daily work area, photo/title overview sits beside schedule rows on desktop and above them on mobile. No visible photographer or licensing text. Photos are real illustrative place images, not proof of a booking or visit.

FORM: grounded candidate 3, photo-album orientation on standard web controls; seed:15372f8366b46598. Signature interaction: selecting the date changes the corresponding place photo and the schedule together; selected tab remains in view. Code-led Operate surface, no image-generated comp.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Requested Disney-character follow-up

Product: 동행 가족이 여행을 기대하면서 같은 날짜별 일정을 조회한다.
Character: 반가운, 선명한, 장난스러운.
World: 실제 디즈니 어드벤처 사진과 흰 일정 종이; 상단만 선박의 네이비·골드 색감으로 확장한다.
Moments: 실제 배 사진 양쪽의 미키·미니, 날짜 사진 모서리에서 교체되는 캐릭터.
Signature: 날짜를 고르면 장소 사진·캐릭터·시간표가 함께 바뀐다. 대안과 하단에도 작은 스티치/구피를 넣되 일정과 버튼은 덮지 않는다.

Motion thesis: 첫 화면에서 미키와 미니가 짧게 자세를 잡는 620ms 일회성 등장만 주인공이다. 날짜 변경의 360ms 캐릭터 기울기와 220ms 사진 투명도는 바뀐 날을 확인하는 보조 피드백이며 클릭을 지연시키지 않는다. 반복 루프·소리·불꽃·파티클·추가 모션 라이브러리는 없다. 기본 화면은 이미 보이고 reduced-motion에서는 캐릭터/사진 애니메이션을 생략하되 선택 상태와 내용 전환은 유지한다. 실제 하드웨어 프레임률이나 smoothness를 검증했다는 주장은 하지 않는다.

Character assets: 기존 디즈니 캐릭터 이미지 6종이며 생성 이미지가 아니다. 원본·변경·저작권 맥락은 `CHARACTER_SOURCES.json`과 자산 메타데이터에 기록한다. 출연/만남 예약 확정의 표현으로 쓰지 않는다.

30개 일정마다 기존 Disney/Pixar 영화의 행동 장면을 붙이는 후속 요청을 반영한다. 장면은 제목·지도·본문과 분리된 작은 figure로 표시하고 1100px 이상에서는 본문 옆, 그보다 좁으면 본문 아래에 둔다. 원본 비율을 유지하는 contain으로 캐릭터 동작을 자르지 않는다. lazy-loading을 사용하고 이미지 오류 시 figure만 숨기며 일정은 그대로 읽을 수 있게 한다. 새로운 애니메이션은 추가하지 않는다. 정면 캐릭터 포즈를 반복하거나 실제 수면·짐싸기가 아닌 컷을 그런 행동으로 부르지 않는다. 공식 사용허가/공식 회차/캐릭터 만남 예약을 의미하지 않는다.

## Preservation boundary

Keep itinerary JSON, sheet export behavior, privacy boundary, original sheet sharing, existing published URL and all original controls. Do not publish runtime/cache/skill files. Photo provenance stays in source records and image metadata; select CC0 to permit omitting visible credit notices. No image generation or invented Disney ship photos.
