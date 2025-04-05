
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Bell, Moon, Eye, Shield, Mail, BellOff, Lock, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Settings = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      mentionNotifications: true,
      assignmentNotifications: true,
      weeklyDigest: false
    },
    appearance: {
      darkMode: false,
      compactView: false,
      animationsEnabled: true,
      highContrastMode: false
    },
    privacy: {
      showOnlineStatus: true,
      dataCollection: true,
      shareUsageData: false,
      twoFactorEnabled: false
    }
  });

  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [advanced, setAdvanced] = useState(false);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Apply dark mode when setting changes
  useEffect(() => {
    if (settings.appearance.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.appearance.darkMode]);
  
  const updateSetting = (category: keyof typeof settings, setting: string, value: boolean) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };
    
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Apply specific settings
    if (category === 'appearance' && setting === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    toast({
      title: "Setting updated",
      description: `${setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been ${value ? 'enabled' : 'disabled'}.`
    });
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
      console.error("Logout error:", error);
    }
  };
  
  const setup2FA = () => {
    // In a real app, this would generate a QR code and secret from the backend
    setIs2FADialogOpen(true);
  };
  
  const verify2FACode = () => {
    // In a real app, this would verify the code with the backend
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      updateSetting('privacy', 'twoFactorEnabled', true);
      setIs2FADialogOpen(false);
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully set up."
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => 
                        updateSetting('notifications', 'email', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in your browser
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => 
                        updateSetting('notifications', 'push', checked)
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mention-notifications">Mentions</Label>
                      <p className="text-sm text-muted-foreground">
                        When someone mentions you in a comment or note
                      </p>
                    </div>
                    <Switch
                      id="mention-notifications"
                      checked={settings.notifications.mentionNotifications}
                      onCheckedChange={(checked) => 
                        updateSetting('notifications', 'mentionNotifications', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="assignment-notifications">Assignments</Label>
                      <p className="text-sm text-muted-foreground">
                        When you're assigned to a project or task
                      </p>
                    </div>
                    <Switch
                      id="assignment-notifications"
                      checked={settings.notifications.assignmentNotifications}
                      onCheckedChange={(checked) => 
                        updateSetting('notifications', 'assignmentNotifications', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-digest">Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a summary of activities once a week
                      </p>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={settings.notifications.weeklyDigest}
                      onCheckedChange={(checked) => 
                        updateSetting('notifications', 'weeklyDigest', checked)
                      }
                    />
                  </div>
                </div>
                
                <Collapsible open={advanced} onOpenChange={setAdvanced} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Advanced Settings</h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {advanced ? "Hide advanced" : "Show advanced"}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="space-y-4 pt-2">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-4">
                        <BellOff className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h4 className="text-sm font-medium">Do Not Disturb</h4>
                          <p className="text-sm text-muted-foreground">
                            Schedule times when you don't want to receive notifications
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Configure Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  <span>Appearance</span>
                </CardTitle>
                <CardDescription>
                  Customize how TalentNavigator looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for the application
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.appearance.darkMode}
                    onCheckedChange={(checked) => 
                      updateSetting('appearance', 'darkMode', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Use less space between elements
                    </p>
                  </div>
                  <Switch
                    id="compact-view"
                    checked={settings.appearance.compactView}
                    onCheckedChange={(checked) => 
                      updateSetting('appearance', 'compactView', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animations">Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable animations throughout the interface
                    </p>
                  </div>
                  <Switch
                    id="animations"
                    checked={settings.appearance.animationsEnabled}
                    onCheckedChange={(checked) => 
                      updateSetting('appearance', 'animationsEnabled', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase color contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={settings.appearance.highContrastMode}
                    onCheckedChange={(checked) => 
                      updateSetting('appearance', 'highContrastMode', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacy & Security</span>
                </CardTitle>
                <CardDescription>
                  Manage your security settings and data preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="online-status">Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see when you're active
                    </p>
                  </div>
                  <Switch
                    id="online-status"
                    checked={settings.privacy.showOnlineStatus}
                    onCheckedChange={(checked) => 
                      updateSetting('privacy', 'showOnlineStatus', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection">Usage Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow collection of anonymous usage data to improve the service
                    </p>
                  </div>
                  <Switch
                    id="data-collection"
                    checked={settings.privacy.dataCollection}
                    onCheckedChange={(checked) => 
                      updateSetting('privacy', 'dataCollection', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-usage">Share Usage with AI</Label>
                    <p className="text-sm text-muted-foreground">
                      Share usage data to improve AI recommendations
                    </p>
                  </div>
                  <Switch
                    id="share-usage"
                    checked={settings.privacy.shareUsageData}
                    onCheckedChange={(checked) => 
                      updateSetting('privacy', 'shareUsageData', checked)
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Two-factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={settings.privacy.twoFactorEnabled ? undefined : setup2FA}
                      >
                        {settings.privacy.twoFactorEnabled ? 'Manage 2FA' : 'Setup 2FA'}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Sessions</h4>
                      <div className="rounded-md border p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">Started April 3, 2025</p>
                          </div>
                          <Button variant="destructive" size="sm" onClick={handleLogout}>
                            Log Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* 2FA Setup Dialog */}
      <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup Two-factor Authentication</DialogTitle>
            <DialogDescription>
              Scan this QR code with your authenticator app and enter the verification code below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="border p-4 bg-white">
              {/* This would be a QR code in a real app */}
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <Lock className="h-16 w-16 text-gray-400" />
                <span className="sr-only">QR Code placeholder</span>
              </div>
            </div>
            
            <div className="w-full space-y-2">
              <Label htmlFor="recovery-key">Recovery Key (save this in a safe place)</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="recovery-key"
                  value="ABCD-EFGH-IJKL-MNOP"
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="w-full space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input 
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={verify2FACode}>Verify and Enable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Settings;
