import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { useOpenAiGlobal } from '@/hooks';
import { useWidgetState } from '@/hooks';
import { useIsMobile } from '../hooks/use-mobile';

interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

interface MemeSelectorProps {
  onMemeSelect?: (meme: Meme) => void;
}

const MemeSelector: React.FC<MemeSelectorProps> = ({ onMemeSelect }) => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'inline' | 'pip' | 'fullscreen'>('inline');
  const { toast } = useToast();
  const callTool = useOpenAiGlobal('callTool');
  const [widgetState, setWidgetState] = useWidgetState<{ selectedMemeId: string | null }>({ selectedMemeId: null });
  const isMobile = useIsMobile();

  useEffect(() => {
    // Fetch available memes from imgflip API
    const fetchMemes = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        
        if (data.success) {
          setMemes(data.data.memes);
          setFilteredMemes(data.data.memes);
          setLoading(false);
        } else {
          setError('Failed to fetch memes');
          setLoading(false);
        }
      } catch (err) {
        setError('Error fetching memes');
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  useEffect(() => {
    // Filter memes based on search term
    if (searchTerm.trim() === '') {
      setFilteredMemes(memes);
    } else {
      const filtered = memes.filter(meme => 
        meme.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMemes(filtered);
    }
  }, [searchTerm, memes]);

  useEffect(() => {
    // Restore selected meme from widget state
    if (widgetState?.selectedMemeId && memes.length > 0) {
      const meme = memes.find(m => m.id === widgetState.selectedMemeId);
      if (meme) setSelectedMeme(meme);
    }
  }, [widgetState?.selectedMemeId, memes]);

  const handleMemeSelect = (meme: Meme) => {
    setSelectedMeme(meme);
    setWidgetState({ selectedMemeId: meme.id });
    toast({
      title: "Meme Selected",
      description: `Selected "${meme.name}"`,
    });
  };

  const handleGenerateMeme = async () => {
    if (!selectedMeme || !callTool) return;
    
    try {
      // Call the generate_meme tool
      await callTool('generate_meme', {
        template_id: selectedMeme.id,
        template_name: selectedMeme.name,
        template_url: selectedMeme.url,
        boxes: selectedMeme.box_count
      });
      
      toast({
        title: "Generating Meme",
        description: `Generating meme with "${selectedMeme.name}" template`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate meme",
        variant: "destructive"
      });
    }
  };

  const handleSelectMeme = (meme: Meme) => {
    if (onMemeSelect) {
      onMemeSelect(meme);
    } else {
      handleMemeSelect(meme);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className={`p-4 ${displayMode === 'fullscreen' ? 'max-w-6xl mx-auto' : ''}`}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meme Generator</CardTitle>
          <CardDescription>Select a meme template to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search for memes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {selectedMeme && (
            <div className="mb-4 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Selected: {selectedMeme.name}</h3>
                  <p className="text-sm text-gray-500">Text boxes: {selectedMeme.box_count}</p>
                </div>
                <Button onClick={handleGenerateMeme} className="ml-2">
                  Generate Meme
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMemes.map((meme) => (
              <Card 
                key={meme.id} 
                className={`cursor-pointer transition-all ${selectedMeme?.id === meme.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleSelectMeme(meme)}
              >
                <CardContent className="p-2">
                  <div className="aspect-square relative mb-2">
                    <img 
                      src={meme.url} 
                      alt={meme.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <h3 className="font-medium text-sm truncate">{meme.name}</h3>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {meme.box_count} {meme.box_count === 1 ? 'text box' : 'text boxes'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemeSelector;
