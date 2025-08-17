'use client';

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ThemeTest() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setTheme('light')} variant={theme === 'light' ? 'default' : 'outline'}>
              Light Mode
            </Button>
            <Button onClick={() => setTheme('dark')} variant={theme === 'dark' ? 'default' : 'outline'}>
              Dark Mode
            </Button>
            <Button onClick={() => setTheme('system')} variant={theme === 'system' ? 'default' : 'outline'}>
              System Mode
            </Button>
          </div>
          
          <div className="p-4 bg-background border border-border rounded-lg">
            <p className="text-foreground">Current theme: {theme}</p>
            <p className="text-muted-foreground">This text should be visible in both light and dark modes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-primary">Primary text</p>
                <p className="text-secondary">Secondary text</p>
                <p className="text-muted-foreground">Muted text</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-primary rounded"></div>
                  <div className="h-4 bg-secondary rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <Button className="w-full">Test Button</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
