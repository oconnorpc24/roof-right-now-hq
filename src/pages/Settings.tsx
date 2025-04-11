
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Settings as SettingsIcon, 
  User, 
  CreditCard, 
  Users, 
  BellRing, 
  Lock, 
  Save, 
  Building,
  Mail
} from 'lucide-react';

// Validation schema for the company form
const companyFormSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  address: z.string().min(5, { message: 'Please enter a valid address.' }),
  city: z.string().min(2, { message: 'Please enter a valid city.' }),
  state: z.string().min(2, { message: 'Please enter a valid state.' }),
  zip: z.string().min(5, { message: 'Please enter a valid ZIP code.' }),
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  
  // Initialize form with react-hook-form
  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: 'Roof Right Now',
      email: 'info@roofrightnow.com',
      phone: '(555) 123-4567',
      address: '123 Roofing Lane',
      city: 'Anytown',
      state: 'CA',
      zip: '91234',
      website: 'https://www.roofrightnow.com',
    },
  });
  
  function onCompanySubmit(values: z.infer<typeof companyFormSchema>) {
    // In a real app, this would save to a backend
    console.log(values);
    // Show success toast or message
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        
        <Tabs defaultValue="company" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[600px] grid-cols-3 mb-6">
            <TabsTrigger value="company" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Company
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              User Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <BellRing className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your company details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormField
                          control={companyForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormField
                          control={companyForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://www.example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormField
                          control={companyForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="contact@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormField
                          control={companyForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <FormField
                        control={companyForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <FormField
                          control={companyForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Anytown" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormField
                          control={companyForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <FormField
                          control={companyForm.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="91234" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>Manage your personal account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Admin User" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="admin@roofrightnow.com" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Change your account password</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        
                        <div></div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your billing information and subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Current Plan</h3>
                        <p className="text-sm text-muted-foreground">Professional Plan - $99/month</p>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium">Payment Method</h3>
                      <div className="flex items-center mt-2 p-3 border rounded-md">
                        <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Update Payment Method</Button>
                  <Button variant="outline">Billing History</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Email Notifications
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="new-leads">New Leads</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications when new leads are added</p>
                        </div>
                        <Switch id="new-leads" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="job-updates">Job Updates</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications for job status changes</p>
                        </div>
                        <Switch id="job-updates" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="crew-assignments">Crew Assignments</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications for crew assignment changes</p>
                        </div>
                        <Switch id="crew-assignments" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="payment-notifications">Payment Updates</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications about payments and invoices</p>
                        </div>
                        <Switch id="payment-notifications" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketing-emails">Marketing Updates</Label>
                          <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                        </div>
                        <Switch id="marketing-emails" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center">
                      <BellRing className="h-5 w-5 mr-2" />
                      App Notifications
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox id="push-everything" />
                        <div className="space-y-1 leading-none">
                          <Label htmlFor="push-everything">All notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive all push notifications</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox id="push-mentions" defaultChecked />
                        <div className="space-y-1 leading-none">
                          <Label htmlFor="push-mentions">Mentions</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications when you're mentioned</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox id="push-deployment" defaultChecked />
                        <div className="space-y-1 leading-none">
                          <Label htmlFor="push-deployment">Job Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications for critical job alerts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
