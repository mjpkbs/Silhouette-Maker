export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, prompt } = req.body;

  if (!apiKey || !apiKey.startsWith('r8_')) {
    return res.status(400).json({ error: 'Valid API key required' });
  }

  try {
    console.log('🎨 이미지 생성 시작 (img2img mode)');

    // ============================================
    // ⭐ STEP 1: UPLOAD TO GOOGLE DRIVE ⭐
    // ============================================
    // 1. Upload reference-image.png to Google Drive
    // 2. Right-click → Share → Anyone with the link
    // 3. Copy the link (looks like: https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
    // 4. Extract FILE_ID from the link
    // 5. Use this format: https://drive.google.com/uc?export=view&id=FILE_ID
    
    const referenceImageUrl = 'https://drive.google.com/uc?export=view&id=YOUR_FILE_ID';
    
    // Example:
    // Link from Google Drive: https://drive.google.com/file/d/1a2B3c4D5e6F7g8H9i0J/view?usp=sharing
    // Extract FILE_ID: 1a2B3c4D5e6F7g8H9i0J
    // Final URL: https://drive.google.com/uc?export=view&id=1a2B3c4D5e6F7g8H9i0J
    
    // Alternative (ImgBB):
    // const referenceImageUrl = 'https://i.ibb.co/abc123/reference.png';
    // ============================================
    
    console.log('📸 Using reference image:', referenceImageUrl);

    // Create prediction with SDXL img2img
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL img2img
        input: {
          image: referenceImageUrl,
          prompt: prompt,
          prompt_strength: 0.8, // 0.8 = More changes to person while keeping style (0.5=very similar, 0.9=very different)
          num_inference_steps: 30,
          guidance_scale: 9.0, // Higher = follows prompt more closely (7.5=balanced, 9-10=strict)
          scheduler: "K_EULER",
          num_outputs: 1
        }
      })
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
