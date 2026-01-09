# 🎭 실루엣 생성기 (HTML 버전)

순수 HTML + JavaScript로 만든 AI 실루엣 생성기

## ✨ 특징

- ✅ **순수 HTML** - 프레임워크 없음
- ✅ **클라이언트 사이드** - API 키 브라우저에서 입력
- ✅ **즉시 배포** - 빌드 불필요
- ✅ **Favicon 문제 해결** - 인라인 SVG 사용
- ✅ **서버 설정 불필요** - 정적 사이트
- ✅ **Tailwind CDN** - 스타일링

## 📁 파일 구조

```
silhouette-html/
├── index.html          # 메인 페이지 (API 키 입력 포함)
├── app.js              # JavaScript 로직
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

## ✅ 완료!

배포 완료 후:
- ✅ URL 접속
- ✅ 헤더에 Replicate API 키 입력
- ✅ 즉시 사용 가능!

## 🔑 API 키 발급

1. https://replicate.com 가입
2. Account Settings → API tokens
3. Create token 클릭
4. API 키 복사 (r8_xxxx...)
5. 웹사이트 헤더에 입력!

## 💻 로컬 테스트

```bash
# 간단한 서버 실행
npx serve .

# 또는
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속

## 💰 비용

- Replicate: ~$0.004/이미지
- Vercel: 무료 (정적 사이트)

## 📖 사용 방법

1. **API 키 입력** (헤더 우측)
2. 옵션 선택 (연령대, 성별, 인종, 복장)
3. "투명 배경" 또는 "배경 포함" 클릭
4. 5-10초 대기
5. 다운로드!

## 🔒 보안 참고

- API 키는 브라우저에서만 사용됩니다
- 서버에 저장되지 않습니다
- 매번 새로고침 시 재입력 필요
- 공용 컴퓨터에서 사용 주의!

## 🎯 장점

✅ **초간단** - 환경 변수 설정 불필요
✅ **빠른 배포** - 정적 사이트
✅ **문제 없음** - Favicon, CORS 등 해결
✅ **유연함** - 각 사용자가 자신의 키 사용

## 📚 기술 스택

- HTML5
- Vanilla JavaScript
- Tailwind CSS (CDN)
- Replicate AI API (Direct)

---

Made with ❤️ for KBS Graphics Team
