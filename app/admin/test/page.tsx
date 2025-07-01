'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function WebSocketTestPage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'sent' | 'received' | 'system';
    content: string;
    timestamp: Date;
  }>>([]);
  const [messageInput, setMessageInput] = useState('');
  const [connectionUrl, setConnectionUrl] = useState('ws://localhost:8001/api/v1/ws');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add message to the list
  const addMessage = (type: 'sent' | 'received' | 'system', content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Connect to WebSocket
  const connectWebSocket = () => {
    try {
      addMessage('system', `Attempting to connect to ${connectionUrl}...`);

      const ws = new WebSocket(connectionUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setSocket(ws);
        addMessage('system', 'WebSocket connected successfully!');
      };

      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        addMessage('received', event.data);
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setSocket(null);
        addMessage('system', `WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason || 'Unknown'}`);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addMessage('system', 'WebSocket error occurred. Check console for details.');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      addMessage('system', `Failed to create WebSocket connection: ${error}`);
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      addMessage('system', 'Disconnecting WebSocket...');
    }
  };

  // Send message
  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && messageInput.trim()) {
      try {
        socket.send(messageInput);
        addMessage('sent', messageInput);
        setMessageInput('');
      } catch (error) {
        addMessage('system', `Failed to send message: ${error}`);
      }
    } else if (!socket || socket.readyState !== WebSocket.OPEN) {
      addMessage('system', 'WebSocket is not connected');
    }
  };

  // Send JSON message
  const sendJsonMessage = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        const jsonString = JSON.stringify(data);
        socket.send(jsonString);
        addMessage('sent', jsonString);
      } catch (error) {
        addMessage('system', `Failed to send JSON message: ${error}`);
      }
    } else {
      addMessage('system', 'WebSocket is not connected');
    }
  };

  // Predefined test messages
  const sendTestMessage = (type: string) => {
    const testMessages = {
      ping: { type: 'ping', timestamp: new Date().toISOString() },
      hello: { type: 'hello', message: 'Hello from WebSocket test page!' },
      document_update: {
        type: 'document_update',
        siteId: 'test-site-123',
        action: 'added',
        fileName: 'test-document.pdf'
      }
    };

    const message = testMessages[type as keyof typeof testMessages];
    if (message) {
      sendJsonMessage(message);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">WebSocket Test</h1>
        <Badge variant={isConnected ? "default" : "destructive"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="url">WebSocket URL</Label>
              <Input
                id="url"
                value={connectionUrl}
                onChange={(e) => setConnectionUrl(e.target.value)}
                placeholder="ws://localhost:8001/api/v1/ws"
                disabled={isConnected}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={connectWebSocket}
                disabled={isConnected}
                className="flex-1"
              >
                Connect
              </Button>
              <Button
                onClick={disconnectWebSocket}
                disabled={!isConnected}
                variant="outline"
                className="flex-1"
              >
                Disconnect
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Quick Test Messages</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendTestMessage('ping')}
                  disabled={!isConnected}
                >
                  Ping
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendTestMessage('hello')}
                  disabled={!isConnected}
                >
                  Hello
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendTestMessage('document_update')}
                  disabled={!isConnected}
                >
                  Doc Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send Message Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Enter your message here..."
                rows={4}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    sendMessage();
                  }
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={sendMessage}
                disabled={!isConnected || !messageInput.trim()}
                className="flex-1"
              >
                Send Message
              </Button>
              <Button
                onClick={() => setMessageInput('')}
                variant="outline"
              >
                Clear
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Tip: Press Ctrl+Enter to send message
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Messages Panel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Messages</CardTitle>
          <Button onClick={clearMessages} variant="outline" size="sm">
            Clear All
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full border rounded-md p-4">
            <div className="space-y-2">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No messages yet. Connect to WebSocket and start sending messages.
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.type === 'sent'
                        ? 'bg-blue-100 ml-8'
                        : message.type === 'received'
                        ? 'bg-green-100 mr-8'
                        : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <Badge
                        variant={
                          message.type === 'sent' ? 'default' :
                          message.type === 'received' ? 'secondary' :
                          'outline'
                        }
                        className="text-xs"
                      >
                        {message.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </pre>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}