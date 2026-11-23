# Three.js Particle Fluids — 한국어판

[dgreenheck/threejs-particle-fluids](https://github.com/dgreenheck/threejs-particle-fluids)의 한국어 포크입니다. Three.js용 GPU 입자 물리 라이브러리로, 액체·소프트 바디·천·연기를 WebGPU로 실시간 시뮬레이션하고 렌더링합니다. 13개의 인터랙티브 프리셋 데모의 화면 문구를 한글로 옮겼습니다.

**▶ 라이브 데모: https://sigco3111.github.io/threejs-particle-fluids/**

![커버](public/previews/cover.png)

> 원작: [dgreenheck](https://github.com/dgreenheck) · 라이선스: MIT · 영문 원본 README: [README.en.md](README.en.md)

## 실행 환경

- **WebGPU를 지원하는 브라우저**가 필요합니다(WebGL 폴백 없음). 최신 Chrome/Edge 권장.
- 데모는 정적 사이트로, 별도 서버 없이 GitHub Pages에서 동작합니다.

## 프리셋 (13개)

| #   | 프리셋             | 내용                                                                |
| --- | ------------------ | ------------------------------------------------------------------- |
| 01  | 파동 수조          | 밀폐 수조가 끝에서 끝으로 뒤집히며 물이 벽 사이를 출렁입니다        |
| 02  | 물방울             | 떨어지는 물방울이 얕은 물웅덩이에 튀어 오릅니다                     |
| 03  | 댐 붕괴            | 물기둥이 무너져 수조를 범람시키고 커다란 스탠퍼드 버니에 부딪힙니다 |
| 04  | 액체 구슬          | 안쪽을 향하는 중력, 클릭으로 터뜨린 방울이 다시 뭉칩니다            |
| 05  | 허니 버니          | 도는 노즐이 스탠퍼드 버니 위에 걸쭉한 꿀을 뿌립니다                 |
| 06  | 부력               | 고무 오리의 밀도를 바꿔 뜨기와 가라앉기를 살펴봅니다                |
| 07  | 소프트 바디 압착   | 부드러운 형체 20개를 움직이는 판이 눌러 탄성 회복을 보여줍니다      |
| 08  | 버니 라인업        | 단단함이 다른 젤리 토끼 다섯 마리가 나란히 떨어집니다               |
| 09  | 바나나 블렌더      | 액체와 밀도가 같은 바나나가 회전 패들에 휘말립니다                  |
| 10  | 벨벳 커튼          | 움직이는 구가 붉은 벨벳을 밀고 지나가며 주름을 만듭니다             |
| 11  | 벨벳 드레이프      | 벨벳 천이 스탠퍼드 버니 위에 떨어져 몸을 감쌉니다                   |
| 12  | 타프 유출          | 붉은 액체가 경사진 방수포를 타고 흘러 가장자리로 쏟아집니다         |
| 13  | 소용돌이 연기 기둥 | 가열된 환기구가 부력 있는 소용돌이 연기 기둥을 만듭니다             |

## 조작 방법

| 조작            | 동작                       |
| --------------- | -------------------------- |
| Space           | 일시정지 / 재생            |
| R               | 다시 시작                  |
| 드래그          | 시점 회전                  |
| 스크롤          | 확대/축소                  |
| 액체 클릭       | 물 튀기기(지원 프리셋)     |
| 입자 메뉴       | 입자 수(5,000~50,000) 조절 |
| ↻ 표시 슬라이더 | 변경 시 실험 다시 시작     |

오른쪽 매개변수 패널에서 중력·점성·표면 장력 등 물리 값을 실시간으로 조절할 수 있고, 표시 설정에서 표면/입자 렌더 모드, 반사, 앰비언트 오클루전을 바꿀 수 있습니다.

## 로컬 실행 (Node.js 22.12+)

```sh
npm ci
npm run dev
```

## 라이브러리로 사용하기

```sh
npm install threejs-particle-fluids three
```

```ts
import { Box3, Vector3 } from 'three';
import { Simulation, createParticleRenderer } from 'threejs-particle-fluids';

const renderer = await createParticleRenderer({ antialias: true });

const sim = new Simulation({
  renderer,
  scene,
  camera,
  container: new Box3(new Vector3(-0.5, 0, -0.3), new Vector3(0.5, 0.8, 0.3)),
  particles: 5000, // 전체 입자 예산; 스텝 비용을 결정
});
sim.addFluid({ box: new Box3(new Vector3(-0.5, 0, -0.3), new Vector3(-0.1, 0.5, 0.3)) });

async function frame() {
  await sim.step();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

three.js r184와 WebGPU 지원 브라우저가 필요합니다.

## 기술 정보

- **기술 스택**: TypeScript, Three.js(r184+) WebGPU 렌더러, TSL 셰이더, Vite
- **물리 엔진**: GPU 컴퓨트 기반 입자 시뮬레이션(PBF/XPBD 계열) — 유체, 소프트 바디(형상 일치), 천(제약 조건), 기체(연기 트레이서)
- **렌더링**: 액체 표면 재구성, 화면 공간 반사, 앰비언트 오클루전, 볼류메트릭 연기

```text
src/
  simulation/ Simulation 클래스와 핸들
  core/       입자, 솔버 루프, 접촉, 충돌체, 이웃 그리드
  fluids/     유체 솔버와 액체 표면 렌더러
  softbody/   형상 일치, 복셀화, 메시 스키닝
  cloth/      천 제약 조건, 바람, 표면 렌더링
  gas/        연기 트레이서와 렌더러
  sdf/        메시-거리장 베이킹
  render/     입자 디버그 렌더링
demo/         프리셋 갤러리 (한국어 UI)
examples/     API 사용 예제
```

### 개발 명령

| 명령                | 용도                                          |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | 데모와 예제 실행                              |
| `npm run build`     | 라이브러리(`dist/`)와 데모(`dist-demo/`) 빌드 |
| `npm run typecheck` | 타입 검사                                     |
| `npm run lint`      | 린트                                          |
| `npm test`          | CPU 테스트                                    |
| `npm run test:gpu`  | 설치된 Chrome에서 WebGPU 테스트               |

GPU 테스트와 벤치마크는 로컬 GPU가 필요하며, 러너가 Chrome의 `--enable-unsafe-webgpu` 플래그를 넘깁니다.

## 한국어판 변경 사항

- 데모 UI 전면 한글화: 프리셋 이름·설명, 매개변수 라벨·도움말, 진단 정보, 버튼·안내 문구, 오류 메시지
- 한글 폰트 대체 목록(Pretendard, Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR) 추가
- 코드의 내부 식별자(id, key, 값)와 라이브러리 API는 원본 그대로 유지

## 라이선스와 크레딧

- 원작: [dgreenheck/threejs-particle-fluids](https://github.com/dgreenheck/threejs-particle-fluids) (MIT License)
- 서드파티 고지: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
- 프리셋 미리보기 이미지는 원작 저장소의 자료입니다.
