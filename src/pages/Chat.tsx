import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/NavLink";
import { useToast } from "@/hooks/use-toast";
import { ParallaxSection } from "@/components/ParallaxSection";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI farming assistant. I can help you with plant diseases, crop management, soil health, and any agriculture-related questions. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response - Replace with actual AI integration
    setTimeout(() => {
      const responses = [
        "Based on your question, I recommend checking the soil pH levels and ensuring proper drainage. Early blight is often caused by excessive moisture and poor air circulation.",
        "For organic pest control, consider introducing beneficial insects like ladybugs or using neem oil spray. These methods are safe and effective.",
        "The yellowing of leaves could indicate nitrogen deficiency. I suggest applying a balanced fertilizer and monitoring the plant's response over the next week.",
        "To prevent disease spread, remove affected leaves immediately and ensure plants have adequate spacing for air circulation. Avoid overhead watering when possible."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: "assistant", content: randomResponse }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-primary">
            AgriDetect
          </NavLink>
          <div className="flex gap-4">
            <NavLink to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </NavLink>
            <NavLink to="/detection" className="text-foreground hover:text-primary transition-colors">
              Detection
            </NavLink>
            <NavLink to="/chat" className="text-primary font-semibold">
              AI Assistant
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col max-w-4xl">
        <ParallaxSection speed={0.03}>
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              AI Farming Assistant
            </h1>
            <p className="text-muted-foreground">
              Ask me anything about agriculture, plant care, or disease management
            </p>
          </div>
        </ParallaxSection>

        <ParallaxSection speed={0.05}>
          <Card className="flex-1 flex flex-col shadow-card-3d hover:shadow-glow transition-shadow duration-500 overflow-hidden" style={{ perspective: '1000px' }}>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-card hover:shadow-card-hover animate-float-slow transition-all">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-4 shadow-card hover:shadow-card-hover transform hover:scale-[1.02] transition-all duration-300 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-card hover:shadow-card-hover animate-float-slow transition-all">
                    <User className="w-5 h-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-4 bg-card shadow-card-3d">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about plant diseases, farming tips, or agriculture..."
                className="flex-1 shadow-card focus:shadow-card-hover transition-shadow"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-card-3d hover:shadow-glow transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
        </ParallaxSection>
      </main>
    </div>
  );
};

export default Chat;
