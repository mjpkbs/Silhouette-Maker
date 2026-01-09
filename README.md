# 🎭 실루엣 생성기 (HTML 버전)

순수 HTML + JavaScript로 만든 AI 실루엣 생성기

## ✨ 특징

- ✅ **순수 HTML** - 프레임워크 없음
- ✅ **즉시 배포** - 빌드 불필요
- ✅ **Favicon 문제 해결** - 인라인 SVG 사용
- ✅ **Vercel Serverless Functions** - API 라우트
- ✅ **Tailwind CDN** - 스타일링

## 📁 파일 구조

```
silhouette-html/
├── index.html          # 메인 페이지
├── app.js              # JavaScript 로직
├── api/
│   ├── generate-image.js    # 이미지 생성 API
│   └── remove-background.js # 배경 제거 API
├── vercel.json         # Vercel 설정
├── package.json        # 프로젝트 정보
├── .gitignore          # Git 무시 파일
└── README.md           # 이 파일
```

## 🚀 배포 (3단계)

### 1. Replicate API 키 발급
```
https://replicate.com
→ Account Settings → API tokens
→ Create token
→ 복사 (r8_xxxx...)
```

### 2. GitHub에 푸시
```bash
cd silhouette-html
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/silhouette-generator.git
git push -u origin main
```

### 3. Vercel 배포
```
1. https://vercel.com 접속
2. Import Repository
3. silhouette-generator 선택
4. Environment Variables 추가:
   - Name: REPLICATE_API_KEY
   - Value: (복사한 API 키)
5. Deploy 클릭
```

## ✅ 완료!

배포 완료 후:
- ✅ Favicon 404 오류 없음
- ✅ 빌드 오류 없음
- ✅ 즉시 작동

## 💻 로컬 테스트

```bash
# 간단한 서버 실행
npx serve .

# 또는
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속

## 🔑 환경 변수

Vercel 대시보드에서 설정:
- `REPLICATE_API_KEY` - Replicate API 키 (필수)

## 💰 비용

- Replicate: ~$0.004/이미지
- Vercel: 무료

## 📖 사용 방법

1. 옵션 선택 (연령대, 성별, 인종, 복장)
2. "투명 배경" 또는 "배경 포함" 클릭
3. 5-10초 대기
4. 다운로드!

## 🐛 문제 해결

### API 오류
```
Vercel → Settings → Environment Variables
→ REPLICATE_API_KEY 확인
```

### Favicon 404
```
✅ 이미 해결됨 - 인라인 SVG 사용
```

### CORS 오류
```
✅ 이미 해결됨 - API에 CORS 헤더 포함
```

## 🎯 장점

✅ **단순함** - 빌드 과정 없음
✅ **빠른 배포** - 1분이면 완료
✅ **문제 없음** - Favicon, jsconfig 등 불필요
✅ **유지보수 쉬움** - 순수 HTML/JS

## 📚 기술 스택

- HTML5
- Vanilla JavaScript
- Tailwind CSS (CDN)
- Vercel Serverless Functions
- Replicate AI API

---

Made with ❤️ for KBS Graphics Team
