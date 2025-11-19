import { useState, useRef } from "react";
import { Camera, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NavLink } from "@/components/NavLink";
import { ParallaxSection } from "@/components/ParallaxSection";

const Detection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasDetection, setHasDetection] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setHasDetection(true);
        stopCamera();
        toast({
          title: "Detection Complete",
          description: "Plant disease identified. View results below.",
        });
      };
      reader.readAsDataURL(file);
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
          <ParallaxSection speed={0.05}>
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Plant Disease Detection
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Use your camera or upload an image to instantly identify plant diseases and get AI-powered treatment recommendations
              </p>
            </div>
          </ParallaxSection>

          <ParallaxSection speed={0.08}>
            <Card className="p-8 shadow-card-3d hover:shadow-glow transition-all duration-500 transform hover:scale-[1.02]">
            <div className="space-y-6">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative shadow-card-3d" style={{ perspective: '1000px' }}>
                {!isDetecting && !hasDetection && !uploadedImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-glow-gradient">
                    <Camera className="w-16 h-16 mb-4 drop-shadow-glow" />
                    <p className="text-lg">Camera preview or uploaded image will appear here</p>
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${!isDetecting ? "hidden" : ""}`}
                />

                {uploadedImage && !isDetecting && (
                  <img src={uploadedImage} alt="Uploaded plant" className="w-full h-full object-cover" />
                )}

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

              <div className="flex gap-4 justify-center flex-wrap">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {!isDetecting && !hasDetection && (
                  <>
                    <Button 
                      onClick={startCamera}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-card-3d hover:shadow-glow transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start Camera
                    </Button>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      variant="outline"
                      className="shadow-card hover:shadow-card-hover transform hover:scale-105 transition-all duration-300"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Image
                    </Button>
                  </>
                )}

                {isDetecting && (
                  <>
                    <Button 
                      onClick={captureAndDetect}
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-card-3d hover:shadow-glow transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                    >
                      Capture & Detect
                    </Button>
                    <Button 
                      onClick={stopCamera}
                      size="lg"
                      variant="outline"
                      className="shadow-card hover:shadow-card-hover transform hover:scale-105 transition-all duration-300"
                    >
                      Stop Camera
                    </Button>
                  </>
                )}

                {hasDetection && (
                  <>
                    <Button 
                      onClick={() => {
                        setHasDetection(false);
                        setUploadedImage(null);
                        startCamera();
                      }}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-card-3d hover:shadow-glow transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Use Camera
                    </Button>
                    <Button 
                      onClick={() => {
                        setHasDetection(false);
                        setUploadedImage(null);
                        fileInputRef.current?.click();
                      }}
                      size="lg"
                      variant="outline"
                      className="shadow-card hover:shadow-card-hover transform hover:scale-105 transition-all duration-300"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Another
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
          </ParallaxSection>

          <ParallaxSection speed={0.05}>
            <Card className="p-6 bg-muted/50 border-accent/20 shadow-card-3d hover:shadow-glow transition-all duration-500 transform hover:scale-[1.02]">
            <h3 className="text-lg font-semibold text-foreground mb-3">How it works:</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li className="transform hover:translate-x-2 transition-transform duration-300">1. Click "Start Camera" or "Upload Image" to begin</li>
              <li className="transform hover:translate-x-2 transition-transform duration-300">2. Point the camera at the affected plant leaves or select an image</li>
              <li className="transform hover:translate-x-2 transition-transform duration-300">3. Click "Capture & Detect" to analyze the image</li>
              <li className="transform hover:translate-x-2 transition-transform duration-300">4. Get instant results and AI-powered treatment advice</li>
            </ol>
          </Card>
          </ParallaxSection>
        </div>
      </main>
    </div>
  );
};

export default Detection;
