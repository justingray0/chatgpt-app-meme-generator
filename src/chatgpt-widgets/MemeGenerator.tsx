import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOpenAiGlobal } from '@/hooks';
import { fabric } from 'fabric';

interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

interface TextPosition {
  top: string;
  left: string;
  fontSize: number;
}

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState('Impact');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [loading, setLoading] = useState(false);
  const [memeGenerated, setMemeGenerated] = useState<string | null>(null);
  const toolOutput = useOpenAiGlobal('toolOutput');
  const displayMode = useOpenAiGlobal('displayMode');

  const fontFamilies = [
    'Impact',
    'Arial Black',
    'Comic Sans MS',
    'Trebuchet MS',
    'Helvetica',
    'Times New Roman'
  ];

  const textPositions: Record<string, TextPosition> = {
    top: { top: '10%', left: '50%', fontSize: 40 },
    bottom: { top: '85%', left: '50%', fontSize: 40 },
    center: { top: '50%', left: '50%', fontSize: 30 }
  };

  useEffect(() => {
    // Get selected meme from widget state or tool output
    const widgetState = window.openai?.widgetState;
    let meme: Meme | null = null;

    if (toolOutput?.selectedMeme) {
      meme = toolOutput.selectedMeme;
    } else if (widgetState?.selectedMeme) {
      meme = widgetState.selectedMeme;
    }

    if (meme) {
      setSelectedMeme(meme);
      initializeCanvas(meme);
    }
  }, [toolOutput]);

  const initializeCanvas = (meme: Meme) => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: meme.width,
      height: meme.height,
      selection: false,
    });

    // Load the meme image as background
    fabric.Image.fromURL(meme.url, (img) => {
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
        crossOrigin: 'anonymous',
      });
    });

    setCanvas(fabricCanvas);
  };

  const addText = (text: string, position: keyof typeof textPositions) => {
    if (!canvas || !text) return;

    const pos = textPositions[position];
    const fabricText = new fabric.Text(text.toUpperCase(), {
      top: parseInt(pos.top) * canvas.height! / 100,
      left: parseInt(pos.left) * canvas.width! / 100,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: textColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
    });

    canvas.add(fabricText);
    canvas.renderAll();
  };

  const generateMeme = () => {
    if (!canvas) return;

    setLoading(true);
    
    // Clear existing text
    canvas.getObjects().forEach(obj => {
      if (obj.type === 'text') {
        canvas.remove(obj);
      }
    });

    // Add new text
    if (topText) addText(topText, 'top');
    if (bottomText) addText(bottomText, 'bottom');

    // Generate the meme image
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });

    setMemeGenerated(dataURL);
    setLoading(false);
  };

  const downloadMeme = () => {
    if (!memeGenerated) return;

    const link = document.createElement('a');
    link.href = memeGenerated;
    link.download = `meme-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetCanvas = () => {
    if (!canvas || !selectedMeme) return;
    
    canvas.getObjects().forEach(obj => {
      if (obj.type === 'text') {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();
    setMemeGenerated(null);
    setTopText('');
    setBottomText('');
  };

  if (!selectedMeme) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-500">No meme template selected.</p>
            <p className="text-sm text-gray-400 mt-2">
              Please select a meme template first using the meme selector tool.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Meme: {selectedMeme.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canvas */}
        <div className="flex justify-center">
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Text Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="topText">Top Text</Label>
            <Input
              id="topText"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="Enter top text..."
            />
          </div>
          <div>
            <Label htmlFor="bottomText">Bottom Text</Label>
            <Input
              id="bottomText"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="Enter bottom text..."
            />
          </div>
        </div>

        {/* Style Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="fontSize">Font Size</Label>
            <Input
              id="fontSize"
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value) || 40)}
              min="10"
              max="100"
            />
          </div>
          <div>
            <Label htmlFor="fontFamily">Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <Input
              id="textColor"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="strokeColor">Stroke Color</Label>
            <Input
              id="strokeColor"
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
            />
          </div>
        </div>

        {/* Stroke Width */}
        <div>
          <Label htmlFor="strokeWidth">Stroke Width</Label>
          <Input
            id="strokeWidth"
            type="number"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value) || 3)}
            min="0"
            max="10"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={generateMeme} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Meme'}
          </Button>
          <Button variant="outline" onClick={resetCanvas}>
            Reset
          </Button>
          {memeGenerated && (
            <Button onClick={downloadMeme} variant="secondary">
              Download Meme
            </Button>
          )}
        </div>

        {/* Generated Meme Preview */}
        {memeGenerated && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Generated Meme:</h3>
            <div className="flex justify-center">
              <img
                src={memeGenerated}
                alt="Generated meme"
                className="max-w-full h-auto border-2 border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
