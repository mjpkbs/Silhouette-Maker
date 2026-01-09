# 실루엣 생성기 구현 가이드

## 현재 상태
현재 제공된 코드는 UI 데모 버전입니다. 실제 AI 이미지 생성을 위해서는 아래의 서비스 중 하나를 선택하여 통합해야 합니다.

## 추천 이미지 생성 API 서비스

### 1. Replicate (추천)
**장점:**
- Flux, SDXL 등 다양한 고품질 모델 지원
- 투명 배경 이미지 생성 가능
- 비교적 저렴한 비용
- 간단한 API 통합

**구현 예시:**
```javascript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${REPLICATE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: "flux-schnell-model-id", // 또는 SDXL 모델
    input: {
      prompt: prompt,
      num_outputs: 1,
      width: 1024,
      height: 1536,
      output_format: "png"
    }
  })
});
```

### 2. Stability AI
**장점:**
- Stable Diffusion 3.5 지원
- 고품질 이미지
- 투명 배경 옵션

**구현 예시:**
```javascript
const formData = new FormData();
formData.append('prompt', prompt);
formData.append('output_format', 'png');
formData.append('mode', 'text-to-image');

const response = await fetch(
  'https://api.stability.ai/v2beta/stable-image/generate/sd3',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STABILITY_API_KEY}`,
      'Accept': 'image/*'
    },
    body: formData
  }
);
```

### 3. DALL-E 3 (OpenAI)
**장점:**
- 높은 이미지 품질
- 안정적인 서비스

**단점:**
- 투명 배경 직접 생성 불가 (후처리 필요)

## 투명 배경 생성 방법

### 옵션 1: AI 모델이 직접 생성
Flux, SDXL 등의 모델에서 프롬프트에 "transparent background"를 추가

### 옵션 2: 배경 제거 API 사용
이미지 생성 후 배경 제거 API 적용:

**Remove.bg API:**
```javascript
const formData = new FormData();
formData.append('image_file', imageBlob);
formData.append('size', 'auto');

const response = await fetch('https://api.remove.bg/v1.0/removebg', {
  method: 'POST',
  headers: {
    'X-Api-Key': REMOVE_BG_API_KEY
  },
  body: formData
});
```

**BRIA API (무료 대안):**
```javascript
const response = await fetch('https://engine.prod.bria-api.com/v1/background/remove', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'api_token': BRIA_API_KEY
  },
  body: JSON.stringify({
    file: base64Image
  })
});
```

## 통합 단계

### 1. API 키 설정
```javascript
// .env.local 파일에 추가
REPLICATE_API_KEY=your_key_here
REMOVE_BG_API_KEY=your_key_here
```

### 2. 코드 수정
`generateImage` 함수를 실제 API 호출로 교체:

```javascript
const generateImage = async (withBg) => {
  setIsLoading(true);
  setError(null);
  
  try {
    // 1. AI 이미지 생성
    const generatedImageUrl = await generateWithReplicate(prompt);
    
    // 2. 투명 배경 버전이 필요한 경우
    if (!withBg) {
      const transparentImageUrl = await removeBackground(generatedImageUrl);
      setGeneratedImage(transparentImageUrl);
    } else {
      setGeneratedImage(generatedImageUrl);
    }
    
  } catch (err) {
    setError('이미지 생성 실패');
  } finally {
    setIsLoading(false);
  }
};
```

### 3. 프롬프트 최적화
뒷모습 생성을 위한 효과적인 프롬프트:

```javascript
const prompt = `
Professional studio photograph, rear view only, back of head visible, 
person facing away from camera, ${age} ${ethnicity} ${gender}, 
wearing ${clothing}, full body shot from behind, 
clean ${withBg ? 'dark gradient background' : 'transparent background, alpha channel, PNG'}, 
professional lighting, high resolution, photorealistic
`.trim();
```

## 비용 예상

- **Replicate (Flux Schnell)**: ~$0.003 per image
- **Stability AI**: ~$0.04 per image  
- **Remove.bg**: $0.20 per image (또는 무료 크레딧)
- **BRIA**: 무료 티어 있음

## 배포 옵션

### Vercel/Netlify
- Edge Functions 사용
- 환경 변수로 API 키 관리

### Next.js API Routes
```javascript
// pages/api/generate.js
export default async function handler(req, res) {
  const { prompt, withBg } = req.body;
  
  // API 호출 로직
  const image = await generateImage(prompt, withBg);
  
  res.status(200).json({ image });
}
```

## 추가 기능 제안

1. **이미지 이력 저장** - localStorage 또는 데이터베이스
2. **일괄 생성** - 여러 옵션 조합으로 동시 생성
3. **스타일 프리셋** - 저장된 스타일 템플릿
4. **고급 편집** - 색상 조정, 크기 변경
5. **워터마크 추가** - 브랜드 로고 삽입

## 문제 해결

### 투명 배경이 제대로 생성되지 않는 경우
- 프롬프트에 "isolated on white background" 추가 후 배경 제거
- 다른 AI 모델 시도 (Flux > SDXL > Stable Diffusion)

### 뒷모습이 아닌 앞모습이 생성되는 경우
- 프롬프트 강조: "rear view ONLY, back view, facing away"
- Negative prompt 추가: "face, frontal view, looking at camera"

### API 비용 관리
- 이미지 캐싱 구현
- 무료 크레딧이 있는 서비스 우선 사용
- 사용자당 일일 생성 횟수 제한

## 참고 자료

- Replicate: https://replicate.com/docs
- Stability AI: https://platform.stability.ai/docs
- Remove.bg: https://www.remove.bg/api
- BRIA API: https://docs.bria.ai/
