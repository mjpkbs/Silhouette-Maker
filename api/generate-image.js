export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, prompt } = req.body;

  if (!apiKey || !apiKey.startsWith('r8_')) {
    return res.status(400).json({ error: 'Valid API key required' });
  }

  try {
    console.log('🎨 이미지 생성 시작 (text-to-image mode)');

    // Text-to-image: No reference image needed!
    // Just using prompt to generate from scratch
    
    // Using Flux Schnell (very fast text-to-image)
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637", // Flux Schnell (4 steps, very fast)
        input: {
          prompt: prompt,
          go_fast: true,
          num_outputs: 1,
          aspect_ratio: "3:4",
          output_format: "png",
          output_quality: 90
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
