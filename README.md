# 🎭 실루엣 생성기 (HTML 버전)

순수 HTML + JavaScript로 만든 AI 실루엣 생성기

## ✨ 특징

- ✅ **순수 HTML** - 프레임워크 없음
- ✅ **자동 저장** - API 키를 localStorage에 저장
- ✅ **CORS 해결** - Vercel Serverless Functions 사용
- ✅ **개선된 배경 제거** - 851-labs/background-remover 사용
- ✅ **Favicon 문제 해결** - 인라인 SVG 사용
- ✅ **Tailwind CDN** - 스타일링

## 📁 파일 구조

```
silhouette-html/
├── index.html          # 메인 페이지 (API 키 입력 포함)
├── app.js              # JavaScript 로직 + localStorage
├── api/
│   ├── generate-image.js    # 이미지 생성 (Flux Schnell)
│   └── remove-background.js # 배경 제거 (851-labs)
├── vercel.json         # Vercel 설정
├── package.json        # 프로젝트 정보
├── .gitignore          # Git 무시 파일
└── README.md           # 이 파일
```

## 🚀 배포 (2단계!)

### 1. GitHub에 푸시
```bash
cd silhouette-html
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/silhouette-generator.git
git push -u origin main
```

### 2. Vercel 배포
```
1. https://vercel.com 접속
2. Import Repository
3. silhouette-generator 선택
4. Deploy 클릭 (환경 변수 설정 불필요!)
```

## ✅ 사용 방법

### 처음 사용 시:
1. 사이트 접속
2. 헤더 우측 "🔑 Replicate API Key" 입력
3. API 키 입력 → **자동으로 브라우저에 저장됨!**
4. 옵션 선택 후 생성

### 두 번째 방문부터:
- API 키가 자동으로 로드됨
- 바로 사용 가능!

## 🔑 API 키 발급

1. https://replicate.com 가입
2. Account Settings → API tokens
3. Create token 클릭
4. API 키 복사 (r8_xxxx...)
5. 웹사이트 헤더에 입력!

## 🆕 새로운 기능

### 💾 자동 저장
- API 키가 localStorage에 자동 저장
- 브라우저 닫아도 유지됨
- 다음 방문 시 자동 로드

### 🎨 개선된 배경 제거
- 851-labs/background-remover 모델 사용
- 더 정확한 배경 제거
- 투명 PNG 품질 향상

### 🔧 CORS 문제 해결
- Vercel Serverless Functions 사용
- 클라이언트에서 API 키 전달
- 서버에서 Replicate API 호출

## 💻 로컬 테스트

```bash
# Vercel CLI로 로컬 테스트
npm i -g vercel
vercel dev

# 또는 간단한 서버
npx serve .
```

브라우저에서 접속하여 테스트

## 💰 비용

- Replicate: ~$0.004/이미지
- Vercel: 무료 (Serverless Functions 포함)

## 🔒 보안

### 좋은 점:
- ✅ API 키가 로컬에만 저장
- ✅ 서버에 영구 저장 안 됨
- ✅ 각 요청마다 HTTPS로 안전하게 전송

### 주의사항:
- ⚠️ 공용 컴퓨터 사용 주의
- ⚠️ 브라우저 캐시 삭제 시 키도 삭제됨
- ⚠️ API 키 공유 금지

## 🐛 문제 해결

### API 키 저장 안 됨
```
브라우저 설정에서 localStorage 허용 확인
시크릿 모드에서는 저장 안 됨
```

### CORS 오류
```
✅ 이미 해결됨 - Serverless Functions 사용
```

### Tailwind CDN 경고
```
✅ 이미 해결됨 - Config로 경고 억제
```

## 🎯 기술 스택

- HTML5
- Vanilla JavaScript
- Tailwind CSS (CDN)
- Vercel Serverless Functions
- Replicate AI API
  - Flux Schnell (이미지 생성)
  - 851-labs/background-remover (배경 제거)

---

Made with ❤️ for KBS Graphics Team
