// pages/api/generate-image.js
// Replicate API를 사용한 이미지 생성

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, width = 1024, height = 1536 } = req.body;
  const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

  if (!REPLICATE_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // 1. Replicate prediction 생성 (Flux Schnell 모델 사용)
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "black-forest-labs/flux-schnell", // 또는 특정 버전 ID
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "2:3", // 1024x1536에 맞게
          output_format: "png",
          output_quality: 100,
          num_inference_steps: 4 // Schnell은 4 스텝 권장
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status}`);
    }

    const prediction = await response.json();
    
    // 2. Prediction 완료 대기
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 60; // 최대 1분 대기
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${REPLICATE_API_KEY}`,
          },
        }
      );
      
      const statusData = await statusResponse.json();
      
      if (statusData.status === 'succeeded') {
        imageUrl = statusData.output[0];
        break;
      } else if (statusData.status === 'failed') {
        throw new Error('Image generation failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    if (!imageUrl) {
      throw new Error('Image generation timeout');
    }

    return res.status(200).json({ imageUrl });

  } catch (error) {
    console.error('Image generation error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate image' 
    });
  }
}
