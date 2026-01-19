export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, prompt } = req.body;

  if (!apiKey || !apiKey.startsWith('r8_')) {
    return res.status(400).json({ error: 'Valid API key required' });
  }

  try {
    console.log('🎨 이미지 생성 시작 (bytedance/seedream-4)');

    // ============================================
    // ⚠️ IMPORTANT: VERIFY MODEL VERSION ⚠️
    // ============================================
    // Visit: https://replicate.com/bytedance/seedream-4
    // Copy the correct version ID from the model page
    // Replace the version below with the actual version
    // ============================================

    // ============================================
    // ⭐ STEP 1: UPLOAD TO GOOGLE DRIVE ⭐
    // ============================================
    // 1. Upload reference-image.png to Google Drive
    // 2. Right-click → Share → Anyone with the link
    // 3. Copy the link (looks like: https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
    // 4. Extract FILE_ID from the link
    // 5. Use this format: https://drive.google.com/uc?export=view&id=FILE_ID
    
    const referenceImageUrl = 'https://drive.google.com/uc?export=view&id=1V9WajtkfRn5dsZTOWxiyqHSwPkOY_Jvh';
    
    console.log('📸 Using reference image:', referenceImageUrl);

    // Create prediction with bytedance/seedream-4
    // NOTE: Verify this version ID at https://replicate.com/bytedance/seedream-4
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "70c3b5d8a65ebfb1fddf4e7eb59dfef6b36d9e2ea8d02af5d0fcf5f79d5f07f2", // UPDATE THIS if needed
        input: {
          image: referenceImageUrl,
          prompt: prompt,
          strength: 0.9, // Control how much to change (0.0-1.0, higher = more change)
          num_inference_steps: 30,
          guidance_scale: 10.0,
          num_outputs: 1,
          output_format: "png"
        }
      })
    });
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('Replicate API error:', errorData);
      return res.status(createResponse.status).json({ 
        error: errorData.detail || 'Image generation failed' 
      });
    }

    const prediction = await createResponse.json();
    console.log('✅ Prediction created:', prediction.id);

    // Wait for completion
    let finalPrediction = prediction;
    while (finalPrediction.status === 'starting' || finalPrediction.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${finalPrediction.id}`, {
        headers: {
          'Authorization': `Token ${apiKey}`
        }
      });
      
      finalPrediction = await statusResponse.json();
    }

    if (finalPrediction.status === 'failed') {
      console.error('Prediction failed:', finalPrediction.error);
      return res.status(500).json({ error: finalPrediction.error || 'Generation failed' });
    }

    const imageUrl = finalPrediction.output && finalPrediction.output[0];
    
    if (!imageUrl) {
      console.error('No image in output:', finalPrediction);
      return res.status(500).json({ error: 'No image generated' });
    }

    console.log('✅ Image generated:', imageUrl);
    return res.status(200).json({ imageUrl });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
