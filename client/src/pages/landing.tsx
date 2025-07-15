import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Users, Zap, Shield, Paintbrush, MessageCircle, Lock, Globe, Eye, EyeOff } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-page">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg">
              <Palette className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-800 mb-6">
            CollabBoard
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto mb-8">
            The most intuitive real-time collaborative whiteboard for teams, students, and creators. 
            Draw, brainstorm, and collaborate together in real-time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-500 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Live collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Secure & private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Lightning fast</span>
            </div>
          </div>
        </div>

        {/* Room Types */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-neutral-800 mb-12">
            Choose Your Collaboration Style
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-neutral-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Public Rooms</CardTitle>
                <CardDescription className="text-base">
                  Open collaboration spaces where anyone can join and contribute
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="text-neutral-700">Open to everyone</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-neutral-700">Perfect for team brainstorming</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-neutral-700">Easy sharing with room codes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Paintbrush className="w-5 h-5 text-green-600" />
                  <span className="text-neutral-700">Full drawing capabilities</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Private Rooms</CardTitle>
                <CardDescription className="text-base">
                  Secure, password-protected spaces for confidential collaboration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <EyeOff className="w-5 h-5 text-purple-600" />
                  <span className="text-neutral-700">Password protected</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-neutral-700">Enhanced security</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-neutral-700">Controlled access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Paintbrush className="w-5 h-5 text-purple-600" />
                  <span className="text-neutral-700">Same powerful tools</span>
                </div>
              </CardContent>
            </Card>
          </div>
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
                See every stroke, shape, and emoji as your teammates draw. Live cursors show exactly who's working where.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-neutral-200 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Powerful Drawing Tools</CardTitle>
              <CardDescription>
                Pen, shapes, arrows, emojis, and more. Multiple colors, line widths, and undo/redo functionality.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-neutral-200 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Your data is safe with us. Private rooms with password protection and secure authentication.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Use Cases */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-800 mb-8">Perfect For</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Team Meetings</h3>
              <p className="text-sm text-neutral-600">Brainstorming sessions and planning</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Paintbrush className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Education</h3>
              <p className="text-sm text-neutral-600">Interactive lessons and tutoring</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Design</h3>
              <p className="text-sm text-neutral-600">Wireframing and prototyping</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Workshops</h3>
              <p className="text-sm text-neutral-600">Interactive presentations</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-md mx-auto border-neutral-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start?</CardTitle>
              <CardDescription className="text-base">
                Sign in to create your first collaborative whiteboard room
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-brand hover:opacity-90 text-white text-lg py-6"
                onClick={() => window.location.href = '/api/login'}
              >
                Get Started Free
              </Button>
              <p className="text-sm text-neutral-500 mt-4">
                No credit card required • Start collaborating in seconds
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
