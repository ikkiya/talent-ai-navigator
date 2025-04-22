
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Shield, Users, Settings } from 'lucide-react';

const Parameters = () => {
  const handleNotificationToggle = (enabled: boolean) => {
    console.log('Notifications enabled:', enabled);
    // Implement notification settings update
  };

  const handleSecurityToggle = (enabled: boolean) => {
    console.log('Enhanced security enabled:', enabled);
    // Implement security settings update
  };

  const handleSystemMaintenanceToggle = (enabled: boolean) => {
    console.log('System maintenance mode:', enabled);
    // Implement maintenance mode update
  };

  return (
    <Layout>
      <div className="space-y-6 p-6 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Parameters</h2>
          <p className="text-muted-foreground">
            Manage your system settings and preferences
          </p>
        </div>
        
        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Configure system notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch 
                  id="email-notifications" 
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-alerts">System Alerts</Label>
                <Switch 
                  id="system-alerts" 
                  defaultChecked 
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <Switch 
                  id="two-factor" 
                  onCheckedChange={handleSecurityToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="session-timeout">Extended Session Timeout</Label>
                <Switch 
                  id="session-timeout" 
                  onCheckedChange={handleSecurityToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* User Management Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>User Management</CardTitle>
              </div>
              <CardDescription>Configure user-related settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-approve">Auto-approve New Users</Label>
                <Switch id="auto-approve" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="user-limits">Enable User Limits</Label>
                <Switch id="user-limits" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>System</CardTitle>
              </div>
              <CardDescription>General system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <Switch 
                  id="maintenance-mode" 
                  onCheckedChange={handleSystemMaintenanceToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="debug-mode">Debug Mode</Label>
                <Switch id="debug-mode" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Parameters;
