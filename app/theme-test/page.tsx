'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { WelcomeMessage } from '@/components/admin/WelcomeMessage';

export default function ThemeTestPage() {
  const { currentTheme, setTheme, isDark } = useAdminTheme();
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Theme Test Page</h1>
          <p className="text-lg mb-4">Testing different admin themes with better contrast and readability.</p>
          
          <div className="flex gap-4 mb-6 flex-wrap">
            <Button 
              onClick={() => setTheme('adminLight')}
              variant={currentTheme === 'adminLight' ? 'default' : 'outline'}
            >
              Light Theme
            </Button>
            <Button 
              onClick={() => setTheme('adminDark')}
              variant={currentTheme === 'adminDark' ? 'default' : 'outline'}
            >
              Dark Theme
            </Button>
            <Button 
              onClick={() => setTheme('adminDarkEnhanced')}
              variant={currentTheme === 'adminDarkEnhanced' ? 'default' : 'outline'}
            >
              Enhanced Dark Theme
            </Button>
          </div>
          
          <div className="text-sm space-y-2">
            <p>Current Theme: <Badge variant="outline">{currentTheme}</Badge></p>
            <p>Is Dark: <Badge variant="outline">{isDark ? 'Yes' : 'No'}</Badge></p>
          </div>
        </div>

        {/* Welcome Message Test */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome Message Component</h2>
          <WelcomeMessage 
            userName="Test User"
            stats={{
              totalUsers: 2847,
              totalSites: 12,
              growthRate: '+12%'
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cards Test */}
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>This is a card description to test text contrast</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This card tests the background, borders, and text contrast in different themes.</p>
              <div className="flex gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="outline">Outline</Button>
                <Button size="sm" variant="secondary">Secondary</Button>
              </div>
            </CardContent>
          </Card>

          {/* Input Test */}
          <Card>
            <CardHeader>
              <CardTitle>Input Components</CardTitle>
              <CardDescription>Testing input fields and form elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text Input</label>
                <Input 
                  placeholder="Enter some text here..."
                  value={inputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Disabled Input</label>
                <Input 
                  placeholder="This input is disabled"
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Buttons Test */}
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Testing all button variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="sm" variant="outline">Small Outline</Button>
                <Button size="lg">Large</Button>
                <Button size="lg" variant="outline">Large Outline</Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Badges Test */}
          <Card>
            <CardHeader>
              <CardTitle>Status Badges</CardTitle>
              <CardDescription>Testing status indicators and badges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-100 text-green-800">Success</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                <Badge className="bg-red-100 text-red-800">Error</Badge>
                <Badge className="bg-blue-100 text-blue-800">Info</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Outline Badge</Badge>
                <Badge variant="secondary">Secondary Badge</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Text Contrast Test */}
          <Card>
            <CardHeader>
              <CardTitle>Text Contrast Test</CardTitle>
              <CardDescription>Testing different text colors and contrast levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-900 dark:text-gray-100">Primary Text (Gray 900/100)</p>
              <p className="text-gray-800 dark:text-gray-200">Secondary Text (Gray 800/200)</p>
              <p className="text-gray-700 dark:text-gray-300">Tertiary Text (Gray 700/300)</p>
              <p className="text-gray-600 dark:text-gray-400">Muted Text (Gray 600/400)</p>
              <p className="text-gray-500 dark:text-gray-500">Subtle Text (Gray 500)</p>
              <p className="text-gray-400 dark:text-gray-600">Very Muted Text (Gray 400/600)</p>
              <p className="text-gray-300 dark:text-gray-700">Light Text (Gray 300/700)</p>
            </CardContent>
          </Card>

          {/* Background Test */}
          <Card>
            <CardHeader>
              <CardTitle>Background Test</CardTitle>
              <CardDescription>Testing different background colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white border rounded">
                <p className="text-sm">White Background</p>
              </div>
              <div className="p-4 bg-gray-50 border rounded">
                <p className="text-sm">Gray 50 Background</p>
              </div>
              <div className="p-4 bg-gray-100 border rounded">
                <p className="text-sm">Gray 100 Background</p>
              </div>
              <div className="p-4 bg-gray-200 border rounded">
                <p className="text-sm">Gray 200 Background</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Glass Effect Test */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Glass Effects</CardTitle>
            <CardDescription>Testing glass morphism effects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 glass rounded-lg">
                <h3 className="font-semibold mb-2">Glass Card 1</h3>
                <p className="text-sm">This card uses the glass effect with backdrop blur.</p>
              </div>
              <div className="p-6 glass-dark rounded-lg">
                <h3 className="font-semibold mb-2">Glass Dark Card</h3>
                <p className="text-sm">This card uses the dark glass effect.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/20 rounded-lg">
                <h3 className="font-semibold mb-2">Custom Glass</h3>
                <p className="text-sm">This card uses a custom gradient glass effect.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 