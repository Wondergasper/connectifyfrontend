import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { toast } from "sonner";

const languages = [
  { name: "English", region: "Default app language" },
  { name: "Yoruba", region: "Nigeria" },
  { name: "Hausa", region: "Nigeria" },
  { name: "Igbo", region: "Nigeria" },
  { name: "Nigerian Pidgin", region: "Nigeria" },
];

const LanguageSettings = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const chooseLanguage = (language: string) => {
    setSelectedLanguage(language);
    toast.success(`${language} selected`);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="gradient-primary px-6 pt-12 pb-8 rounded-b-[2rem] shadow-strong">
        <button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="mb-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-soft hover:bg-white/30 transition-smooth"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">Language</h1>
          <p className="text-sm text-white/80 mt-1">Choose how Connectify speaks to you</p>
        </div>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-card rounded-2xl shadow-medium border border-border overflow-hidden divide-y divide-border">
          {languages.map((language) => {
            const isSelected = language.name === selectedLanguage;

            return (
              <button
                key={language.name}
                onClick={() => chooseLanguage(language.name)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? "gradient-primary shadow-soft" : "bg-muted"
                  }`}>
                    <Globe className={`w-5 h-5 ${isSelected ? "text-white" : "text-foreground"}`} />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{language.name}</div>
                    <div className="text-xs text-muted-foreground">{language.region}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
