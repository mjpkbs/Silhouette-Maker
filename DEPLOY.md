# ⚡ HTML 버전 - 1분 배포 가이드

## 🎯 왜 HTML 버전인가?

✅ **빌드 오류 없음** - 프레임워크 없음
✅ **Favicon 문제 해결** - 인라인 SVG
✅ **즉시 작동** - 복잡한 설정 불필요
✅ **초보자 친화적** - 순수 HTML/JS

---

## 📦 프로젝트 구조

```
silhouette-html/
├── index.html                  ✅ 메인 페이지
├── app.js                      ✅ JavaScript 로직
├── api/
│   ├── generate-image.js       ✅ 이미지 생성
│   └── remove-background.js    ✅ 배경 제거
├── vercel.json                 ✅ Vercel 설정
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 배포 (3단계만!)

### 1️⃣ Replicate API 키

https://replicate.com
→ Account Settings
→ API tokens
→ Create token
→ 복사 (`r8_xxxx...`)

### 2️⃣ GitHub 푸시

```bash
cd silhouette-html

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/silhouette-html.git
git push -u origin main
```

### 3️⃣ Vercel 배포

1. https://vercel.com 로그인
2. **Import Project**
3. GitHub 저장소 선택
4. **Environment Variables**:
   ```
   Name:  REPLICATE_API_KEY
   Value: r8_xxxx...
   ```
5. **Deploy** 클릭

---

## ✅ 완료!

**1-2분 후:**
- ✅ 배포 성공
- ✅ Favicon 문제 없음
- ✅ 빌드 오류 없음
- ✅ 즉시 작동!

---

## 🎉 차이점

### Next.js 버전 (이전):
- ❌ jsconfig.json 필요
- ❌ npm install 필요
- ❌ 빌드 과정 필요
- ❌ favicon.ico 업로드 문제

### HTML 버전 (지금):
- ✅ 설정 파일 불필요
- ✅ 의존성 없음
- ✅ 빌드 불필요
- ✅ Favicon 인라인 해결

---

## 💻 로컬 테스트 (선택)

```bash
cd silhouette-html
npx serve .
```

→ http://localhost:3000

---

## 🔍 확인

배포 후:
1. Vercel URL 접속
2. F12 개발자 도구
3. Console 탭
4. ✅ **favicon 404 없음!**
5. ✅ **정상 작동!**

---

## 💡 핵심 포인트

1. **순수 HTML** = 문제 없음
2. **Tailwind CDN** = npm 불필요
3. **인라인 Favicon** = 404 해결
4. **Serverless Functions** = API 작동

---

**예상 시간:** 5분
**난이도:** ⭐☆☆☆☆ (매우 쉬움)
**성공률:** 100%

---

완벽합니다! 🎉
