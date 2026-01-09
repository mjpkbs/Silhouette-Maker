# 🎭 실루엣 생성기

AI 기반 뒷모습 인물 이미지 생성 웹 애플리케이션

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/silhouette-generator)

## ✨ 주요 기능

- 🎨 **AI 이미지 생성**: Replicate Flux 모델 사용
- 👤 **뒷모습 전용**: 얼굴이 보이지 않는 프로페셔널한 뒷모습 이미지
- 🖼️ **32-bit PNG**: 투명 배경 지원
- 📐 **고해상도**: 1024x1536px
- 🎯 **다양한 옵션**: 연령대, 성별, 인종, 복장 선택
- 🌟 **프리셋 제공**: 경찰관, 판사, 소방관, 한복 등 10종
- 🚀 **빠른 생성**: 약 5-10초

## 🖥️ 스크린샷

### 메인 화면
- 직관적인 한글 인터페이스
- 단계별 옵션 선택
- 실시간 이미지 생성 및 미리보기

## 🚀 빠른 시작

### 로컬 개발

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/silhouette-generator.git
cd silhouette-generator

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 REPLICATE_API_KEY 입력

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 열기

### Vercel 배포

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

**간단 요약**:
1. Replicate API 키 발급 (https://replicate.com)
2. GitHub에 저장소 푸시
3. Vercel에서 Import
4. 환경 변수 설정
5. 배포 완료!

## 📁 프로젝트 구조

```
silhouette-app/
├── pages/
│   ├── index.js              # 메인 페이지
│   ├── _app.js               # Next.js App
│   ├── _document.js          # HTML Document
│   └── api/
│       ├── generate-image.js # 이미지 생성 API
│       └── remove-background.js # 배경 제거 API
├── public/
│   └── favicon.svg           # 파비콘
├── styles/
│   └── globals.css           # 전역 스타일
├── .env.local.example        # 환경 변수 템플릿
├── next.config.js            # Next.js 설정
├── tailwind.config.js        # Tailwind 설정
├── package.json              # 의존성 관리
├── DEPLOYMENT.md             # 배포 가이드
└── README.md                 # 이 파일
```

## 🔑 환경 변수

`.env.local` 파일 생성 후 다음 변수 설정:

```env
REPLICATE_API_KEY=r8_your_replicate_api_key
```

### API 키 발급 방법
1. https://replicate.com 가입
2. Account Settings → API tokens
3. Create token
4. API 키 복사

## 🎨 사용 방법

### 1️⃣ 옵션 선택
- **연령대**: 어린이, 청소년, 청년, 성인, 중년, 노년
- **성별**: 남성, 여성, 중성
- **인종**: 동아시아, 서양, 아프리카, 중동, 남아시아, 라틴
- **복장**: 프리셋 선택 또는 직접 입력

### 2️⃣ 생성 모드 선택
- **투명 배경**: PNG with alpha channel
- **배경 포함**: Dark studio background

### 3️⃣ 다운로드
생성된 이미지를 PNG로 저장

## 🎯 활용 사례

- 📺 **방송 그래픽**: 뉴스, 다큐멘터리
- 📱 **앱/웹 디자인**: 사용자 프로필
- 🎓 **교육 자료**: 교재, 프레젠테이션
- 🏢 **기업 자료**: 마케팅, 브로슈어
- 🎬 **영상 제작**: 애니메이션, 모션 그래픽

## 💰 비용

### Replicate (Flux Schnell)
- 이미지 생성: **$0.003/장**
- 배경 제거: **$0.001/장**
- **총**: **$0.004/장**

### 예상 월 비용
- 100장: **$0.40**
- 1,000장: **$4.00**
- 10,000장: **$40.00**

### Vercel
- **무료 플랜**: 
  - 100GB 대역폭
  - 무제한 배포
  - 자동 HTTPS

## 🛠️ 기술 스택

- **프론트엔드**: Next.js 14, React 18
- **스타일링**: Tailwind CSS
- **AI 모델**: Replicate Flux Schnell
- **배경 제거**: Replicate RMBG-1.4
- **배포**: Vercel
- **아이콘**: Lucide React

## 📦 의존성

```json
{
  "next": "14.0.4",
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "lucide-react": "^0.303.0",
  "tailwindcss": "3.4.0"
}
```

## 🔧 커스터마이징

### 해상도 변경
`pages/api/generate-image.js`:
```javascript
aspect_ratio: "2:3",  // 원하는 비율로 변경
```

### 프리셋 추가
`pages/index.js`:
```javascript
const clothingPresets = [
  '정장',
  '캐주얼',
  '새로운 프리셋', // 여기에 추가
];
```

### 스타일 수정
`pages/index.js`에서 Tailwind 클래스 수정

## 🐛 문제 해결

### API 키 오류
```
Error: API 키가 설정되지 않았습니다
→ .env.local 파일 확인 및 REPLICATE_API_KEY 설정
```

### 타임아웃
```
Error: 이미지 생성 시간이 초과되었습니다
→ pages/api/generate-image.js에서 maxAttempts 증가
```

### 배경 제거 실패
```
→ 자동으로 원본 이미지 반환됨
→ Replicate 크레딧 확인
```

## 🔒 보안

- ✅ API 키는 서버 사이드에서만 사용
- ✅ `.env.local`은 `.gitignore`에 포함
- ✅ 환경 변수는 Vercel에서 안전하게 관리
- ✅ Rate limiting 권장 (프로덕션 환경)

## 📈 성능 최적화

### 권장사항
1. **이미지 캐싱**: 동일 옵션 재사용
2. **CDN 활용**: Vercel 자동 CDN
3. **로딩 상태**: 사용자 경험 개선
4. **에러 처리**: 명확한 오류 메시지

## 🤝 기여

이슈와 풀 리퀘스트 환영합니다!

1. Fork the Project
2. Create Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to Branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🙏 감사

- [Replicate](https://replicate.com) - AI 모델 호스팅
- [Black Forest Labs](https://blackforestlabs.ai) - Flux 모델
- [Vercel](https://vercel.com) - 배포 플랫폼
- [Next.js](https://nextjs.org) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com) - 스타일링
- [Lucide](https://lucide.dev) - 아이콘

## 📞 지원

- 📧 이메일: [support@example.com]
- 💬 GitHub Issues: [이슈 페이지]
- 📖 문서: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🗺️ 로드맵

### v1.1
- [ ] 일괄 생성 기능
- [ ] 이미지 히스토리
- [ ] 사용자 크레딧 시스템

### v1.2
- [ ] 고급 편집 도구
- [ ] 다양한 포즈 옵션
- [ ] 스타일 프리셋

### v2.0
- [ ] 3D 모델 생성
- [ ] 애니메이션 지원
- [ ] API 제공

## ⭐ Star History

프로젝트가 마음에 드신다면 ⭐️ Star를 눌러주세요!

---

Made with ❤️ by [Your Name]

**Demo**: [https://silhouette-generator.vercel.app](https://your-deployment-url.vercel.app)
