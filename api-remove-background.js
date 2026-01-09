// pages/api/remove-background.js
// BRIA 또는 Remove.bg API를 사용한 배경 제거

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl } = req.body;
  
  // 옵션 1: BRIA API (무료 티어 있음)
  const BRIA_API_KEY = process.env.BRIA_API_KEY;
  
  // 옵션 2: Remove.bg API
  const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

  try {
    // BRIA API 사용 예시
    if (BRIA_API_KEY) {
      // 1. 이미지 다운로드
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');

      // 2. BRIA API 호출
      const briaResponse = await fetch(
        'https://engine.prod.bria-api.com/v1/background/remove',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api_token': BRIA_API_KEY
          },
          body: JSON.stringify({
            file: base64Image,
            output_type: 'url' // 또는 'base64'
          })
        }
      );

      if (!briaResponse.ok) {
        throw new Error(`BRIA API error: ${briaResponse.status}`);
      }

      const briaData = await briaResponse.json();
      return res.status(200).json({ 
        transparentImageUrl: briaData.result_url 
      });
    }
    
    // Remove.bg API 사용 예시
    if (REMOVE_BG_API_KEY) {
      const formData = new FormData();
      formData.append('image_url', imageUrl);
      formData.append('size', 'auto');
      formData.append('format', 'png');
      
      const removeBgResponse = await fetch(
        'https://api.remove.bg/v1.0/removebg',
        {
          method: 'POST',
          headers: {
            'X-Api-Key': REMOVE_BG_API_KEY
          },
          body: formData
        }
      );

      if (!removeBgResponse.ok) {
        throw new Error(`Remove.bg API error: ${removeBgResponse.status}`);
      }

      const resultBuffer = await removeBgResponse.arrayBuffer();
      const base64Result = Buffer.from(resultBuffer).toString('base64');
      const dataUrl = `data:image/png;base64,${base64Result}`;
      
      return res.status(200).json({ 
        transparentImageUrl: dataUrl 
      });
    }

    // API 키가 없는 경우
    throw new Error('Background removal API key not configured');

  } catch (error) {
    console.error('Background removal error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to remove background' 
    });
  }
}


// 대안: Replicate의 RMBG 모델 사용
export async function removeBackgroundWithReplicate(imageUrl, apiKey) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "cjwbw/rembg", // RMBG 모델
      input: {
        image: imageUrl
      }
    })
  });

  const prediction = await response.json();
  
  // Prediction 완료 대기 (위 코드와 동일한 로직)
  let resultUrl = null;
  let attempts = 0;
  
  while (attempts < 30) {
    const statusResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: {
          'Authorization': `Token ${apiKey}`,
        },
      }
    );
    
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'succeeded') {
      resultUrl = statusData.output;
      break;
    } else if (statusData.status === 'failed') {
      throw new Error('Background removal failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  return resultUrl;
}
