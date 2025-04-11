
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export function CampaignForm() {
  const { toast } = useToast();
  
  const handleSendTest = () => {
    toast({
      title: "Test Message Sent",
      description: "Your test message has been sent to your email address.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
        <CardDescription>Set up a new automated response campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input id="campaign-name" placeholder="e.g., Spring Promotion" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="campaign-type">Message Type</Label>
            <Select defaultValue="email">
              <SelectTrigger id="campaign-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="both">Email & SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="campaign-template">Message Template</Label>
            <Select>
              <SelectTrigger id="campaign-template">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Initial Lead Response</SelectItem>
                <SelectItem value="2">Quote Follow-up</SelectItem>
                <SelectItem value="4">Thank You After Job</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="campaign-subject">Subject Line (Email)</Label>
            <Input id="campaign-subject" placeholder="e.g., Your Roof Inspection Results" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="campaign-message">Message Preview</Label>
            <Textarea 
              id="campaign-message" 
              placeholder="Your message will appear here based on the selected template" 
              rows={5}
              defaultValue="Thank you for reaching out to [Company Name]! We've received your inquiry about roofing services. One of our specialists will contact you within 24 hours to discuss your needs. For immediate assistance, please call us at [Phone Number]."
            />
          </div>
          
          <div className="pt-2 flex flex-col space-y-2">
            <Button onClick={handleSendTest} variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Send Test
            </Button>
            <Button>Save Campaign</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
