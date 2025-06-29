import { SettingsForm } from "@/components/settings/SettingsForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Settings() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your app preferences and data
        </p>
      </div>
      <Button className="mb-2" onClick={() => navigate('/profile')}>
        My Profile
      </Button>
      <SettingsForm />
    </div>
  );
}