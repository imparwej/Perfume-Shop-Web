"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Check, Droplets, Wind, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  notes: string[];
}

const noteCategories: NoteCategory[] = [
  {
    id: "top",
    name: "Top Notes",
    icon: <Wind className="w-5 h-5" />,
    notes: ["Bergamot", "Citrus", "Pepper", "Ginger", "Lavender", "Mint"],
  },
  {
    id: "heart",
    name: "Heart Notes",
    icon: <Heart className="w-5 h-5" />,
    notes: ["Rose", "Jasmine", "Iris", "Oud", "Sandalwood", "Cedar"],
  },
  {
    id: "base",
    name: "Base Notes",
    icon: <Droplets className="w-5 h-5" />,
    notes: ["Vanilla", "Amber", "Musk", "Vetiver", "Leather", "Tonka"],
  },
];

const intensityLevels = [
  { id: "light", name: "Light", description: "Subtle, intimate presence" },
  { id: "moderate", name: "Moderate", description: "Balanced, versatile wear" },
  { id: "intense", name: "Intense", description: "Bold, commanding aura" },
];

const occasionTypes = [
  { id: "everyday", name: "Everyday", icon: "sun" },
  { id: "evening", name: "Evening", icon: "moon" },
  { id: "special", name: "Special Occasion", icon: "star" },
  { id: "romantic", name: "Romantic", icon: "heart" },
];

interface FragranceCustomizerProps {
  className?: string;
  preview?: boolean;
}

export function FragranceCustomizer({ className, preview = false }: FragranceCustomizerProps) {
  const [step, setStep] = useState(1);
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string[]>>({
    top: [],
    heart: [],
    base: [],
  });
  const [intensity, setIntensity] = useState<string>("moderate");
  const [occasion, setOccasion] = useState<string>("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = 4;

  const handleNoteToggle = (category: string, note: string) => {
    setSelectedNotes((prev) => {
      const current = prev[category] || [];
      if (current.includes(note)) {
        return { ...prev, [category]: current.filter((n) => n !== note) };
      }
      if (current.length < 2) {
        return { ...prev, [category]: [...current, note] };
      }
      return prev;
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return Object.values(selectedNotes).every((notes) => notes.length > 0);
      case 2:
        return !!intensity;
      case 3:
        return !!occasion;
      case 4:
        return email.includes("@");
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // BACKEND: Replace with API call to submit customization request
    // await fetch('/api/fragrance-consultation', {
    //   method: 'POST',
    //   body: JSON.stringify({ selectedNotes, intensity, occasion, email })
    // })
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className={cn("py-24 md:py-32 px-6", className)}>
        <div className="mx-auto max-w-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-accent" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
            Your Bespoke Journey Begins
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Our master perfumer will craft a personalized fragrance recommendation
            based on your preferences. Expect to hear from us within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsComplete(false);
              setStep(1);
              setSelectedNotes({ top: [], heart: [], base: [] });
              setIntensity("moderate");
              setOccasion("");
              setEmail("");
            }}
            className="text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Create Another Profile
          </button>
        </div>
      </div>
    );
  }

  // Preview mode - show only the selection step
  if (preview) {
    return (
      <div className={cn("", className)}>
        <div className="space-y-10">
          <div className="text-center">
            <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2">
              Customize Your Fragrance
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose your preferred notes
            </p>
          </div>

          {noteCategories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-accent">{category.icon}</div>
                <h4 className="text-xs tracking-wider uppercase text-foreground">
                  {category.name}
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.notes.map((note) => (
                  <button
                    key={note}
                    type="button"
                    className="px-4 py-2 text-xs border border-border hover:border-foreground text-foreground transition-all duration-300 rounded-sm"
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className={cn("py-24 md:py-32 px-6 bg-secondary/10", className)}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent text-xs tracking-wider uppercase rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Personalized Experience
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4">
            Create Your Signature Scent
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tell us about your preferences, and our master perfumer will craft
            a personalized recommendation just for you.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "flex items-center gap-3",
                  s <= step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    s < step
                      ? "bg-foreground text-background"
                      : s === step
                        ? "border-2 border-foreground"
                        : "border border-border"
                  )}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className="hidden md:block text-sm">
                  {s === 1 && "Notes"}
                  {s === 2 && "Intensity"}
                  {s === 3 && "Occasion"}
                  {s === 4 && "Contact"}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-background border border-border/50 p-8 md:p-12">
          {/* Step 1: Note Selection */}
          {step === 1 && (
            <div className="space-y-10">
              <div className="text-center">
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  Select Your Preferred Notes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose up to 2 notes from each category
                </p>
              </div>

              {noteCategories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-accent">{category.icon}</div>
                    <h4 className="text-sm tracking-wider uppercase text-foreground">
                      {category.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      ({selectedNotes[category.id]?.length || 0}/2)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {category.notes.map((note) => {
                      const isSelected = selectedNotes[category.id]?.includes(note);
                      return (
                        <button
                          key={note}
                          type="button"
                          onClick={() => handleNoteToggle(category.id, note)}
                          className={cn(
                            "px-5 py-2.5 text-sm transition-all duration-300",
                            isSelected
                              ? "bg-foreground text-background"
                              : "border border-border hover:border-foreground text-foreground"
                          )}
                        >
                          {note}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Intensity */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  Choose Your Intensity
                </h3>
                <p className="text-sm text-muted-foreground">
                  How prominent would you like your fragrance to be?
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {intensityLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setIntensity(level.id)}
                    className={cn(
                      "p-6 text-left transition-all duration-300 border",
                      intensity === level.id
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-foreground/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(level.id === "light" ? 1 : level.id === "moderate" ? 2 : 3)].map((_, i) => (
                        <Zap
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            intensity === level.id ? "text-accent" : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <h4 className="font-medium text-foreground mb-1">{level.name}</h4>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Occasion */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  When Will You Wear It?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select your primary occasion for this fragrance
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {occasionTypes.map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccasion(occ.id)}
                    className={cn(
                      "p-6 text-center transition-all duration-300 border",
                      occasion === occ.id
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-foreground/50"
                    )}
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary/50 flex items-center justify-center">
                      {occ.icon === "sun" && <span className="text-2xl">&#9728;</span>}
                      {occ.icon === "moon" && <span className="text-2xl">&#9789;</span>}
                      {occ.icon === "star" && <span className="text-2xl">&#9733;</span>}
                      {occ.icon === "heart" && <span className="text-2xl">&#9829;</span>}
                    </div>
                    <h4 className="font-medium text-foreground text-sm">{occ.name}</h4>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div className="space-y-8 max-w-md mx-auto">
              <div className="text-center">
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  Almost There
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter your email to receive your personalized recommendation
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-14 px-6 bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-300"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Your preferences will be reviewed by our master perfumer who will
                  create a bespoke recommendation tailored to your unique taste.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/50">
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className={cn(
                "text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-300",
                step === 1 && "invisible"
              )}
            >
              Back
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                disabled={!canProceed()}
                className={cn(
                  "group flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300",
                  canProceed()
                    ? "bg-foreground text-background hover:shadow-lg"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Continue
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className={cn(
                  "group flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300",
                  canProceed() && !isSubmitting
                    ? "bg-foreground text-background hover:shadow-lg"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    Get Recommendation
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
