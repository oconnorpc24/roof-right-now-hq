
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types for follow-ups
interface FollowUp {
  id: string;
  leadName: string;
  dueDate: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800"
};

// Demo follow-ups
const demoFollowUps: FollowUp[] = [
  {
    id: '1',
    leadName: 'John Smith',
    dueDate: '2025-04-14',
    description: 'Follow up on roof inspection appointment',
    completed: false,
    priority: 'high'
  },
  {
    id: '2',
    leadName: 'Sarah Johnson',
    dueDate: '2025-04-15',
    description: 'Call back regarding quote questions',
    completed: false,
    priority: 'medium'
  },
  {
    id: '3',
    leadName: 'Michael Brown',
    dueDate: '2025-04-16',
    description: 'Send additional material options via email',
    completed: false,
    priority: 'low'
  },
  {
    id: '4',
    leadName: 'Emma Davis',
    dueDate: '2025-04-13',
    description: 'Check if they received the estimate',
    completed: true,
    priority: 'medium'
  }
];

interface FollowUpTrackerProps {
  className?: string;
}

export function FollowUpTracker({ className }: FollowUpTrackerProps) {
  const [followUps, setFollowUps] = useState<FollowUp[]>(demoFollowUps);
  const [showCompleted, setShowCompleted] = useState(false);
  
  const toggleFollowUpStatus = (id: string) => {
    setFollowUps(followUps.map(followUp => 
      followUp.id === id 
        ? { ...followUp, completed: !followUp.completed } 
        : followUp
    ));
  };
  
  const filteredFollowUps = followUps.filter(followUp => 
    showCompleted ? true : !followUp.completed
  );
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Follow-Up Tasks</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? "Hide Completed" : "Show Completed"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredFollowUps.length > 0 ? (
            filteredFollowUps.map((followUp) => (
              <div key={followUp.id} className={cn(
                "flex items-start justify-between p-3 border rounded-lg",
                followUp.completed ? "bg-muted/50" : "hover:bg-muted/50"
              )}>
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id={`followup-${followUp.id}`}
                    checked={followUp.completed}
                    onCheckedChange={() => toggleFollowUpStatus(followUp.id)}
                    className="mt-1"
                  />
                  <div>
                    <label 
                      htmlFor={`followup-${followUp.id}`}
                      className={cn(
                        "font-medium cursor-pointer",
                        followUp.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {followUp.leadName}
                    </label>
                    <p className={cn(
                      "text-sm",
                      followUp.completed ? "text-muted-foreground line-through" : ""
                    )}>
                      {followUp.description}
                    </p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(followUp.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={cn(
                  "rounded-full font-normal",
                  priorityColors[followUp.priority]
                )}>
                  {followUp.priority.charAt(0).toUpperCase() + followUp.priority.slice(1)}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No follow-ups {showCompleted ? "" : "pending"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default FollowUpTracker;
