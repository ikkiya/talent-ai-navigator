
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Building, Calendar, Edit, Save } from 'lucide-react';

const Profile = () => {
  const { auth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: auth.user?.firstName || '',
    lastName: auth.user?.lastName || '',
    email: auth.user?.email || '',
    phone: '(555) 123-4567', // Mock data
    department: 'Technology',  // Mock data
    joinDate: '2022-05-10',   // Mock data
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call an API to update the profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
    setIsEditing(false);
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and settings
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Personal Information</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input 
                        id="firstName" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input 
                        id="lastName" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input 
                        id="department" 
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input 
                        id="joinDate" 
                        name="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                {isEditing && (
                  <div className="flex justify-end gap-2 w-full">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={auth.user?.avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {auth.user?.firstName?.[0]}{auth.user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-medium">{auth.user?.firstName} {auth.user?.lastName}</h3>
                <p className="text-muted-foreground capitalize">{auth.user?.role}</p>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-medium">{auth.user?.username}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Account ID</span>
                  <span className="font-medium">{auth.user?.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium capitalize">{auth.user?.role}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
