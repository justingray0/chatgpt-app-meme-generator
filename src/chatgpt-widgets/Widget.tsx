import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDisplayMode, useMaxHeight, useWidgetProps } from '@/hooks';

interface WidgetProps {
  message?: string;
}

export default function Widget() {
  const displayMode = useDisplayMode();
  const maxHeight = useMaxHeight();
  const props = useWidgetProps<WidgetProps>();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Meme Generator Widget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Display Mode:</p>
          <p className="text-sm text-gray-600">{displayMode || 'Not available'}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium">Max Height:</p>
          <p className="text-sm text-gray-600">{maxHeight ? `${maxHeight}px` : 'Not available'}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium">Message:</p>
          <p className="text-sm text-gray-600">{props?.message || 'No message provided'}</p>
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-gray-500">
            Use MemeSelector and MemeGenerator widgets for creating memes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
