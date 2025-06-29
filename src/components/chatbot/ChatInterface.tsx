import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFinance } from "@/context/FinanceContext";
import { generateAIResponse } from "@/lib/utils";
import { BrainCircuitIcon, SendIcon, UserIcon } from "lucide-react";

export function ChatInterface() {
  const { state, addChatMessage } = useFinance();
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [state.chatHistory]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    addChatMessage({
      text: input,
      sender: "user",
    });
    
    // Generate AI response based on actual data
    const aiResponse = generateAIResponse(input, state);
    
    // Add AI response after a short delay to simulate thinking
    setTimeout(() => {
      addChatMessage({
        text: aiResponse,
        sender: "ai",
      });
    }, 500);
    
    setInput("");
  };
  
  const suggestedQuestions = [
    "How much did I spend on food last month?",
    "What's my current savings rate?",
    "Am I over budget this month?",
    "When is my next bill due?",
    "How can I improve my finances?",
  ];
  
  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuitIcon className="h-5 w-5" />
          <span>Ask MoneyMap</span>
        </CardTitle>
        <CardDescription>
          Ask questions about your finances and get personalized insights
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(600px-8rem)] px-4" ref={scrollAreaRef}>
          {state.chatHistory.length > 0 ? (
            <div className="space-y-6 pt-6 pb-4">
              {state.chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[90%] items-start gap-2 rounded-lg px-6 py-4 mb-2 shadow ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <Avatar className="h-8 w-8">
                        <BrainCircuitIcon className="h-5 w-5" />
                      </Avatar>
                    )}
                    <div>
                      <p className="whitespace-pre-line break-words">{message.text}</p>
                      <p className="mt-2 text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8">
                        <UserIcon className="h-5 w-5" />
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {state.loading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[90%] items-start gap-2 rounded-lg bg-muted px-6 py-4 mb-2 shadow">
                    <Avatar className="h-8 w-8">
                      <BrainCircuitIcon className="h-5 w-5" />
                    </Avatar>
                    <div>
                      <p>Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <BrainCircuitIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                Ask MoneyMap about your finances
              </h3>
              <p className="mb-4 text-muted-foreground">
                Get insights, recommendations, and answers to your financial questions
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="-mt-2 pt-0 pb-2 px-6">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask a question about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>
            <SendIcon className="h-4 w-4" />
            <span className="ml-2">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}