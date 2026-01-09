# 🎭 실루엣 생성기 (Silhouette Generator)

AI 기반 뒷모습 인물 이미지 생성 웹 애플리케이션

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Next.js](https://img.shields.io/badge/Next.js-14.0-000000)
![License](https://img.shields.io/badge/license-MIT-green)

## 📸 주요 기능

- ✅ **뒷모습 전용 생성**: 얼굴이 보이지 않는 뒷모습 이미지 생성
- ✅ **32-bit PNG 출력**: 투명 배경 지원
- ✅ **다양한 옵션**: 연령대, 성별, 인종, 복장 선택
- ✅ **고해상도**: 1024x1536px
- ✅ **두 가지 모드**: 투명 배경 / 스튜디오 배경
- ✅ **직관적인 UI**: 한글 인터페이스
- ✅ **프리셋 제공**: 경찰관, 판사, 소방관 등 직업별 템플릿

## 📦 프로젝트 구조

```
실루엣 생성기/
│
├── silhouette-generator.jsx          # 기본 UI 데모 버전
├── silhouette-generator-pro.jsx      # 프로덕션 버전 (추천)
│
├── api-generate-image.js             # Replicate API 연동
├── api-remove-background.js          # 배경 제거 API
│
├── implementation-guide.md           # API 통합 가이드
├── deployment-guide.md               # 배포 가이드 (Vercel/Netlify)
└── README.md                         # 이 파일
```

## 🚀 빠른 시작

### 1. 데모 버전 (즉시 테스트)

**silhouette-generator.jsx** 파일을 사용하여 UI를 먼저 테스트할 수 있습니다.

```bash
# React 프로젝트에서 사용
import SilhouetteGenerator from './silhouette-generator.jsx';

function App() {
  return <SilhouetteGenerator />;
}
```

**특징**: 
- ⚡ 즉시 실행 가능
- 🎨 UI/UX 테스트용
- 📝 실제 이미지는 플레이스홀더

### 2. 프로덕션 버전 (실제 서비스)

**silhouette-generator-pro.jsx** + API 라우트를 사용하여 실제 AI 이미지 생성

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest silhouette-app

# 파일 구조
pages/
  index.jsx                    # silhouette-generator-pro.jsx 복사
  api/
    generate-image.js          # API 라우트
    remove-background.js       # API 라우트
```

## 🔑 API 키 설정

### 필수: Replicate API
```bash
# https://replicate.com 가입
# Account Settings → API Tokens
REPLICATE_API_KEY=r8_xxxxxxxxxxxx
```

### 선택: 배경 제거
```bash
# BRIA (무료 크레딧)
BRIA_API_KEY=your_key

# 또는 Remove.bg
REMOVE_BG_API_KEY=your_key
```

## 💻 로컬 개발

### 필수 설치
```bash
npm install next react react-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
```

### 환경 변수
```bash
# .env.local 생성
REPLICATE_API_KEY=your_replicate_key
BRIA_API_KEY=your_bria_key
```

### 실행
```bash
npm run dev
# http://localhost:3000
```

## 🌐 배포

### Vercel (추천)
```bash
# 1. GitHub에 푸시
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Vercel 연동
# https://vercel.com → Import Project
# Environment Variables 설정
# Deploy 클릭
```

자세한 내용은 **deployment-guide.md** 참조

## 📖 사용 방법

### 1. 옵션 선택
- **연령대**: 어린이, 청소년, 청년, 성인, 중년, 노년
- **성별**: 남성, 여성, 중성
- **인종**: 동아시아, 서양, 아프리카, 중동, 남아시아, 라틴
- **복장**: 프리셋 선택 또는 직접 입력

### 2. 생성 버튼 클릭
- **투명 배경**: PNG with alpha channel
- **배경 포함**: Dark studio background

### 3. 다운로드
생성된 이미지를 PNG 형식으로 다운로드

## 🎨 프리셋 목록

| 프리셋 | 설명 |
|--------|------|
| 정장 | 비즈니스 정장 |
| 캐주얼 | 일상복 |
| 경찰관 제복 | 경찰 유니폼 |
| 판사 법복 | 법관 가운 |
| 소방관 방화복 | 소방복 |
| 의사 가운 | 흰색 가운 |
| 배낭을 멘 학생 | 학생 교복 + 백팩 |
| 운동복 | 스포츠웨어 |
| 작업복 | 산업용 작업복 |
| 한복 | 전통 한복 |

## 💰 예상 비용

### Replicate (Flux Schnell)
- 이미지당: **$0.003**
- 1,000 이미지: **$3**

### 배경 제거
- BRIA 무료: **월 1,000 이미지**
- Remove.bg 무료: **월 50 이미지**

**총 1,000 이미지 생성 + 배경 제거: 약 $7-10**

## 🔧 커스터마이징

### 해상도 변경
```javascript
// api-generate-image.js
const response = await fetch('https://api.replicate.com/v1/predictions', {
  body: JSON.stringify({
    input: {
      width: 2048,  // 변경
      height: 3072, // 변경
    }
  })
});
```

### 프리셋 추가
```javascript
// silhouette-generator-pro.jsx
const clothingPresets = [
  '정장',
  '캐주얼',
  '당신의 프리셋', // 추가
];
```

### 스타일 수정
```javascript
// Tailwind CSS 클래스 수정
className="bg-gradient-to-r from-blue-600 to-purple-600"
```

## 🐛 문제 해결

### API 키 오류
```
❌ Error: API key not configured
✅ .env.local 파일 확인 및 환경 변수 재설정
```

### 타임아웃
```
❌ Error: Image generation timeout
✅ maxAttempts 값 증가 (60 → 120)
```

### 투명 배경 안됨
```
❌ 배경이 제거되지 않음
✅ 프롬프트에 "white background" 추가 후 배경 제거 API 사용
```

## 📚 문서

| 문서 | 설명 |
|------|------|
| [implementation-guide.md](./implementation-guide.md) | API 통합 상세 가이드 |
| [deployment-guide.md](./deployment-guide.md) | Vercel/Netlify 배포 가이드 |
| [api-generate-image.js](./api-generate-image.js) | 이미지 생성 API 코드 |
| [api-remove-background.js](./api-remove-background.js) | 배경 제거 API 코드 |

## 🎯 활용 사례

- 📺 **방송 그래픽**: 뉴스, 예능 프로그램
- 📱 **앱/웹 디자인**: 사용자 아바타
- 🎓 **교육 콘텐츠**: 교재, 프레젠테이션
- 🏢 **기업 자료**: 마케팅, 홍보물
- 🎬 **영상 제작**: 애니메이션, 모션 그래픽

## 🔒 보안 및 개인정보

- ✅ API 키는 서버 사이드에서만 사용
- ✅ 클라이언트에 민감 정보 노출 없음
- ✅ 이미지는 임시 생성, 서버 저장 안함
- ✅ Rate limiting으로 남용 방지

## 🚧 로드맵

### v1.1
- [ ] 일괄 생성 기능
- [ ] 이미지 이력 저장
- [ ] 스타일 프리셋 추가

### v1.2
- [ ] 고급 편집 기능
- [ ] 색상 조정
- [ ] 워터마크 추가

### v2.0
- [ ] 3D 모델 생성
- [ ] 애니메이션 지원
- [ ] 실시간 미리보기

## 🤝 기여

이슈와 풀 리퀘스트는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

## 📄 라이선스

MIT License

## 💬 지원

- 📧 이메일: [지원 이메일]
- 💬 이슈: [GitHub Issues]
- 📖 문서: [Wiki]

## 🙏 감사

- [Replicate](https://replicate.com) - AI 모델 호스팅
- [BRIA](https://bria.ai) - 배경 제거
- [Lucide](https://lucide.dev) - 아이콘
- [Tailwind CSS](https://tailwindcss.com) - 스타일링

---

Made with ❤️ for KBS Graphics Team
