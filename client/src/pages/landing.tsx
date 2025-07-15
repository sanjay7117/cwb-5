import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Users, Zap, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-page">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-brand rounded-xl flex items-center justify-center">
              <Palette className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-4">
            CollabBoard
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Real-time collaborative whiteboard for teams. Draw, create, and collaborate together in real-time.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-neutral-200 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Real-time Collaboration</CardTitle>
              <CardDescription>
                Work together with your team in real-time. See cursors, changes, and participants instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-neutral-200 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Powerful Tools</CardTitle>
              <CardDescription>
                Full suite of drawing tools including shapes, colors, emojis, and more. Everything you need to create.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-neutral-200 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Create private rooms with unique codes. Your work is secure and only accessible to invited participants.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-md mx-auto border-neutral-200 shadow-lg">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in to create your first collaborative whiteboard room
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-brand hover:opacity-90 text-white"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
