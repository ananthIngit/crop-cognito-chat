import { useState, useRef } from "react";
import { Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NavLink } from "@/components/NavLink";

const Detection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasDetection, setHasDetection] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsDetecting(true);
        toast({
          title: "Camera Started",
          description: "Point your camera at the plant to detect diseases",
        });
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsDetecting(false);
    }
  };

  const captureAndDetect = () => {
    // Simulate detection - integrate your actual detection code here
    setHasDetection(true);
    stopCamera();
    toast({
      title: "Detection Complete",
      description: "Plant disease identified. View results below.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-primary">
            AgriDetect
          </NavLink>
          <div className="flex gap-4">
            <NavLink to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </NavLink>
            <NavLink to="/detection" className="text-primary font-semibold">
              Detection
            </NavLink>
            <NavLink to="/chat" className="text-foreground hover:text-primary transition-colors">
              AI Assistant
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Plant Disease Detection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Use your camera to instantly identify plant diseases and get AI-powered treatment recommendations
            </p>
          </div>

          <Card className="p-8 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="space-y-6">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                {!isDetecting && !hasDetection && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <Camera className="w-16 h-16 mb-4" />
                    <p className="text-lg">Camera preview will appear here</p>
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${!isDetecting ? "hidden" : ""}`}
                />

                {hasDetection && (
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="bg-card p-6 rounded-lg shadow-lg text-center max-w-md">
                      <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">Disease Detected</h3>
                      <p className="text-muted-foreground mb-4">
                        Early Blight detected on tomato plant leaves
                      </p>
                      <NavLink to="/chat?disease=early-blight">
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                          Get AI Treatment Advice
                        </Button>
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                {!isDetecting && !hasDetection && (
                  <Button 
                    onClick={startCamera}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Camera
                  </Button>
                )}

                {isDetecting && (
                  <>
                    <Button 
                      onClick={captureAndDetect}
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Capture & Detect
                    </Button>
                    <Button 
                      onClick={stopCamera}
                      size="lg"
                      variant="outline"
                    >
                      Stop Camera
                    </Button>
                  </>
                )}

                {hasDetection && (
                  <Button 
                    onClick={() => {
                      setHasDetection(false);
                      startCamera();
                    }}
                    size="lg"
                    variant="outline"
                  >
                    Scan Another Plant
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50 border-accent/20">
            <h3 className="text-lg font-semibold text-foreground mb-3">How it works:</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li>1. Click "Start Camera" to activate your device's camera</li>
              <li>2. Point the camera at the affected plant leaves</li>
              <li>3. Click "Capture & Detect" to analyze the image</li>
              <li>4. Get instant results and AI-powered treatment advice</li>
            </ol>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Detection;
